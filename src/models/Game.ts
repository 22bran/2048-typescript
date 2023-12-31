import { Board } from "./Board";
import { Scoreboard } from "./Scoreboard";
import { Tile } from "./Tile";

export class Game {
  public board: Board;
  private score: Scoreboard;
  private size: number;

  constructor(size: number = 4) {
    this.size = size;
    this.reset();
  }

  addRandomTile(): void {
    const emptyTiles = this.getEmptyTiles();

    if (emptyTiles.length > 0) {
      const randomTile =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      const value = Math.random() > 0.5 ? 2 : 4;
      randomTile.setValue(value);
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
        if (
          tiles[y][x].getValue() === tiles[y][x + 1].getValue() ||
          tiles[x][y].getValue() === tiles[x + 1][y].getValue()
        ) {
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

  move(direction: "up" | "down" | "left" | "right"): boolean {
    const tiles = this.board.getTiles();
    let moved = false;
    const processedTiles = this.prepareTilesForMovement(tiles, direction);

    for (let i = 0; i < processedTiles.length; i++) {
      const originalRow = processedTiles[i];
      const originalRowCopy = originalRow.map(
        (value) => new Tile(value.getValue()),
      );
      const newRow = this.compactRow(originalRow);
      const unchanged = this.isRowUnchanged(originalRowCopy, newRow);
      if (!unchanged) {
        moved = true;
        processedTiles[i] = newRow;
      }
    }
    this.restoreProcessedTiles(processedTiles, direction);
    return moved;
  }

  private getEmptyTiles() {
    const emptyTiles: Tile[] = [];
    const tiles = this.board.getTiles();

    tiles.forEach((row) => {
      row.forEach((tile) => {
        if (!tile.getValue()) {
          emptyTiles.push(tile);
        }
      });
    });

    return emptyTiles;
  }

  private prepareTilesForMovement(
    tiles: Tile[][],
    direction: string,
  ): Tile[][] {
    if (direction === "up") return this.transposeTiles(tiles);
    if (direction === "down")
      return this.transposeTiles(tiles).map((row) => this.reverseRow(row));
    if (direction === "right") return tiles.map((row) => this.reverseRow(row));
    return tiles;
  }

  private restoreProcessedTiles(tiles: Tile[][], direction: string): void {
    let restoredTiles;
    if (direction === "up") restoredTiles = this.transposeTiles(tiles);
    else if (direction === "down")
      restoredTiles = this.transposeTiles(
        tiles.map((row) => this.reverseRow(row)),
      );
    else if (direction === "right")
      restoredTiles = tiles.map((row) => this.reverseRow(row));
    else restoredTiles = tiles;
    this.board.setTiles(
      restoredTiles.map((y) => y.map((x) => new Tile(x.getValue()))),
    );
  }

  private reverseRow(row: Tile[]): Tile[] {
    return row.map((tile) => new Tile(tile.getValue())).reverse();
  }

  private transposeTiles(tiles: Tile[][]): Tile[][] {
    return tiles[0].map((_, columnIndex) =>
      tiles.map((row) => row[columnIndex]),
    );
  }

  private compactRow(row: Tile[]): Tile[] {
    let compactedRow = row.filter((tile) => tile.getValue() !== null);
    for (let i = 0; i < compactedRow.length - 1; i++) {
      if (compactedRow[i].getValue() === compactedRow[i + 1].getValue()) {
        const newValue = compactedRow[i].getValue()! * 2;
        compactedRow[i].setValue(newValue);
        compactedRow[i + 1].setValue(null);
        compactedRow = row.filter((tile) => tile.getValue() !== null);
        this.score.addScore(newValue);
      }
    }

    while (compactedRow.length < row.length) {
      compactedRow.push(new Tile());
    }
    return compactedRow;
  }

  private isRowUnchanged(originalRow: Tile[], newRow: Tile[]): boolean {
    return originalRow.every(
      (tile, index) => tile.getValue() === newRow[index].getValue(),
    );
  }
}
