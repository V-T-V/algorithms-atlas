// 锦标赛选择 v2 · 实现
export interface TmHooks {
  onRound?: (matches: Array<[number, number, number]>) => void;
  onResult?: (v: number) => void;
}
export function tournamentSelect(arr: number[], k: number, hooks: TmHooks = {}): number {
  const a = [...arr];
  let result = NaN;
  for (let round = 0; round <= k; round++) {
    // 单淘汰
    let cur = a;
    const log: Array<[number, number, number]> = [];
    while (cur.length > 1) {
      const next: number[] = [];
      for (let i = 0; i + 1 < cur.length; i += 2) {
        const w = Math.min(cur[i]!, cur[i + 1]!);
        log.push([cur[i]!, cur[i + 1]!, w]);
        next.push(w);
      }
      if (cur.length % 2 === 1) next.push(cur[cur.length - 1]!);
      cur = next;
    }
    hooks.onRound?.(log);
    result = cur[0] ?? NaN;
    // 把当前冠军替换为 +∞
    const idx = a.indexOf(result);
    if (idx >= 0) a[idx] = Infinity;
  }
  hooks.onResult?.(result);
  return result;
}
