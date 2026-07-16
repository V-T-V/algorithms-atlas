// =============================================================================
// 埃拉托斯特尼筛 · 录制帧序列
// 用 setGrid 展示数字网格（按列排成若干行）：
//   role:'warn'  = 被筛掉的合数
//   role:'final' = 留下的素数
//   role:'compare' = 当前作为筛子的素数
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sieveEratosthenes, type SieveHooks } from './impl.ts';

export const DEFAULT_INPUT: { n: number } = { n: 30 };

/** 录制演示帧序列。 */
export function buildTrace(input: { n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n } = input;

  if (n < 2) {
    rec
      .begin({ zh: `n=${n} < 2，无素数`, en: `n=${n} < 2, no primes` })
      .setGrid(rec.gridFrom([['无 / none']]))
      .commit();
    return rec.build();
  }

  // 用固定列数把 2..n 铺成网格（列数取 10 或 ceil(sqrt(n)) 取小，保持紧凑）
  const cols = Math.min(10, Math.max(6, Math.ceil(Math.sqrt(n))));
  const numbers: number[] = [];
  for (let v = 2; v <= n; v++) numbers.push(v);

  const primes = new Set<number>(); // 已确认素数
  const composites = new Set<number>(); // 已筛掉的合数
  let sieveP = -1; // 当前筛子素数
  let justMarked = -1; // 当前帧刚标记的合数

  const renderGrid = (): Cell[][] => {
    const rows: Cell[][] = [];
    for (let v = 2; v <= n; v++) {
      const idx = v - 2;
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      if (!rows[r]) rows[r] = [];
      let role: BarRole = 'default';
      if (primes.has(v)) role = 'final';
      else if (composites.has(v)) role = 'warn';
      if (v === sieveP) role = 'compare';
      else if (v === justMarked) role = 'swap';
      rows[r]![c] = { v, role };
    }
    return rows;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
    justMarked = -1;
  };

  snapshot({ zh: `筛选 [2, ${n}] 内的素数`, en: `Sieve primes in [2, ${n}]` });

  const hooks: SieveHooks = {
    onPrime: (p) => {
      primes.add(p);
      sieveP = p;
      snapshot({
        zh: `${p} 未被筛掉 → 是素数，用它筛倍数`,
        en: `${p} survived → prime, sieve its multiples`,
      });
    },
    onMarkComposite: (c, p) => {
      composites.add(c);
      justMarked = c;
      sieveP = p;
      snapshot({
        zh: `${c} = ${p}×${c / p}，标记为合数`,
        en: `${c} = ${p}×${c / p}, mark composite`,
      });
    },
  };

  sieveEratosthenes(n, hooks);

  // 终态
  sieveP = -1;
  justMarked = -1;
  rec
    .begin({
      zh: `完成：共 ${primes.size} 个素数`,
      en: `Done: ${primes.size} primes`,
    })
    .setGrid(renderGrid())
    .commit();

  return rec.build();
}
