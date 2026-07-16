// 递归链表长度 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listLength, type ListLengthHooks } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 40, 50];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  let depthVisited = 0;
  const returns: Array<{ depth: number; count: number }> = [];
  let maxDepth = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const returnedDepths = new Set(returns.map((r) => r.depth));
    const bars = input.map((v, i) => {
      let role: BarRole = 'default';
      if (i < depthVisited) role = 'compare';
      if (returnedDepths.has(i)) role = 'final';
      return { value: v, role, label: String(v) };
    });
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '已访问', value: String(depthVisited), role: 'compare' as BarRole },
      { label: '最大深度', value: String(maxDepth), role: 'frontier' as BarRole },
    ];
    const top = returns[returns.length - 1];
    if (top) aux.push({ label: '最新计数', value: String(top.count), role: 'final' as BarRole });
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  snapshot({ zh: `计数：${JSON.stringify(input)}`, en: `Count: ${JSON.stringify(input)}` });

  const hooks: ListLengthHooks = {
    onVisit: (_v, depth) => {
      depthVisited = depth + 1;
      maxDepth = Math.max(maxDepth, depth + 1);
      snapshot({ zh: `访问第 ${depth + 1} 个`, en: `Visit node ${depth + 1}` });
    },
    onBase: (depth) => snapshot({ zh: `末尾（深度 ${depth}）`, en: `End (depth ${depth})` }),
    onReturn: (count, depth) => {
      returns.push({ depth, count });
      snapshot({
        zh: `返回 count=${count}（深度 ${depth}）`,
        en: `Return count=${count} (depth ${depth})`,
      });
    },
  };

  const result = listLength(head, hooks);

  rec
    .begin({ zh: `长度 = ${result}`, en: `Length = ${result}` })
    .setBars(input.map((v) => ({ value: v, role: 'final' as BarRole, label: String(v) })))
    .setAux([
      { label: '结果', value: String(result), role: 'final' as BarRole },
      { label: '复杂度', value: 'O(n)', role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
