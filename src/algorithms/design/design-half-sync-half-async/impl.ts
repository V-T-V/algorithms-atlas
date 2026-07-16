export interface HsHooks {
  onEnqueue?: (n: number) => void;
  onProcess?: (n: number) => void;
}
export class HsQueue {
  private q: number[] = [];
  private processed: number[] = [];
  enqueue(n: number, hooks: HsHooks = {}): void {
    this.q.push(n);
    hooks.onEnqueue?.(n);
  }
  drainSync(hooks: HsHooks = {}): number[] {
    while (this.q.length) {
      const n = this.q.shift()!;
      this.processed.push(n * 2);
      hooks.onProcess?.(n);
    }
    return [...this.processed];
  }
}
