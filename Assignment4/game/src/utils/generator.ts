import { Generator } from "../services/gameBackend";

export class RandomGenerator implements Generator<string> {
  private sequence: string;

  constructor(sequence: string) {
    this.sequence = sequence;
  }

  getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  next(): string {
    // const n = this.sequence.charAt(this.getRandomInt(this.sequence.length));
    // return n;
    const colors: string[] = ["#ff0000", "#00ff00", "#0000ff"];
    return colors[this.getRandomInt(3)];
  }
}
