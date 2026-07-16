// 安全骰子博弈 · 实现
export interface SecureDiceHooks {
  onThreshold?: (m: number, ev: number) => void;
  onConclude?: (bestM: number, bestEv: number) => void;
}
const FACES = 6;
export function secureDice(hooks: SecureDiceHooks = {}): {
  bestM: number;
  bestEv: number;
  evByM: number[];
} {
  // E[reroll] = average EV over faces; keep if face >= m.
  // EV(m) = (1/m)*sum_{f<m} E + (1/6 * sum_{f>=m} f) ... 解线性方程:
  // 令 R = EV(m). R = sum_{f=1..m-1}(1/6 * R) + sum_{f=m..6}(1/6*f)
  // R*(1 - (m-1)/6) = sum_{f=m..6} f / 6
  const evByM: number[] = [];
  let bestM = 1,
    bestEv = -Infinity;
  for (let m = 1; m <= FACES; m++) {
    const keepSum = ((FACES + m) * (FACES - m + 1)) / 2;
    const denom = FACES - (m - 1);
    const ev = denom <= 0 ? keepSum / FACES : keepSum / denom;
    evByM[m - 1] = ev;
    hooks.onThreshold?.(m, ev);
    if (ev > bestEv) {
      bestEv = ev;
      bestM = m;
    }
  }
  hooks.onConclude?.(bestM, bestEv);
  return { bestM, bestEv, evByM };
}
