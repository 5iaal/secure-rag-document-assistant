import asyncio
import json

import aio_pika

from app.core.config import settings
from app.database.session import SessionLocal
from app.services.document_processor import process_document_job

QUEUE_NAME = "document_processing_jobs"


async def consume_jobs():
    print("[+] Worker Service started...")
    print("[+] Connecting to RabbitMQ...")

    connection = await aio_pika.connect_robust(settings.rabbitmq_url)

    async with connection:
        channel = await connection.channel()

        queue = await channel.declare_queue(
            QUEUE_NAME,
            durable=True,
        )

        print(f"[+] Waiting for jobs on queue: {QUEUE_NAME}")

        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    job = json.loads(message.body.decode("utf-8"))

                    db = SessionLocal()
                    try:
                        process_document_job(db, job)
                    except Exception as exc:
                        print(f"[!] Worker error: {exc}")
                    finally:
                        db.close()


if __name__ == "__main__":
    asyncio.run(consume_jobs())