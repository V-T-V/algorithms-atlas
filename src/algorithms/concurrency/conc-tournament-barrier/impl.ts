export interface Tb2Hooks {
  onMatch?: (round: number, a: number, b: number, winner: number) => void;
  onRoot?: (round: number) => void;
}
export function tournamentBarrier(n: number, hooks: Tb2Hooks = {}): number {
  let cur: number[] = Array.from({ length: n }, (_, i) => i);
  let round = 0;
  while (cur.length > 1) {
    const next: number[] = [];
    for (let i = 0; i + 1 < cur.length; i += 2) {
      const w = cur[i]!;
      hooks.onMatch?.(round, cur[i]!, cur[i + 1]!, w);
      next.push(w);
    }
    if (cur.length % 2 === 1) next.push(cur[cur.length - 1]!);
    cur = next;
    round++;
  }
  hooks.onRoot?.(round);
  return round;
}
