// =============================================================================
// 雅可比符号 · 录制帧序列
// 通过 jacobi 的钩子，把化简过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jacobi, type JacobiHooks } from './impl.ts';

export const DEFAULT_INPUT = { a: 1001, n: 9907 };

/** 录制演示帧序列。 */
export function buildTrace(input: { a: number; n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, n } = input;
  const lines: Array<{ key: string; value: string; role?: BarRole }> = [];

  const snapshot = (
    note: { zh: string; en: string },
    curA: number,
    curN: number,
    s: number,
  ): void => {
    rec
      .begin(note)
      .setAux([
        { label: 'a', value: String(curA), role: 'compare' as BarRole },
        { label: 'n', value: String(curN), role: 'frontier' as BarRole },
        { label: '符号 s', value: String(s), role: 'default' as BarRole },
      ])
      .setMap(lines.slice())
      .commit();
  };

  lines.push({ key: '初始', value: `J(${a}, ${n})`, role: 'default' });
  snapshot({ zh: `求 J(${a}, ${n})`, en: `Compute J(${a}, ${n})` }, ((a % n) + n) % n, n, 1);

  const hooks: JacobiHooks = {
    onStep: (curA, curN, s) => {
      lines.push({ key: '化简', value: `→ J(${curA}, ${curN})，s = ${s}`, role: 'default' });
      snapshot(
        {
          zh: `化简为 J(${curA}, ${curN})，当前符号 s = ${s}`,
          en: `Reduce to J(${curA}, ${curN}), sign s = ${s}`,
        },
        curA,
        curN,
        s,
      );
    },
    onResult: (v) => {
      lines.push({ key: '结果', value: `J = ${v}`, role: 'final' });
      rec
        .begin({ zh: `结果：J(${a}, ${n}) = ${v}`, en: `Result: J(${a}, ${n}) = ${v}` })
        .setAux([{ label: 'J(a, n)', value: String(v), role: 'final' as BarRole }])
        .setMap(lines.slice())
        .commit();
    },
  };

  jacobi(a, n, hooks);
  return rec.build();
}
