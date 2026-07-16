// =============================================================================
// n 位格雷码（公式法）· 录制帧序列
// 用 setAux 展示每个格雷码与相邻差（恒为 1 个 bit）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { grayCodeN, toBinaryString, type GrayCodeNHooks } from './impl.ts';

export const DEFAULT_N = 3;

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const codes: number[] = [];

  rec
    .begin({ zh: `生成 ${n} 位格雷码（公式 g(i)=i^(i>>1)）`, en: `Generate ${n}-bit Gray codes` })
    .setAux([
      { label: 'n', value: String(n), role: 'pivot' },
      { label: '总数', value: String(1 << n), role: 'frontier' },
    ])
    .commit();

  const hooks: GrayCodeNHooks = {
    onEmit: (i, code) => {
      codes.push(code);
      const prev = i > 0 ? codes[i - 1]! : null;
      const diff = prev === null ? '—' : `相差 ${popcount(prev ^ code)} 位`;
      rec
        .begin({
          zh: `g(${i}) = ${i} ^ ${i >> 1} = ${code}（${toBinaryString(code, n)}）`,
          en: `g(${i}) = ${code}`,
        })
        .setBars(codes.map((c) => ({ value: c, role: 'final' as BarRole })))
        .setAux([
          { label: '当前', value: toBinaryString(code, n), role: 'compare' },
          { label: '与上一位差异', value: diff, role: prev === null ? 'default' : 'final' },
        ])
        .commit();
    },
  };

  grayCodeN(n, hooks);

  return rec.build();
}

function popcount(n: number): number {
  let c = 0;
  let x = n;
  while (x > 0) {
    x -= x & -x;
    c++;
  }
  return c;
}
