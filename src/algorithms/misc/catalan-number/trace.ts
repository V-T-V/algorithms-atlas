// 卡塔兰数 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { catalanNumber, type CatalanHooks } from './impl.ts';

export const DEFAULT_INPUT = 8;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const seq: number[] = [1]; // C(0)
  let resultVal = 1;

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = seq.map((_, i) => (i === seq.length - 1 ? 'final' : 'sorted'));
    rec
      .begin(note)
      .setBars(seq.map((v, i) => ({ value: v, role: roles[i]!, label: `C(${i})` })))
      .setAux([
        { label: '目标 n', value: String(n), role: 'pivot' as BarRole },
        { label: '已计算项数', value: String(seq.length), role: 'frontier' as BarRole },
        { label: '当前 C(n)', value: String(seq[seq.length - 1] ?? 0), role: 'final' as BarRole },
      ])
      .commit();
  };

  render({ zh: `计算 C(${n})`, en: `Compute C(${n})` });

  const hooks: CatalanHooks = {
    onStep: (k, prev, cur) => {
      seq.push(cur);
      render({
        zh: `C(${k}) = C(${k - 1})·2(2·${k}-1)/(${k}+1) = ${prev}·${2 * (2 * k - 1)}/${k + 1} = ${cur}`,
        en: `C(${k}) = ${prev}·${2 * (2 * k - 1)}/${k + 1} = ${cur}`,
      });
    },
    onResult: (nn, value) => {
      resultVal = value;
    },
  };

  catalanNumber(n, hooks);

  rec
    .begin({ zh: `C(${n}) = ${resultVal}`, en: `C(${n}) = ${resultVal}` })
    .setBars(seq.map((v, i) => ({ value: v, role: 'final' as BarRole, label: `C(${i})` })))
    .setAux([
      { label: '结果', value: String(resultVal), role: 'final' as BarRole },
      { label: '应用', value: '合法括号/二叉树/三角剖分', role: 'sorted' as BarRole },
    ])
    .commit();

  return rec.build();
}
