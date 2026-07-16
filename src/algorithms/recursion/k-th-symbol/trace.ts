// 第 K 个语法符号 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kthSymbol, type KthSymbolHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 4, k: 5 };

export function buildTrace(input: { n: number; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, k } = input;
  const stack: Array<{ n: number; k: number; half: 'first' | 'second' }> = [];
  let maxDepth = 0;
  let curReturn: { n: number; v: 0 | 1; flipped: boolean } | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = stack.map((s, i) => ({
      value: s.k,
      role: (i === stack.length - 1 ? 'pivot' : 'frontier') as BarRole,
      label: `n=${s.n},k=${s.k}(${s.half[0]!.toUpperCase()})`,
    }));
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      {
        label: '调用栈',
        value: stack.map((s) => `(${s.n},${s.k})`).join('→') || '∅',
        role: 'pivot' as BarRole,
      },
      { label: '栈深', value: String(stack.length), role: 'frontier' as BarRole },
      { label: '最大深度', value: String(maxDepth), role: 'compare' as BarRole },
    ];
    if (curReturn) {
      aux.push({
        label: '返回',
        value: `n=${curReturn.n}→${curReturn.v}${curReturn.flipped ? '(翻转)' : ''}`,
        role: curReturn.v === 1 ? ('warn' as BarRole) : ('final' as BarRole),
      });
    }
    rec.begin(note).setBars(bars).setAux(aux).commit();
    curReturn = null;
  };

  snapshot({ zh: `第 ${n} 行第 ${k} 个符号`, en: `Row ${n}, pos ${k}` });

  const hooks: KthSymbolHooks = {
    onRecurse: (rn, rk, half, depth) => {
      stack.push({ n: rn, k: rk, half });
      maxDepth = Math.max(maxDepth, depth + 1);
      void half;
      snapshot({
        zh: `进入 n=${rn}, k=${rk}（${half}半）`,
        en: `Enter n=${rn}, k=${rk} (${half} half)`,
      });
    },
    onBase: () => {
      snapshot({ zh: `基线 n=1 → 0`, en: `Base n=1 → 0` });
    },
    onReturn: (rn, v, flipped, _depth) => {
      stack.pop();
      curReturn = { n: rn, v, flipped };
      snapshot({
        zh: `返回 n=${rn} → ${v}${flipped ? '（翻转）' : ''}`,
        en: `Return n=${rn} → ${v}${flipped ? ' (flipped)' : ''}`,
      });
    },
  };

  const result = kthSymbol(n, k, hooks);

  rec
    .begin({ zh: `结果 = ${result}`, en: `Result = ${result}` })
    .setBars([
      {
        value: 1,
        role: result === 1 ? ('warn' as BarRole) : ('final' as BarRole),
        label: String(result),
      },
    ])
    .setAux([
      { label: '结果', value: String(result), role: 'final' as BarRole },
      { label: '最大深度', value: String(maxDepth), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
