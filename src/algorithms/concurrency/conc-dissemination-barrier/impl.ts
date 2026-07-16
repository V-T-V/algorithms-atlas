export interface DbHooks {
  onSense?: (round: number, i: number, j: number) => void;
  onComplete?: (rounds: number) => void;
}
export function disseminationBarrier(n: number, hooks: DbHooks = {}): number {
  let round = 0;
  while (1 << round < n) {
    for (let i = 0; i < n; i++) {
      const j = (i + (1 << round)) % n;
      hooks.onSense?.(round, i, j);
    }
    round++;
  }
  hooks.onComplete?.(round);
  return round;
}
