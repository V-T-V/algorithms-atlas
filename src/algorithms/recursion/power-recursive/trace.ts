// 递归快速幂 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { powerRecursive, type PowerRecursiveHooks } from './impl.ts';

export const DEFAULT_INPUT = { base: 2, exp: 10, mod: 1000 };

export function buildTrace(
  input: { base: number; exp: number; mod?: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { base, exp, mod } = input;
  const stack: Array<{ base: number; exp: number; depth: number }> = [];
  let resultVal = 0;

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: '底数 base', value: String(base), role: 'pivot' as BarRole },
        { label: '指数 exp', value: String(exp), role: 'pivot' as BarRole },
        ...(mod !== undefined
          ? [{ label: '模数 mod', value: String(mod), role: 'frontier' as BarRole }]
          : []),
        { label: '递归栈深度', value: String(stack.length), role: 'compare' as BarRole },
        ...stack.map((s) => ({
          label: `depth ${s.depth}`,
          value: `pow(${s.base}, ${s.exp})`,
          role: 'compare' as BarRole,
        })),
      ])
      .commit();
  };

  render({
    zh: `计算 ${base}^${exp}${mod !== undefined ? ` mod ${mod}` : ''}`,
    en: `Compute ${base}^${exp}${mod !== undefined ? ` mod ${mod}` : ''}`,
  });

  const hooks: PowerRecursiveHooks = {
    onRecurse: (bb, ee, depth) => {
      stack.push({ base: bb, exp: ee, depth });
      render({ zh: `进入 pow(${bb}, ${ee})`, en: `Enter pow(${bb}, ${ee})` });
    },
    onBase: () => {
      render({ zh: `exp=0 → 返回 1`, en: `exp=0 → return 1` });
    },
    onCombine: (ee, sub, result, depth) => {
      const idx = stack.findIndex((s) => s.depth === depth);
      if (idx >= 0) stack.splice(idx, 1);
      const how = ee % 2 === 0 ? '偶数：平方' : '奇数：平方×base';
      render({
        zh: `pow(^${ee}) 合并：${how}（子结果 ${sub} → ${result}）`,
        en: `pow(^${ee}) combine: ${ee % 2 === 0 ? 'even: square' : 'odd: square*base'} (sub ${sub} → ${result})`,
      });
    },
  };

  resultVal = powerRecursive(base, exp, mod, hooks);

  rec
    .begin({
      zh: `${base}^${exp}${mod !== undefined ? ` mod ${mod}` : ''} = ${resultVal}`,
      en: `${base}^${exp}${mod !== undefined ? ` mod ${mod}` : ''} = ${resultVal}`,
    })
    .setAux([{ label: '结果', value: String(resultVal), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
