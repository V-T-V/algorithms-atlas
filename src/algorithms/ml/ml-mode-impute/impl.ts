// 众数填充缺失值 · 实现
export function modeImpute(values: (number | null)[]): number[] {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return values.map(() => 0);
  const cnt: Record<number, number> = {};
  for (const v of valid) cnt[v] = (cnt[v] ?? 0) + 1;
  let mode = valid[0]!,
    best = -1;
  for (const k in cnt)
    if (cnt[k]! > best) {
      best = cnt[k]!;
      mode = Number(k);
    }
  return values.map((v) => (v === null ? mode : v));
}
