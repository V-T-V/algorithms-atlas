// 递归链表求和 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listSum, listToArray, type ListSumHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 4, 1, 5, 9];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  const values = listToArray(head);
  let depthVisited = 0;
  const partials: Array<{ depth: number; value: number; sum: number }> = [];
  let maxDepth = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    // 已返回的节点标记 final，当前访问的最深节点 pivot
    const returnedDepths = new Set(partials.map((p) => p.depth));
    const bars = values.map((v, i) => {
      let role: BarRole = 'default';
      if (i < depthVisited) role = 'compare';
      if (returnedDepths.has(i)) role = 'final';
      if (i === depthVisited - 1 && depthVisited > 0) role = 'pivot';
      return { value: v, role, label: String(v) };
    });
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '已访问深度', value: String(depthVisited), role: 'compare' as BarRole },
      { label: '最大深度', value: String(maxDepth), role: 'frontier' as BarRole },
    ];
    const top = partials[partials.length - 1];
    if (top) {
      aux.push({
        label: '最新部分和',
        value: `${top.value}+...=${top.sum}`,
        role: 'final' as BarRole,
      });
    }
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  snapshot({ zh: `求和：${JSON.stringify(values)}`, en: `Sum: ${JSON.stringify(values)}` });

  const hooks: ListSumHooks = {
    onVisit: (_v, depth) => {
      depthVisited = depth + 1;
      maxDepth = Math.max(maxDepth, depth + 1);
      snapshot({ zh: `访问第 ${depth + 1} 个节点`, en: `Visit node ${depth + 1}` });
    },
    onBase: (depth) => {
      snapshot({ zh: `链表末尾（深度 ${depth}）`, en: `End of list (depth ${depth})` });
    },
    onReturn: (value, sum, depth) => {
      partials.push({ depth, value, sum });
      snapshot({
        zh: `返回：${value} + ${sum - value} = ${sum}`,
        en: `Return: ${value} + ${sum - value} = ${sum}`,
      });
    },
  };

  const result = listSum(head, hooks);

  rec
    .begin({ zh: `总和 = ${result}`, en: `Total = ${result}` })
    .setBars(values.map((v) => ({ value: v, role: 'final' as BarRole, label: String(v) })))
    .setAux([
      { label: '结果', value: String(result), role: 'final' as BarRole },
      { label: '节点数', value: String(values.length), role: 'frontier' as BarRole },
      { label: '复杂度', value: 'O(n)', role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
