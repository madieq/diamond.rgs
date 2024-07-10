import { Injectable } from '@nestjs/common';
import { IGame, IGameOptions } from './../interface/game.interface';
import { v4 } from 'uuid'

@Injectable()
export class GameService {
    private readonly games: IGame[] = [];
    private readonly games_by_id: { [id: string]: IGame } = {};

    private randomInt(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    create(go?: IGameOptions) {
        go = go || { w: 7, h: 7, diamonds: 11 }
        let field_length = go.w * go.h

        // -- validate
        go.w = Math.floor(go.w)
        go.h = Math.floor(go.h)
        go.diamonds = Math.floor(go.diamonds)

        // if (typeof go.w !== 'number' || typeof go.h === 'number' || typeof go.diamonds === 'number'
        //     || go.w <= 3 || go.h <= 3 || go.w >= 20 || go.h >= 20
        //     || go.diamonds <= 0 || go.diamonds >= field_length - 1
        //     || isNaN(go.w) || isNaN(go.h) || isNaN(go.diamonds))
        //     throw Error('invalid_create_params')

        let hide_map = new Array<number | 'd'>(field_length).fill(0)
        let opened_map = new Array<number | 'd' | 'x'>(field_length).fill('x')
        let rngs = new Set<number>()
        while (1) {
            rngs.add(this.randomInt(0, field_length - 1))
            if (rngs.size === go.diamonds)
                break
        }
        rngs.forEach((k, v) => {
            hide_map[v] = 'd'
            let CURRENT_INDEX = v
            let width = go.w
            let height = go.h
            let around = [
                CURRENT_INDEX - width - 1,
                CURRENT_INDEX - width - 0,
                CURRENT_INDEX - width + 1,
                CURRENT_INDEX - 0 - 1,
                CURRENT_INDEX - 0 - 0,
                CURRENT_INDEX - 0 + 1,
                CURRENT_INDEX + width - 1,
                CURRENT_INDEX + width - 0,
                CURRENT_INDEX + width + 1
            ]

            //inc arounds
            for (let around_position of around) {
                if (typeof hide_map[around_position] === 'number')
                    (hide_map[around_position] as number)++
            }
        })
        let g: IGame = {
            diamonds_collected: [0, 0],
            id: v4(),
            players: [],
            hide_map,
            opened_map,
            options: go,
            winner: '',
            state: 'wait'
        }
        this.games.push(g);
        this.games_by_id[g.id] = g
        return this.info(g.id)
    }

    getGame(id: string) {
        return this.games_by_id[id]
    }

    player_connect(game_id: string, user: string) {
        let g = this.getGame(game_id)
        if (!g) throw Error('game_is_not_exist')

        if (g.players.length >= 2 || g.state !== 'wait') {
            throw Error('Invalid_params_game_id')
        }
        if (g.players.includes(user))
            throw Error('player_was_connected')
        g.players.push(user)
        if (g.players.length === 2)
            g.state = 'p1'
        return this.info(g.id)
    }

    open_cell(cell: number, game_id: string, user: string) {
        let g = this.getGame(game_id)
        if (!g) throw Error('game_is_not_exist')

        // validate cell
        let user_actor_index = -1
        if (g.state === 'p1')
            user_actor_index = 0
        if (g.state === 'p2')
            user_actor_index = 1
        if (user_actor_index === -1)
            throw Error('game_state_is_not_valid')

        // validate user
        if (!g.players.includes(user))
            throw Error('user_is_not_connected_game_id')
        if (g.players[user_actor_index] !== user)
            throw Error('invalid_user_action_in_this_state')

        // validate cell
        if (g.opened_map[cell] !== 'x')
            throw Error('invalid_cell_number')

        let content_cell = g.hide_map[cell]

        if (content_cell !== 'd') {
            if (g.state === 'p1')
                g.state = 'p2'
            else if (g.state === 'p2')
                g.state = 'p1'
        }
        if (content_cell === 'd') {
            g.diamonds_collected[user_actor_index]++
            if (g.diamonds_collected[0] + g.diamonds_collected[1] === g.options.diamonds) {
                g.state = 'end'
                if (g.diamonds_collected[0] !== g.diamonds_collected[1]) {
                    g.winner = g.diamonds_collected[0] > g.diamonds_collected[1] ? g.players[0] : g.players[1]
                }
            }
        }

        g.opened_map[cell] = content_cell

        return this.info(g.id)
    }

    info(game_id: string) {
        let g = this.getGame(game_id)
        if (!g) throw Error('game_is_not_exist')
        return {
            id: g.id,
            state: g.state,
            players: g.players,
            diamonds_collected: g.diamonds_collected,
            winner: g.winner,
            // hide_map: g.hide_map,
            opened_map: g.opened_map,
            options: g.options
        }
    }
}