// =============================================================================
// 分块 · 录制帧序列
// 通过 sqrtDecomposition 的钩子，把建块 + 区间查询过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sqrtDecomposition, type SqrtDecompositionHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [5, 2, 8, 1, 9, 3, 7, 4, 6, 0, 3, 5], lo: 2, hi: 9 };

/** 录制演示帧序列。 */
export function buildTrace(
  input: { arr: number[]; lo: number; hi: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { arr, lo, hi } = input;
  const n = arr.length;
  const B = Math.max(1, Math.ceil(Math.sqrt(n)));
  const used = new Set<number>(); // 查询中扫描过的下标
  const blockUsed = new Set<number>();

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (let i = lo; i <= hi; i++) roles[i] = 'frontier';
    for (const u of used) roles[u] = 'compare';
    rec.begin(note).setBars(rec.barsFrom(arr, roles)).commit();
  };

  rec
    .begin({ zh: `数组长度 ${n}，块大小 ⌈√n⌉ = ${B}`, en: `Length ${n}, block size ⌈√n⌉ = ${B}` })
    .setBars(rec.barsFrom(arr))
    .commit();

  const hooks: SqrtDecompositionHooks = {
    onBlockBuild: () => {
      // 建块不单独成帧
    },
    onScanElement: (i) => {
      used.add(i);
    },
    onUseBlock: (b) => {
      blockUsed.add(b);
      for (let i = b * B; i < Math.min(n, (b + 1) * B); i++) used.add(i);
      snapshot({ zh: `使用整块 ${b} 的预聚合`, en: `Use precomputed block ${b}` });
    },
    onQuery: (_, __, sum) => {
      snapshot({ zh: `区间 [${lo}, ${hi}] 求和 = ${sum}`, en: `Sum over [${lo}, ${hi}] = ${sum}` });
    },
  };

  const sd = sqrtDecomposition(arr, hooks);
  const result = sd.query(lo, hi);
  void result;

  rec
    .begin({
      zh: `查询完成：sum[${lo}..${hi}] = ${result}`,
      en: `Done: sum[${lo}..${hi}] = ${result}`,
    })
    .setBars(arr.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
