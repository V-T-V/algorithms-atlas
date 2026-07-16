// N 皇后验证 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btNQueensValidate, type BtNQueensValidateHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 0, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;

  // 用网格展示：Q 表示皇后
  const grid: Array<Array<string>> = [];
  for (let r = 0; r < n; r++) {
    const row: string[] = [];
    for (let c = 0; c < n; c++) row.push(input[r] === c ? 'Q' : '.');
    grid.push(row);
  }

  rec
    .begin({
      zh: `验证 ${n} 皇后布局 [${input.join(', ')}]`,
      en: `Validate ${n}-queens [${input.join(', ')}]`,
    })
    .setGrid(grid.map((row) => row.map((v) => ({ v, role: 'default' as BarRole }))))
    .commit();

  const hooks: BtNQueensValidateHooks = {
    onCheckPair: (r1, c1, r2, c2, ok) => {
      const roles: Record<string, BarRole> = {};
      if (r1 >= 0) roles[`${r1},${c1}`] = 'compare';
      if (r2 >= 0) roles[`${r2},${c2}`] = ok ? 'final' : 'warn';
      rec
        .begin({
          zh: `检查 (${r1},${c1}) 与 (${r2},${c2})：${ok ? '不冲突' : '冲突!'}`,
          en: `Check (${r1},${c1}) vs (${r2},${c2}): ${ok ? 'ok' : 'CONFLICT!'}`,
        })
        .setGrid(
          grid.map((row, ri) =>
            row.map((v, ci) => ({ v, role: roles[`${ri},${ci}`] ?? 'default' })),
          ),
        )
        .commit();
    },
  };

  const valid = btNQueensValidate(input, hooks);

  rec
    .begin({
      zh: `结论：${valid ? '合法' : '非法'}布局`,
      en: `Result: ${valid ? 'valid' : 'invalid'} placement`,
    })
    .setGrid(
      grid.map((row) => row.map((v) => ({ v, role: (valid ? 'final' : 'warn') as BarRole }))),
    )
    .setAux([{ label: '结论', value: valid ? 'VALID' : 'INVALID', role: valid ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}
