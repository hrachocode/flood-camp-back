import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  const logger = new Logger('bootstrap');
  const port = 3030;

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    // .addBearerAuth(
    //   {
    //     // I was also testing it without prefix 'Bearer ' before the JWT
    //     description: `[just text field] Please enter token in following format: Bearer <JWT>`,
    //     name: 'Authorization',
    //     bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
    //     scheme: 'Bearer',
    //     type: 'http', // I`ve attempted type: 'apiKey' too
    //     in: 'Header'
    //   },
    //   'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    // )
    .setTitle('Flood Camp')
    .setDescription('The Flood Camp API description')
    .setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  logger.log(`Applocation listening on port ${port}`)

}
bootstrap();
