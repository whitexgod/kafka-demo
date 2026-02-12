import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectProducer } from './kafka/producer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await connectProducer();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
