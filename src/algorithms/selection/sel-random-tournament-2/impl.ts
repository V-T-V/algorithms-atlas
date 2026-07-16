// 随机锦标赛选择 v2 · 实现
export interface RtHooks {
  onRound?: (pairs: Array<[number, number]>) => void;
  onResult?: (v: number) => void;
}
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
export function randomTournamentSelect(
  arr: number[],
  k: number,
  seed = 11,
  hooks: RtHooks = {},
): number {
  const rng = makeRng(seed);
  const a = [...arr];
  let result = a[0]!;
  for (let round = 0; round <= k; round++) {
    // 随机洗牌
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j]!, a[i]!];
    }
    const pairs: Array<[number, number]> = [];
    const winners: number[] = [];
    for (let i = 0; i + 1 < a.length; i += 2) {
      pairs.push([a[i]!, a[i + 1]!]);
      winners.push(Math.min(a[i]!, a[i + 1]!));
    }
    if (a.length % 2 === 1) winners.push(a[a.length - 1]!);
    hooks.onRound?.(pairs);
    // 单元素即为冠军
    while (winners.length > 1) {
      const next: number[] = [];
      for (let i = 0; i + 1 < winners.length; i += 2)
        next.push(Math.min(winners[i]!, winners[i + 1]!));
      if (winners.length % 2 === 1) next.push(winners[winners.length - 1]!);
      winners.length = 0;
      winners.push(...next);
    }
    result = winners[0] ?? NaN;
    const idx = a.indexOf(result);
    if (idx >= 0) a[idx] = Infinity;
  }
  hooks.onResult?.(result);
  return result;
}
