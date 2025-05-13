import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Aktifkan CORS
  app.enableCors({
    origin: 'http://localhost:5174', // frontend-mu
    credentials: true, // jika kamu menggunakan cookies atau auth headers
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
