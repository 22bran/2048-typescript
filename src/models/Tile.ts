export class Tile {
  private value: number | null;

  constructor(value: number | null = null) {
    this.value = value;
  }

  setValue(newValue: number | null): void {
    this.value = newValue;
  }

  getValue(): number | null {
    return this.value;
  }
}
