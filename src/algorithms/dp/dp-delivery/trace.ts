// =============================================================================
// 快递员区间 DP · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { deliveryCourier, type DeliveryHooks } from './impl.ts';

export const DEFAULT_INPUT = { positions: [-10, -5, 0, 5, 10], start: 0 };

export function buildTrace(
  input: { positions: readonly number[]; start: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const positions = input.positions;
  const n = positions.length;
  // dist[i][j][s]
  const dist: number[][][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => [-1, -1]),
  );
  let curI = -1;
  let curJ = -1;
  let curSide: 0 | 1 = 0;
  let result = Infinity;

  const fmt = (v: number): string => (v < 0 ? '·' : v === Infinity ? '∞' : String(v));

  const snap = (note: { zh: string; en: string }): void => {
    // 用 bars 表示各点；当前正在扩展的区间高亮
    const roles: Record<number, BarRole> = {};
    const labels: Record<number, string> = {};
    const range = new Set<number>();
    for (let k = 0; k < n; k++) {
      labels[k] = String(positions[k]);
      if (positions[k] === input.start) roles[k] = 'pivot';
    }
    if (curI >= 0 && curJ >= 0) {
      for (let k = curI; k <= curJ; k++) range.add(k);
      const endpoint = curSide === 0 ? curI : curJ;
      roles[endpoint] = 'compare';
      for (const k of range) if (k !== endpoint && roles[k] !== 'pivot') roles[k] = 'frontier';
    }
    rec
      .begin(note)
      .setBars(
        rec.barsFrom(
          positions.map((p) => Math.abs(p)),
          roles,
          labels,
        ),
      )
      .setAux([
        {
          label: `f[${curI}][${curJ}][左]`,
          value: fmt(curI >= 0 ? dist[curI]![curJ]![0]! : -1),
          role: 'frontier',
        },
        {
          label: `f[${curI}][${curJ}][右]`,
          value: fmt(curI >= 0 ? dist[curI]![curJ]![1]! : -1),
          role: 'frontier',
        },
        { label: '起点', value: String(input.start), role: 'pivot' },
        {
          label: '答案',
          value: result === Infinity ? '（计算中）' : String(result),
          role: 'final',
        },
      ])
      .commit();
  };

  snap({
    zh: `位置 [${positions.join(', ')}]，起点 ${input.start}`,
    en: `Positions [${positions.join(', ')}], start ${input.start}`,
  });

  const hooks: DeliveryHooks = {
    onExpand: (i, j, side, d) => {
      dist[i]![j]![side] = d;
      curI = i;
      curJ = j;
      curSide = side;
      if (d < Infinity)
        snap({
          zh: `f[${i}][${j}][${side === 0 ? '左' : '右'}] = ${fmt(d)}`,
          en: `f[${i}][${j}][${side === 0 ? 'L' : 'R'}] = ${fmt(d)}`,
        });
    },
    onResult: (m) => {
      result = m;
      curI = -1;
      curJ = -1;
    },
  };

  deliveryCourier(input, hooks);

  rec
    .begin({ zh: `最小路程 ${result}`, en: `Min distance ${result}` })
    .setBars(
      rec.barsFrom(
        positions.map((p) => Math.abs(p)),
        {},
        Object.fromEntries(positions.map((p, i) => [i, String(p)])),
      ),
    )
    .setAux([{ label: '最小路程', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
