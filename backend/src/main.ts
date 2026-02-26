import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  })

  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`🚀 Backend running on port ${port}`)
}
bootstrap()