export interface CmHooks {
  onRequest?: (f: number, from: number, to: number) => void;
  onClean?: (f: number) => void;
  onEat?: (p: number) => void;
}
export function chandyMisra(n: number, rounds: number, hooks: CmHooks = {}): number[] {
  const dirty: boolean[] = new Array(n).fill(true);
  const owner: number[] = Array.from({ length: n }, (_, f) => Math.min(f, (f + 1) % n));
  const eatCount: number[] = new Array(n).fill(0);
  for (let r = 0; r < rounds; r++) {
    for (let p = 0; p < n; p++) {
      const f1 = p;
      const f2 = (p - 1 + n) % n;
      for (const f of [f1, f2]) {
        if (owner[f] !== p) {
          hooks.onRequest?.(f, owner[f]!, p);
          if (dirty[f]) {
            owner[f] = p;
            dirty[f] = false;
            hooks.onClean?.(f);
          }
        }
      }
      if (owner[f1] === p && owner[f2] === p) {
        eatCount[p] = (eatCount[p] ?? 0) + 1;
        dirty[f1] = true;
        dirty[f2] = true;
        hooks.onEat?.(p);
      }
    }
  }
  return eatCount;
}
