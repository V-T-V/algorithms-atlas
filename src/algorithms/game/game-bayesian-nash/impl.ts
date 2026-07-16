// 贝叶斯纳什 (一阶拍卖均衡验证) · 实现
// 均衡: 报价 b(v) = ((n-1)/n) * v, 验证最优性
export interface BneHooks {
  onValue?: (v: number, bid: number, expectedPayoff: number) => void;
  onConclude?: (equilibriumOk: boolean) => void;
}
export function bayesianNash(n: number, values: readonly number[], hooks: BneHooks = {}): boolean {
  let equilibriumOk = true;
  for (const v of values) {
    const eqBid = ((n - 1) / n) * v;
    // 期望收益: (eqBid/(n-1)对每个对手均匀) 赢的概率 * (v - eqBid)
    let expPayoff = 0;
    // 简化: 赢 = 所有对手估值 < v 的概率 (v^(n-1)) * (v - eqBid)
    const winProb = Math.pow(v, n - 1);
    expPayoff = winProb * (v - eqBid);
    // 检查偏离: 偏离到 b 不改变
    let bestAlt = expPayoff;
    for (let dv = -0.2; dv <= 0.2; dv += 0.1) {
      const altBid = Math.max(0, eqBid + dv * v);
      const altWin = Math.pow(altBid / ((n - 1) / n), n - 1);
      const altPay = altWin * (v - altBid);
      if (altPay > bestAlt + 1e-6) {
        bestAlt = altPay;
        equilibriumOk = false;
      }
    }
    hooks.onValue?.(v, eqBid, expPayoff);
  }
  hooks.onConclude?.(equilibriumOk);
  return equilibriumOk;
}
