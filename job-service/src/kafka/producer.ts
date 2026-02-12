import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'job-service',
  brokers: ['kafka:29092'], // important for Docker network
});

export const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log('Job Service Kafka Producer Connected');
};
