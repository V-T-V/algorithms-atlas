// =============================================================================
// 度假 DP · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { vacation, type VacationHooks } from './impl.ts';

export const DEFAULT_INPUT = [
  [10, 40, 70],
  [20, 50, 80],
  [30, 60, 90],
];

export function buildTrace(input: ReadonlyArray<readonly number[]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const m = n > 0 ? input[0]!.length : 0;
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(m).fill(0));
  let curDay = -1;
  let total = 0;
  const plan: number[] = [];

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [
      { v: '天\\活动', role: 'default' },
      ...Array.from({ length: m }, (_, j) => ({ v: `a${j}`, role: 'pivot' as BarRole })),
    ];
    const grid: Cell[][] = [header];
    for (let i = 0; i < n; i++) {
      const row: Cell[] = [{ v: `d${i}`, role: 'pivot' as BarRole }];
      for (let j = 0; j < m; j++) {
        let role: BarRole = 'default';
        if (plan.length === n && plan[i] === j) role = 'final';
        else if (i === curDay) role = 'frontier';
        row.push({ v: dp[i]![j]!, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({ zh: `${n} 天 × ${m} 项活动`, en: `${n} days x ${m} activities` });

  const hooks: VacationHooks = {
    onDay: (i, row) => {
      dp[i] = [...row];
      curDay = i;
      snap({ zh: `第 ${i} 天 dp：[${row.join(', ')}]`, en: `Day ${i} dp: [${row.join(', ')}]` });
    },
    onResult: (t, p) => {
      total = t;
      plan.length = 0;
      plan.push(...p);
      curDay = -1;
      snap({
        zh: `最大幸福度 ${t}，方案 [${p.join(',')}]`,
        en: `Max happiness ${t}, plan [${p.join(',')}]`,
      });
    },
  };

  vacation(input, hooks);

  rec
    .begin({ zh: `完成：${total}`, en: `Done: ${total}` })
    .setGrid(renderGrid())
    .setAux([{ label: '最大幸福度', value: String(total), role: 'final' }])
    .commit();

  return rec.build();
}
