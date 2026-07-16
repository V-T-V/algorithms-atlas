// 递归求字符串长度 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stringLength, type StrLenHooks } from './impl.ts';

export const DEFAULT_INPUT = 'hello';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const full = input;
  let curRemaining = full;
  let maxDepth = 0;
  const returns: number[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const chars = [...full];
    const eaten = full.length - curRemaining.length;
    const bars = chars.map((c, i) => ({
      value: 1,
      role: (i < eaten ? 'final' : i === eaten ? 'pivot' : 'default') as BarRole,
      label: c,
    }));
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '剩余', value: `"${curRemaining}"`, role: 'pivot' as BarRole },
      { label: '已数', value: String(eaten), role: 'frontier' as BarRole },
      { label: '最大深度', value: String(maxDepth), role: 'compare' as BarRole },
    ];
    if (returns.length) {
      aux.push({
        label: '累计返回',
        value: String(returns[returns.length - 1]),
        role: 'final' as BarRole,
      });
    }
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  snapshot({ zh: `数 "${full}" 的长度`, en: `Count length of "${full}"` });

  const hooks: StrLenHooks = {
    onRecurse: (rem, depth) => {
      curRemaining = rem;
      maxDepth = Math.max(maxDepth, depth + 1);
      snapshot({ zh: `砍首字符，剩 "${rem}"`, en: `Drop first, remain "${rem}"` });
    },
    onBase: (depth) => {
      curRemaining = '';
      void depth;
      snapshot({ zh: `空串，基线返回 0`, en: `Empty, base returns 0` });
    },
    onReturn: (len, _d) => {
      returns.push(len);
      // 恢复一层（粗略： eaten 减少 1）
      const eaten = full.length - (len - 0);
      void eaten;
      curRemaining = full.slice(
        Math.max(0, full.length - (len - 1) > 0 ? full.length - (len - 1) : 0),
      );
      snapshot({ zh: `返回 ${len}`, en: `Return ${len}` });
    },
  };

  const result = stringLength(full, hooks);

  rec
    .begin({ zh: `长度 = ${result}`, en: `Length = ${result}` })
    .setBars([...full].map((c) => ({ value: 1, role: 'final' as BarRole, label: c })))
    .setAux([
      { label: '结果', value: String(result), role: 'final' as BarRole },
      { label: '复杂度', value: 'O(n^2)', role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
