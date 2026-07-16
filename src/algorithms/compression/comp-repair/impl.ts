export interface RpHooks {
  onReplace?: (pair: string, sym: number) => void;
}
export function repairCompress(
  tokens: number[],
  startSym: number,
  hooks: RpHooks = {},
): { tokens: number[]; rules: Map<number, [number, number]> } {
  const rules = new Map<number, [number, number]>();
  let cur = [...tokens];
  let sym = startSym;
  while (true) {
    const freq = new Map<string, number>();
    for (let i = 0; i + 1 < cur.length; i++) {
      const k = cur[i]! + ':' + cur[i + 1]!;
      freq.set(k, (freq.get(k) ?? 0) + 1);
    }
    if (!freq.size) break;
    let best = '';
    let bf = 0;
    for (const [k, f] of freq)
      if (f > bf && f >= 2) {
        bf = f;
        best = k;
      }
    if (bf < 2) break;
    const [a, b] = best.split(':').map(Number);
    rules.set(sym, [a!, b!]);
    hooks.onReplace?.(best, sym);
    const out: number[] = [];
    let i = 0;
    while (i < cur.length) {
      if (i + 1 < cur.length && cur[i] === a && cur[i + 1] === b) {
        out.push(sym);
        i += 2;
      } else {
        out.push(cur[i]!);
        i++;
      }
    }
    cur = out;
    sym++;
  }
  return { tokens: cur, rules };
}
