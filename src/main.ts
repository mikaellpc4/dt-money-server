import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const serverPort = process.env.PORT || 3333;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(serverPort);
}
bootstrap();
