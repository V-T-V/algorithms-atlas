// He 权重初始化 · 实现
export function heInit(fanIn: number, n: number, seed = 1): number[] {
  if (fanIn <= 0) throw new RangeError('fan_in 必须 > 0');
  let s = seed >>> 0;
  const rand = (): number => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const std = Math.sqrt(2 / fanIn);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const u1 = Math.max(rand(), 1e-10),
      u2 = rand();
    out.push(std * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2));
  }
  return out;
}
