import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['kafka:29092'],
});

export const consumer = kafka.consumer({
  groupId: 'notification-group',
});

export const startConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: 'job-events',
    fromBeginning: true,
  });

  await consumer.subscribe({
    topic: 'analytics-events',
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) {
        return;
      }

      let data: { title?: string; jobId?: string };
      try {
        data = JSON.parse(message.value.toString());
      } catch {
        console.warn('Skipping invalid JSON message on topic:', topic);
        return;
      }

      if (topic === 'job-events') {
        console.log('📩 Sending Notification for Job:', data.title);
      }

      if (topic === 'analytics-events') {
        console.log('📊 Incrementing View Count for Job:', data.jobId);
      }
    },
  });
};
