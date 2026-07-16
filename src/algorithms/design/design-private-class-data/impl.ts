export class CircleData {
  constructor(
    public radius: number,
    public color: string,
  ) {}
}
export class Circle {
  constructor(private data: CircleData) {}
  area(): number {
    return Math.PI * this.data.radius * this.data.radius;
  }
  describe(): string {
    return this.data.color + ' r=' + this.data.radius;
  }
}
export interface PdHooks {
  onCall?: (method: string, result: number | string) => void;
}
