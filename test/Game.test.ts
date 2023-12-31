import { Game } from "../src/models/Game";
import { Tile } from "../src/models/Tile";

describe("2048 Game Moves", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
    game.board.setTiles([
      [new Tile(2), new Tile(2), new Tile(), new Tile()],
      [new Tile(2), new Tile(), new Tile(), new Tile()],
      [new Tile(2), new Tile(2), new Tile(2), new Tile()],
      [new Tile(), new Tile(), new Tile(), new Tile()],
    ]);
  });

  test("Tiles move left correctly", () => {
    game.move("left");
    const tiles = game.getBoard().getTiles();
    expect(tiles[0][0].getValue()).toBe(4);
    expect(tiles[1][0].getValue()).toBe(2);
    expect(tiles[2][0].getValue()).toBe(4);
    expect(tiles[2][1].getValue()).toBe(2);
    expect(tiles[2][2].getValue()).toBe(null);
    expect(tiles[3][0].getValue()).toBe(null);
    expect(tiles[3][1].getValue()).toBe(null);
    expect(tiles[3][2].getValue()).toBe(null);
    expect(tiles[3][3].getValue()).toBe(null);
  });

  test("Tiles move right correctly", () => {
    game.move("right");
    const tiles = game.getBoard().getTiles();
    expect(tiles[0][3].getValue()).toBe(4);
    expect(tiles[1][3].getValue()).toBe(2);
    expect(tiles[2][3].getValue()).toBe(4);
    expect(tiles[2][2].getValue()).toBe(2);
    expect(tiles[2][1].getValue()).toBe(null);
    expect(tiles[3][0].getValue()).toBe(null);
    expect(tiles[3][1].getValue()).toBe(null);
    expect(tiles[3][2].getValue()).toBe(null);
    expect(tiles[3][3].getValue()).toBe(null);
  });

  test("Tiles move up correctly", () => {
    game.move("up");
    const tiles = game.getBoard().getTiles();
    expect(tiles[0][0].getValue()).toBe(4);
    expect(tiles[1][0].getValue()).toBe(2);
    expect(tiles[2][0].getValue()).toBe(null);
    expect(tiles[0][1].getValue()).toBe(4);
    expect(tiles[1][1].getValue()).toBe(null);
    expect(tiles[0][2].getValue()).toBe(2);
    expect(tiles[1][2].getValue()).toBe(null);
    expect(tiles[2][2].getValue()).toBe(null);
    expect(tiles[0][3].getValue()).toBe(null);
    expect(tiles[1][3].getValue()).toBe(null);
    expect(tiles[2][3].getValue()).toBe(null);
    expect(tiles[3][3].getValue()).toBe(null);
  });

  test("Tiles move down correctly", () => {
    game.move("down");
    const tiles = game.getBoard().getTiles();
    expect(tiles[3][0].getValue()).toBe(4);
    expect(tiles[2][0].getValue()).toBe(2);
    expect(tiles[1][0].getValue()).toBe(null);
    expect(tiles[3][1].getValue()).toBe(4);
    expect(tiles[2][1].getValue()).toBe(null);
    expect(tiles[3][2].getValue()).toBe(2);
    expect(tiles[2][2].getValue()).toBe(null);
    expect(tiles[1][2].getValue()).toBe(null);
    expect(tiles[3][3].getValue()).toBe(null);
    expect(tiles[2][3].getValue()).toBe(null);
    expect(tiles[1][3].getValue()).toBe(null);
    expect(tiles[0][3].getValue()).toBe(null);
  });
});

describe("2048 Game Moves", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
    game.board.setTiles([
      [new Tile(2), new Tile(2), new Tile(2), new Tile(4)],
      [new Tile(2), new Tile(2), new Tile(), new Tile()],
      [new Tile(4), new Tile(2), new Tile(), new Tile(2)],
      [new Tile(4), new Tile(4), new Tile(2), new Tile(2)],
    ]);
  });

  test("Tiles move up correctly", () => {
    game.move("up");
    const tiles = game.getBoard().getTiles();
    expect(tiles[0][0].getValue()).toBe(4);
    expect(tiles[1][0].getValue()).toBe(8);
    expect(tiles[2][0].getValue()).toBe(null);
    expect(tiles[3][0].getValue()).toBe(null);

    expect(tiles[0][1].getValue()).toBe(4);
    expect(tiles[1][1].getValue()).toBe(2);
    expect(tiles[2][1].getValue()).toBe(4);
    expect(tiles[3][1].getValue()).toBe(null);

    expect(tiles[0][2].getValue()).toBe(4);
    expect(tiles[1][2].getValue()).toBe(null);
    expect(tiles[2][2].getValue()).toBe(null);
    expect(tiles[3][2].getValue()).toBe(null);

    expect(tiles[0][3].getValue()).toBe(4);
    expect(tiles[1][3].getValue()).toBe(4);
    expect(tiles[2][3].getValue()).toBe(null);
    expect(tiles[3][3].getValue()).toBe(null);
  });
});

describe("Identification of row change", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
    game.board.setTiles([
      [new Tile(), new Tile(), new Tile(), new Tile()],
      [new Tile(), new Tile(), new Tile(), new Tile()],
      [new Tile(), new Tile(), new Tile(), new Tile(2)],
      [new Tile(), new Tile(), new Tile(), new Tile(2)],
    ]);
  });

  test("Change not happend", () => {
    expect(game.move("right")).toBe(false);
  });

  test("Change happend", () => {
    expect(game.move("down")).toBe(true);
  });
});

describe("Correct merging", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
    game.board.setTiles([
      [new Tile(), new Tile(), new Tile(), new Tile()],
      [new Tile(), new Tile(), new Tile(), new Tile()],
      [new Tile(8), new Tile(8), new Tile(16), new Tile(32)],
      [new Tile(), new Tile(4), new Tile(4), new Tile(8)],
    ]);
  });

  test("Merge only same numbers", () => {
    game.move("right");
    const tiles = game.getBoard().getTiles();
    expect(tiles[2][0].getValue()).toBe(null);
    expect(tiles[2][1].getValue()).toBe(16);
    expect(tiles[2][2].getValue()).toBe(16);
    expect(tiles[2][3].getValue()).toBe(32);

    expect(tiles[3][2].getValue()).toBe(8);
    expect(tiles[3][3].getValue()).toBe(8);

    game.move("right");
    expect(tiles[2][0].getValue()).toBe(null);
    expect(tiles[2][1].getValue()).toBe(null);
    expect(tiles[2][2].getValue()).toBe(32);
    expect(tiles[2][3].getValue()).toBe(32);

    expect(tiles[3][2].getValue()).toBe(null);
    expect(tiles[3][3].getValue()).toBe(16);

    game.move("right");
    expect(tiles[2][0].getValue()).toBe(null);
    expect(tiles[2][1].getValue()).toBe(null);
    expect(tiles[2][2].getValue()).toBe(null);
    expect(tiles[2][3].getValue()).toBe(64);

    expect(tiles[3][2].getValue()).toBe(null);
    expect(tiles[3][3].getValue()).toBe(16);
  });
});
