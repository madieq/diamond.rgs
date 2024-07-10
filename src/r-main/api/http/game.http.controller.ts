import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Headers,
	Post,
	Query,
	Session,
} from '@nestjs/common'
// import { QueryBus } from '@nestjs/cqrs'
// import { match, Result } from 'oxide.ts'
// import { DocDocument, DocSchema, DocPersistenceDTO, DocModel } from '../../db/doc.schema'
import { GameService } from '../../services/game.service'
// import * as mongoose from 'mongoose'
// import { Model } from 'mongoose'

import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';

@Controller('game')
export class GameController {
	constructor(private gameService: GameService) { }

	@Get('info')
	async info(
		@Body() b: any,
		@Query() queryParams: any,
		@Session() session: Record<string, any>
	): Promise<any> {
		try {
			let r = await this.gameService.info(queryParams.id)
			return { ok: true, data: { ...r } }
		} catch (error) {
			// error('invalid props ' + error.message)
			return { ok: false, message: error.message }
		}
	}

	@Get('connect')
	async connect(
		@Body() b: any,
		@Query() queryParams: any,
		@Headers() headers: any,
		@Session() session: Record<string, any>
	): Promise<any> {
		try {
			let r = await this.gameService.player_connect(queryParams.id, headers.authorization)
			return { ok: true, data: { ...r } }
		} catch (error) {
			// error('invalid props ' + error.message)
			return { ok: false, message: error.message }
		}
	}

	@Post('create')
	async create(
		@Body() b: any,
		@Query() queryParams: any,
		@Session() session: Record<string, any>
	): Promise<any> {
		try {
			let r = await this.gameService.create(b)
			return { ok: true, data: { ...r } }
		} catch (error) {
			// error('invalid props ' + error.message)
			return { ok: false, message: error.message }
		}
	}

	@Post('open_cell')
	async openCell(
		@Body() b: any,
		@Query() queryParams: any,
		@Headers() headers: any,
		@Session() session: Record<string, any>
	): Promise<any> {
		try {
			headers; session;
			let r = await this.gameService.open_cell(b.cell, b.game_id, headers.authorization)
			return { ok: true, data: { ...r } }
		} catch (error) {
			// error('invalid props ' + error.message)
			return { ok: false, message: error.message }
		}
	}
}
