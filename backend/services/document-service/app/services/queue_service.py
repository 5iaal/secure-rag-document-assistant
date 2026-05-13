import json
import aio_pika

from app.core.config import settings


QUEUE_NAME = "document_processing_jobs"


async def publish_document_job(job_data: dict) -> None:
    connection = await aio_pika.connect_robust(settings.rabbitmq_url)

    async with connection:
        channel = await connection.channel()

        await channel.declare_queue(
            QUEUE_NAME,
            durable=True,
        )

        message = aio_pika.Message(
            body=json.dumps(job_data).encode("utf-8"),
            delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
        )

        await channel.default_exchange.publish(
            message,
            routing_key=QUEUE_NAME,
        )