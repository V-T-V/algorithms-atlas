// 数值稳定 softmax · 实现
export function softmaxStable(logits: number[]): number[] {
  if (logits.length === 0) return [];
  const m = Math.max(...logits);
  const exps = logits.map((z) => Math.exp(z - m));
  const s = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / s);
}
