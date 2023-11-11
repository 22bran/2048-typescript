import { Board } from './Board';
import { Scoreboard } from './Scoreboard';
import { Tile } from './Tile';

export class Game {
    private board: Board;
    private score: Scoreboard;
    private size: number;

    constructor(size: number = 4) {
        this.size = size;
        this.board = new Board(size);
        this.score = new Scoreboard();
        this.addRandomTile();
        this.addRandomTile();
    }

    addRandomTile(): void {
        let emptyTiles = this.getEmptyTiles();

        if (emptyTiles.length > 0) {
            const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            randomTile.setValue(Math.random() > 0.5 ? 2 : 4);
        }
    }

    getScore(): number {
        return this.score.getScore();
    }

    reset(): void {
        this.board = new Board(this.size);
        this.score = new Scoreboard();
        this.addRandomTile();
        this.addRandomTile();
    }

    isGameOver(): boolean {
        const tiles = this.board.getTiles();
        const size = tiles.length;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (tiles[y][x].getValue() === null) {
                    return false;
                }
            }
        }

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size - 1; x++) {
                if (tiles[y][x].getValue() === tiles[y][x + 1].getValue() ||
                    tiles[x][y].getValue() === tiles[x + 1][y].getValue()) {
                    return false;
                }
            }
        }

        return true;
    }

    getBoard(): Board {
        return this.board;
    }

    hasWon(): boolean {
        for (const row of this.board.getTiles()) {
            for (const tile of row) {
                if (tile.getValue() === 2048) {
                    return true;
                }
            }
        }
        return false;
    }

    move(direction: 'up' | 'down' | 'left' | 'right'): boolean {
        let tiles = this.board.getTiles();
        let moved = false;
        let processedTiles = this.prepareTilesForMovement(tiles, direction);

        for (let i = 0; i < processedTiles.length; i++) {
            let originalRow = processedTiles[i];
            let newRow = this.compactRow([...originalRow]);
            let unchanged = this.isRowUnchanged(originalRow, newRow);

            if (!unchanged) {
                moved = true;
                processedTiles[i] = newRow;
            }
        }
        this.restoreProcessedTiles([...processedTiles], direction);
        return moved;
    }

    private getEmptyTiles() {
        const emptyTiles: Tile[] = [];
        const tiles = this.board.getTiles();

        tiles.forEach(row => {
            row.forEach(tile => {
                if (!tile.getValue()) {
                    emptyTiles.push(tile);
                }
            });
        });

        return emptyTiles;
    }

    private prepareTilesForMovement(tiles: Tile[][], direction: string): Tile[][] {
        if (direction === 'up') return this.transposeTiles(tiles);
        if (direction === 'down') return this.transposeTiles(tiles).map(row => this.reverseRow(row));
        if (direction === 'right') return tiles.map(row => this.reverseRow(row));
        return tiles;
    }

    private restoreProcessedTiles(tiles: Tile[][], direction: string): void {
        let restoredTiles;
        if (direction === 'up') restoredTiles = this.transposeTiles(tiles);
        else if (direction === 'down') restoredTiles = this.transposeTiles(tiles.map(row => this.reverseRow(row)));
        else if (direction === 'right') restoredTiles = tiles.map(row => this.reverseRow(row));
        else restoredTiles = tiles;
        this.board.setTiles(restoredTiles);
    }

    private reverseRow(row: Tile[]): Tile[] {
        return row.map(tile => new Tile(tile.getValue())).reverse();
    }

    private transposeTiles(tiles: Tile[][]): Tile[][] {
        return tiles[0].map((_, columnIndex) => tiles.map(row => row[columnIndex]));
    }

    private compactRow(row: Tile[]): Tile[] {
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i].getValue() === row[i + 1].getValue() && row[i].getValue() !== null) {
                let newValue = row[i].getValue()! * 2;
                row[i].setValue(newValue);
                row[i + 1].setValue(null);
                this.score.addScore(newValue);
            }
        }

        let compactedRow = row.filter(tile => tile.getValue() !== null);
        while (compactedRow.length < row.length) {
            compactedRow.push(new Tile());
        }
        return compactedRow;
    }

    private isRowUnchanged(originalRow: Tile[], newRow: Tile[]): boolean {
        return originalRow.every((tile, index) => tile.getValue() === newRow[index].getValue());
    }
}
