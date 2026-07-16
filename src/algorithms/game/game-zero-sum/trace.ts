// 零和博弈框架 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameZeroSum, type GameZeroSumHooks } from './impl.ts';

export const DEFAULT_INPUT: ReadonlyArray<readonly number[]> = [
  [4, 1],
  [2, 6],
];

export function buildTrace(input: ReadonlyArray<readonly number[]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const m = input.length;
  const n = input[0]?.length ?? 0;

  rec
    .begin({
      zh: `零和博弈 ${m}×${n} 矩阵`,
      en: `Zero-sum game ${m}x${n} matrix`,
    })
    .setGrid(input.map((row) => row.map((v) => ({ v, role: 'default' as BarRole }))))
    .commit();

  const hooks: GameZeroSumHooks = {
    onRowMin: (row, minVal) => {
      rec
        .begin({ zh: `行 ${row} 最小值 = ${minVal}`, en: `Row ${row} min = ${minVal}` })
        .setGrid(
          input.map((rowArr, r) =>
            rowArr.map((v) => ({ v, role: (r === row ? 'compare' : 'default') as BarRole })),
          ),
        )
        .setAux([{ label: `rowMin(${row})`, value: String(minVal), role: 'compare' as BarRole }])
        .commit();
    },
    onColMax: (col, maxVal) => {
      rec
        .begin({ zh: `列 ${col} 最大值 = ${maxVal}`, en: `Col ${col} max = ${maxVal}` })
        .setGrid(
          input.map((rowArr) =>
            rowArr.map((v, c) => ({ v, role: (c === col ? 'warn' : 'default') as BarRole })),
          ),
        )
        .setAux([{ label: `colMax(${col})`, value: String(maxVal), role: 'warn' as BarRole }])
        .commit();
    },
  };

  const result = gameZeroSum(input, hooks);

  rec
    .begin({
      zh: `结论：${result.hasSaddle ? '有' : '无'}纯鞍点，值 ${result.value}`,
      en: `Result: ${result.hasSaddle ? 'has' : 'no'} saddle, value ${result.value}`,
    })
    .setGrid(
      input.map((rowArr, r) =>
        rowArr.map((v, c) => ({
          v,
          role: (r === result.rowStrategy && c === result.colStrategy
            ? 'final'
            : 'default') as BarRole,
        })),
      ),
    )
    .setAux([
      { label: '鞍点', value: result.hasSaddle ? 'YES' : 'NO', role: 'final' },
      { label: '值', value: String(result.value), role: 'pivot' },
    ])
    .commit();

  return rec.build();
}
