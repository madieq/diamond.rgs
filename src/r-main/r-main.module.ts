import { HttpModule } from '@nestjs/axios'
import { Module, Provider, } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import httpControllers from './api/http'

// import { MongooseModule } from '@nestjs/mongoose'
// import { DocModel, DocDocument, DocSchema, DocPersistenceDTO } from './db/doc.schema'
import { GameService } from './services/game.service'

@Module({
	imports: [
		// MongooseModule.forFeature([
		// 	{ name: 'DocModel', schema: DocSchema },
		// ]),
		CqrsModule,
		HttpModule,
		ConfigModule
	],
	controllers: [...httpControllers],
	providers: [GameService],
})
export class RMAINModule { }
