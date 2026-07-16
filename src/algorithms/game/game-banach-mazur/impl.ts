// Banach-Mazur 博弈 · 实现 (离散版：在 [0,1] 上交替缩小区间)
export interface BmHooks {
  onMove?: (player: 'A' | 'B', lo: number, hi: number) => void;
  onResult?: (inTarget: boolean, winner: 'A' | 'B') => void;
}
export function banachMazur(
  rounds: number,
  targetLo: number,
  targetHi: number,
  hooks: BmHooks = {},
): 'A' | 'B' {
  let lo = 0,
    hi = 1;
  for (let r = 0; r < rounds; r++) {
    const player: 'A' | 'B' = r % 2 === 0 ? 'A' : 'B';
    // 缩到中点附近的一个子区间
    const mid = (lo + hi) / 2;
    if (player === 'A') {
      // A 试图逼近 target
      const tmid = (targetLo + targetHi) / 2;
      lo = Math.max(lo, Math.min(mid, tmid) - (hi - lo) / 8);
      hi = Math.min(hi, Math.min(mid, tmid) + (hi - lo) / 8);
    } else {
      // B 试图远离 target
      lo = lo + (hi - lo) / 4;
      hi = hi - (hi - lo) / 4;
    }
    hooks.onMove?.(player, lo, hi);
  }
  const pt = (lo + hi) / 2;
  const inTarget = pt >= targetLo && pt <= targetHi;
  hooks.onResult?.(inTarget, inTarget ? 'A' : 'B');
  return inTarget ? 'A' : 'B';
}
