// 数根 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { digitalRoot, type DigitRootHooks } from './impl.ts';

export const DEFAULT_INPUT = 9875;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const rounds: Array<{ round: number; x: number; s: number }> = [];
  let resultVal = n;
  const digits = String(n).split('').map(Number);

  const render = (note: { zh: string; en: string }, x: number): void => {
    const curDigits = String(x).split('').map(Number);
    const roles: BarRole[] = curDigits.map(() => 'compare' as BarRole);
    rec
      .begin(note)
      .setBars(curDigits.map((d, i) => ({ value: d, role: roles[i]!, label: String(d) })))
      .setAux([
        { label: '原始 n', value: String(n), role: 'pivot' as BarRole },
        { label: '当前 x', value: String(x), role: 'frontier' as BarRole },
        { label: '位数', value: String(curDigits.length), role: 'compare' as BarRole },
        ...rounds.map((r) => ({
          label: `第 ${r.round} 轮`,
          value: `${r.x} → ${r.s}`,
          role: 'sorted' as BarRole,
        })),
      ])
      .commit();
  };

  render({ zh: `求 ${n} 的数根`, en: `Digital root of ${n}` }, n);

  const hooks: DigitRootHooks = {
    onRound: (round, x, s) => {
      rounds.push({ round, x, s });
      render(
        {
          zh: `第 ${round} 轮：${x} 各位和 = ${s}`,
          en: `Round ${round}: digit sum of ${x} = ${s}`,
        },
        s,
      );
    },
    onResult: (_nn, root) => {
      resultVal = root;
    },
  };

  digitalRoot(n, hooks);

  rec
    .begin({ zh: `数根(${n}) = ${resultVal}`, en: `digital_root(${n}) = ${resultVal}` })
    .setBars(digits.map((d) => ({ value: d, role: 'final' as BarRole, label: String(d) })))
    .setAux([{ label: '结果', value: String(resultVal), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
