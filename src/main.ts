import { NestFactory } from '@nestjs/core'
import { info, warn } from 'console'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
// fastify
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import fastifyCsrf from '@fastify/csrf-protection'

import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
// import { routesV1 } from './common/configs/app.routes'
// import mongoose from 'mongoose'

async function bootstrap() {
    try {
        const app = await NestFactory.create<NestFastifyApplication>(
            AppModule,
            new FastifyAdapter({ trustProxy: true })
        )
        app.setGlobalPrefix('api/v1')
        // Get configuration
        const configService = app.get(ConfigService)
        // App port
        const port = configService.get('HTTP_PORT')
        // Env
        const env = configService.get('NODE_ENV')

        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                transformOptions: {
                    enableImplicitConversion: true,
                },
            })
        )
        app.enableCors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        })
        await app.listen(port, '0.0.0.0')
        warn(`-- started app 0.0.0.0:${port} ...`)
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log('ERROR', error)
    }
}
bootstrap()
