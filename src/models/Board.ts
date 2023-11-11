import { Tile } from './Tile';

export class Board {
    private tiles: Tile[][];

    constructor(private size: number = 4) {
        this.tiles = this.createEmptyBoard();
    }

    setTiles(newTiles: Tile[][]): void {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.tiles[y][x].setValue(newTiles[y][x].getValue());
            }
        }
    }

    getTiles(): Tile[][] {
        return this.tiles;
    }

    private createEmptyBoard(): Tile[][] {
        const board: Tile[][] = [];
        for (let y = 0; y < this.size; y++) {
            const row: Tile[] = [];
            for (let x = 0; x < this.size; x++) {
                row.push(new Tile());
            }
            board.push(row);
        }
        return board;
    }
}
