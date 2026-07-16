export interface BpeHooks {
  onMerge?: (pair: string, symbol: number) => void;
}
export function bytePairEncode(
  tokens: number[],
  vocabStart: number,
  rounds: number,
  hooks: BpeHooks = {},
): { tokens: number[]; rules: Array<{ pair: [number, number]; sym: number }> } {
  const rules: Array<{ pair: [number, number]; sym: number }> = [];
  let cur = [...tokens];
  let next = vocabStart;
  for (let r = 0; r < rounds; r++) {
    const freq = new Map<string, number>();
    for (let i = 0; i + 1 < cur.length; i++) {
      const k = cur[i]! + ',' + cur[i + 1]!;
      freq.set(k, (freq.get(k) ?? 0) + 1);
    }
    if (!freq.size) break;
    let best = '';
    let bf = 0;
    for (const [k, f] of freq)
      if (f > bf) {
        bf = f;
        best = k;
      }
    const [a, b] = best.split(',').map(Number);
    rules.push({ pair: [a!, b!], sym: next });
    const out: number[] = [];
    let i = 0;
    while (i < cur.length) {
      if (i + 1 < cur.length && cur[i] === a && cur[i + 1] === b) {
        out.push(next);
        i += 2;
      } else {
        out.push(cur[i]!);
        i++;
      }
    }
    hooks.onMerge?.(best, next);
    cur = out;
    next++;
  }
  return { tokens: cur, rules };
}
export function bytePairDecode(
  tokens: number[],
  rules: Array<{ pair: [number, number]; sym: number }>,
): number[] {
  const map = new Map(rules.map((r) => [r.sym, r.pair]));
  const expand = (t: number): number[] =>
    map.has(t) ? [...expand(map.get(t)![0]!), ...expand(map.get(t)![1]!)] : [t];
  return tokens.flatMap(expand);
}
