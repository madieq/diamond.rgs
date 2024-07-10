export interface IGame {
    id: string
    state: 'wait' | 'p1' | 'p2' | 'end'
    players: string[]
    diamonds_collected: number[]
    winner: string
    hide_map: (number | 'd')[]
    opened_map: (number | 'd' | 'x')[]
    options: IGameOptions
}

export interface IGameOptions {
    diamonds: number
    w: number
    h: number
}