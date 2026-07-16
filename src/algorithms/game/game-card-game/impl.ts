// =============================================================================
// 纸牌游戏（两手比大小）· 纯算法实现
// 牌格式：两位字符串，第一位点数 2-9,T,J,Q,K,A，第二位花色 h/d/c/s。
// 返回：1 表示手 1 大，2 表示手 2 大，0 平局。
// =============================================================================
export interface GameCardGameHooks {
  onRank?: (handIndex: number, rank: number, desc: string) => void;
  onConclude?: (winner: number) => void;
}

const RANK_VAL: Record<string, number> = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

function values(hand: string[]): number[] {
  return hand.map((c) => RANK_VAL[c[0]!]!).sort((a, b) => b - a);
}
function isFlush(hand: string[]): boolean {
  return hand.every((c) => c[1] === hand[0]![1]);
}
function isStraight(vals: number[]): boolean {
  const u = [...new Set(vals)];
  if (u.length !== 5) return false;
  if (u[0]! - u[4]! === 4) return true;
  // A-2-3-4-5 (轮子)
  if (u.join(',') === '14,5,4,3,2') return true;
  return false;
}

/** 返回 [类别分, 关键点数序列]；字典序比较。 */
function score(hand: string[]): [number, number[]] {
  const vals = values(hand);
  const counts = new Map<number, number>();
  for (const v of vals) counts.set(v, (counts.get(v) ?? 0) + 1);
  // 按数量降序、点数降序
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const countsArr = groups.map((g) => g[1]);
  const flush = isFlush(hand);
  const straight = isStraight(vals);

  if (flush && straight) return [8, vals];
  if (countsArr[0] === 4) return [7, groups.map((g) => g[0])];
  if (countsArr[0] === 3 && countsArr[1] === 2) return [6, groups.map((g) => g[0])];
  if (flush) return [5, vals];
  if (straight) return [4, vals];
  if (countsArr[0] === 3) return [3, groups.map((g) => g[0])];
  if (countsArr[0] === 2 && countsArr[1] === 2) return [2, groups.map((g) => g[0])];
  if (countsArr[0] === 2) return [1, groups.map((g) => g[0])];
  return [0, vals];
}

export function gameCardGame(
  hand1: string[],
  hand2: string[],
  hooks: GameCardGameHooks = {},
): number {
  const [r1, k1] = score(hand1);
  const [r2, k2] = score(hand2);
  const DESCS = ['高牌', '一对', '两对', '三条', '顺子', '同花', '葫芦', '四条', '同花顺'];
  hooks.onRank?.(1, r1, DESCS[r1]!);
  hooks.onRank?.(2, r2, DESCS[r2]!);

  let winner: number;
  if (r1 !== r2) winner = r1 > r2 ? 1 : 2;
  else {
    // 比较关键点数
    let cmp = 0;
    for (let i = 0; i < Math.max(k1.length, k2.length); i++) {
      const a = k1[i] ?? 0;
      const b = k2[i] ?? 0;
      if (a !== b) {
        cmp = a > b ? 1 : -1;
        break;
      }
    }
    winner = cmp > 0 ? 1 : cmp < 0 ? 2 : 0;
  }
  hooks.onConclude?.(winner);
  return winner;
}
