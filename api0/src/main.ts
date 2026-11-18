import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DrizzleExceptionFilter } from './db/drizzle-exception/drizzle-exception.filter';
import cookieParser from 'cookie-parser';
import { corsOptions, helmetOptions, validationPipeOptions } from './settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new DrizzleExceptionFilter());
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors(corsOptions);
  app.use(helmet(helmetOptions));
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('My Apps API')
    .setDescription('API documentation for My Apps')
    .setVersion('1.2')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  if (process.env.NODE_ENV === 'development')
    if (process.env.NODE_ENV === 'development')
  SwaggerModule.setup('docs', app, document, {
    customCssUrl:
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui.css',
    customJs: [
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-bundle.js',
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js',
    ],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
