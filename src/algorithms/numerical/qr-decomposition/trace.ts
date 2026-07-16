// =============================================================================
// QR 分解 · 录制帧序列
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { qrDecomposition, type QRHooks } from './impl.ts';

export const DEFAULT_INPUT = [
  [1, 1, 0],
  [1, 0, 1],
  [0, 1, 1],
];

function gridFrom(A: number[][]): Cell[][] {
  return A.map((row) => row.map((v) => ({ v: v.toFixed(3), role: 'default' as BarRole })));
}

export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `对 ${input.length}×${input[0]!.length} 矩阵做 QR 分解`,
      en: `QR decompose ${input.length}×${input[0]!.length} matrix`,
    })
    .setGrid(gridFrom(input))
    .setAux([{ label: '说明', value: 'Gram-Schmidt 正交化', role: 'pivot' as BarRole }])
    .commit();

  let colCount = 0;
  const hooks: QRHooks = {
    onColumn: (k, qk, rRow) => {
      colCount++;
      rec
        .begin({
          zh: `处理第 ${k} 列：q_${k} = [${qk.map((v) => v.toFixed(3)).join(', ')}]`,
          en: `Process col ${k}: q_${k} = [${qk.map((v) => v.toFixed(3)).join(', ')}]`,
        })
        .setBars(
          qk.map((v, i) => ({
            value: v,
            role: i === 0 ? ('frontier' as BarRole) : ('default' as BarRole),
            label: `q${i}=${v.toFixed(2)}`,
          })),
        )
        .setAux([
          {
            label: `R 第 ${k} 行`,
            value: rRow.map((v) => v.toFixed(3)).join(', '),
            role: 'final' as BarRole,
          },
          { label: '列号', value: String(k), role: 'pivot' as BarRole },
        ])
        .commit();
    },
  };

  const { Q, R } = qrDecomposition(input, hooks);
  void colCount;

  rec
    .begin({ zh: `完成：A = Q·R`, en: `Done: A = Q·R` })
    .setMap([
      {
        key: 'Q (正交)',
        value: Q.map((row) => row.map((v) => v.toFixed(3)).join(',')).join(' | '),
        role: 'final' as BarRole,
      },
      {
        key: 'R (上三角)',
        value: R.map((row) => row.map((v) => v.toFixed(3)).join(',')).join(' | '),
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
