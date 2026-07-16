// =============================================================================
// HyperLogLog · 录制帧序列
// 用 setGrid 展示寄存器数组（按 2^b 排成网格），aux 展示当前估计值。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { HyperLogLog, hash32, clz32, type HllHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // 生成若干不同元素 + 重复，演示基数估计
  distinct: 200,
  repeats: 3,
  precision: 6,
};

interface BuildTraceInput {
  distinct?: number;
  repeats?: number;
  precision?: number;
}

/** 录制演示帧序列。 */
export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const distinct = input.distinct ?? DEFAULT_INPUT.distinct;
  const repeats = input.repeats ?? DEFAULT_INPUT.repeats;
  const precision = input.precision ?? DEFAULT_INPUT.precision;

  const rec = new TraceRecorder();
  const hll = new HyperLogLog(precision);
  const m = hll.m;
  let curJ = -1;
  let observed = 0;

  // 把寄存器排成网格：每行 16 个
  const cols = Math.min(m, 16);
  const rows = Math.ceil(m / cols);

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [{ v: 'reg', role: 'default' }];
    for (let c = 0; c < cols; c++) header.push({ v: c, role: 'pivot' });
    const grid: Cell[][] = [header];
    for (let r = 0; r < rows; r++) {
      const row: Cell[] = [{ v: r * cols, role: 'pivot' }];
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (idx >= m) {
          row.push({ v: '', role: 'default' });
          continue;
        }
        const v = hll.registers[idx]!;
        let role: BarRole = 'default';
        if (idx === curJ) role = 'final';
        else if (v > 0) role = 'sorted';
        row.push({ v: v === 0 ? '·' : v, role });
      }
      grid.push(row);
    }
    return grid;
  };

  rec
    .begin({
      zh: `HyperLogLog：m=${m} 个寄存器（精度 b=${precision}）。观察 ${distinct} 不同元素 × ${repeats} 次。`,
      en: `HyperLogLog: m=${m} registers (precision b=${precision}). Observe ${distinct} distinct items × ${repeats} times.`,
    })
    .setGrid(renderGrid())
    .setAux([
      { label: '寄存器数 m', value: String(m), role: 'pivot' as BarRole },
      { label: '已观察', value: '0', role: 'default' as BarRole },
      { label: '当前估计', value: '0', role: 'frontier' as BarRole },
      { label: '真实基数', value: String(distinct), role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: HllHooks = {
    onObserve: (_item, j, rho, updated, oldMax) => {
      curJ = j;
      observed++;
      // 每 ~30 个元素记录一帧，避免帧过多；总元素 distinct*repeats
      const total = distinct * repeats;
      const stride = Math.max(1, Math.floor(total / 40));
      if (observed % stride === 0 || observed === total) {
        rec
          .begin({
            zh: `已观察 ${observed}/${total}：寄存器 ${j} 观察到 ρ=${rho}（${updated ? `更新 ${oldMax}→${rho}` : '未更新'}）。估计≈${hll.estimate()}`,
            en: `Observed ${observed}/${total}: register ${j} saw ρ=${rho} (${updated ? `updated ${oldMax}→${rho}` : 'no update'}). Est≈${hll.estimate()}`,
          })
          .setGrid(renderGrid())
          .setAux([
            { label: '寄存器数 m', value: String(m), role: 'pivot' as BarRole },
            { label: '已观察', value: String(observed), role: 'default' as BarRole },
            { label: '当前估计', value: String(hll.estimate()), role: 'frontier' as BarRole },
            { label: '真实基数', value: String(distinct), role: 'compare' as BarRole },
            { label: '当前寄存器', value: String(j), role: 'final' as BarRole },
          ])
          .commit();
      }
    },
  };

  for (let r = 0; r < repeats; r++) {
    for (let i = 0; i < distinct; i++) {
      hll.add(`item-${i}`, hooks);
    }
  }

  const est = hll.estimate();
  const errPct = (Math.abs(est - distinct) / distinct) * 100;
  rec
    .begin({
      zh: `完成：估计 ${est}，真实 ${distinct}，误差 ${errPct.toFixed(1)}%`,
      en: `Done: estimate ${est}, actual ${distinct}, error ${errPct.toFixed(1)}%`,
    })
    .setGrid(renderGrid())
    .setAux([
      { label: '最终估计', value: String(est), role: 'final' as BarRole },
      { label: '真实基数', value: String(distinct), role: 'compare' as BarRole },
      {
        label: '误差',
        value: errPct.toFixed(1) + '%',
        role: (errPct < 10 ? 'final' : 'warn') as BarRole,
      },
      { label: '观察总数', value: String(observed), role: 'default' as BarRole },
      { label: '寄存器数', value: String(m), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}

export { hash32, clz32 };
