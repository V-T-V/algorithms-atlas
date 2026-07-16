// 消耗战 · 实现
// 两玩家各坚持时间 t1, t2；min(t1,t2) 为败者退出时间，胜者得 V，败者付出该时间；并列则平分 V。
export interface WarOfAttritionHooks {
  onResolve?: (winner: 0 | 1 | -1, duration: number) => void;
  onPayoff?: (p0: number, p1: number) => void;
}
export interface WarOfAttritionResult {
  winner: 0 | 1 | -1;
  duration: number;
  payoffs: [number, number];
}
export function gameWarOfAttrition(
  t1: number,
  t2: number,
  V: number,
  hooks: WarOfAttritionHooks = {},
): WarOfAttritionResult {
  if (t1 < 0 || t2 < 0) throw new Error('时间必须 >= 0 / times must be non-negative');
  let winner: 0 | 1 | -1;
  let duration: number;
  let p0: number;
  let p1: number;
  if (t1 === t2) {
    winner = -1;
    duration = t1;
    p0 = V / 2 - t1;
    p1 = V / 2 - t2;
  } else if (t1 > t2) {
    winner = 0;
    duration = t2;
    p0 = V - t2;
    p1 = -t2;
  } else {
    winner = 1;
    duration = t1;
    p0 = -t1;
    p1 = V - t1;
  }
  hooks.onResolve?.(winner, duration);
  hooks.onPayoff?.(p0, p1);
  return { winner, duration, payoffs: [p0, p1] };
}
