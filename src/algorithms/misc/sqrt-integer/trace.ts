// 整数平方根（牛顿法）· 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { integerSqrt, type SqrtIntegerHooks } from './impl.ts';

export const DEFAULT_INPUT = 152399025;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const iters: Array<{ iter: number; x: number }> = [];
  let resultVal = 0;
  let curX = n;

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        iters.map((it) => ({
          value: it.x,
          role: (it.iter === iters.length ? 'compare' : 'sorted') as BarRole,
          label: `#${it.iter}`,
        })),
      )
      .setAux([
        { label: 'n', value: String(n), role: 'pivot' as BarRole },
        { label: '当前 x', value: String(curX), role: 'compare' as BarRole },
        { label: 'x²', value: String(curX * curX), role: 'frontier' as BarRole },
        {
          label: '与 n 比较',
          value: curX * curX > n ? 'x² > n' : curX * curX < n ? 'x² < n' : 'x² == n',
          role: 'swap' as BarRole,
        },
      ])
      .commit();
  };

  render({ zh: `求 floor(√${n})`, en: `Compute floor(√${n})` });

  const hooks: SqrtIntegerHooks = {
    onIter: (iter, x) => {
      iters.push({ iter, x });
      curX = x;
      render({
        zh: `第 ${iter} 次迭代：x ← ${x}（x²=${x * x}）`,
        en: `Iter ${iter}: x ← ${x} (x²=${x * x})`,
      });
    },
    onConverge: (iter, root) => {
      curX = root;
      render({
        zh: `收敛于第 ${iter} 次：x = ${root}`,
        en: `Converged at iter ${iter}: x = ${root}`,
      });
    },
    onResult: (_nn, root) => {
      resultVal = root;
      curX = root;
    },
  };

  integerSqrt(n, hooks);

  rec
    .begin({
      zh: `floor(√${n}) = ${resultVal}（${resultVal}²=${resultVal * resultVal}）`,
      en: `floor(√${n}) = ${resultVal} (${resultVal}²=${resultVal * resultVal})`,
    })
    .setBars([{ value: resultVal, role: 'final' as BarRole, label: `√n` }])
    .setAux([
      { label: '结果', value: String(resultVal), role: 'final' as BarRole },
      {
        label: '验证',
        value: `${resultVal}²=${resultVal * resultVal} ≤ ${n} < ${resultVal + 1}²=${(resultVal + 1) ** 2}`,
        role: 'sorted' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
