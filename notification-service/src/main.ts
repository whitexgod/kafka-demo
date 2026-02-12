import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startConsumer } from './kafka/consumer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await startConsumer();
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
