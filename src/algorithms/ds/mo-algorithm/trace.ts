// =============================================================================
// 莫队算法 · 录制帧序列
// 用 setArray 展示原数组 + 当前游标区间 [curL, curR]。
// 用 setAux 展示当前答案与查询顺序。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { moAlgorithm, type MoHooks, type MoQuery } from './impl.ts';

/** 演示输入：原数组 + 一批区间查询（区间不同元素个数）。 */
export const DEFAULT_INPUT = {
  arr: [1, 2, 1, 3, 2, 4, 1, 5],
  queries: [
    { l: 0, r: 4 }, // {1,2,3} = 3
    { l: 2, r: 5 }, // {1,3,2,4} = 4
    { l: 0, r: 7 }, // {1,2,3,4,5} = 5
    { l: 3, r: 4 }, // {3,2} = 2
  ],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { arr: readonly number[]; queries: readonly MoQuery[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const n = input.arr.length;
  if (n === 0 || input.queries.length === 0) {
    rec.begin({ zh: '空输入', en: 'Empty input' }).commit();
    return rec.build();
  }

  const arr = [...input.arr];
  let curL = 0;
  let curR = -1;
  let curAnswer = 0;
  let pendingQuery: { qi: number; l: number; r: number } | null = null;
  let sortOrder: number[] = [];

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = arr.map((_, i) => {
      if (i >= curL && i <= curR) return 'compare';
      return 'default';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (curR >= curL) {
      pointers.push({ index: curL, label: 'L' });
      pointers.push({ index: curR, label: 'R' });
    }
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '当前区间', value: curR >= curL ? `[${curL}, ${curR}]` : '∅', role: 'default' },
      { label: '不同元素数', value: String(curAnswer), role: 'final' },
    ];
    if (pendingQuery) {
      aux.push({
        label: `查询#${pendingQuery.qi}`,
        value: `[${pendingQuery.l}, ${pendingQuery.r}]`,
        role: 'pivot',
      });
    }
    if (sortOrder.length > 0) {
      aux.push({
        label: '查询顺序',
        value: sortOrder.map((i) => `#${i}`).join(' '),
        role: 'frontier',
      });
    }
    rec.begin(note).setArray(arr, roles, pointers).setAux(aux).commit();
  };

  render({
    zh: `初始数组 [${arr.join(', ')}]，准备离线查询`,
    en: `Initial [${arr.join(', ')}], offline queries ready`,
  });

  const hooks: MoHooks = {
    onSort: (order) => {
      sortOrder = [...order];
      render({
        zh: `按莫队排序（块号 l/√n，同块按 r）→ 顺序 ${order.map((i) => `#${i}`).join(' ')}`,
        en: `Sorted by Mo order (block l/√n, then r) → ${order.map((i) => `#${i}`).join(' ')}`,
      });
    },
    onMove: (l, r, _idx, op) => {
      curL = l;
      curR = r;
      // 答案变化在 onAnswer 才更新；这里展示平移过程
      // 用 aux 占位
      void op;
    },
    onAnswer: (qi, l, r, answer) => {
      pendingQuery = { qi, l, r };
      curAnswer = answer;
      render({
        zh: `回答查询#${qi} [${l}, ${r}] = ${answer}`,
        en: `Answer query#${qi} [${l}, ${r}] = ${answer}`,
      });
      pendingQuery = null;
    },
  };

  moAlgorithm(arr, input.queries, hooks);

  // 终态
  rec
    .begin({
      zh: '完成；所有查询已离线回答',
      en: 'Done; all queries answered offline',
    })
    .setArray(
      arr,
      arr.map(() => 'final' as BarRole),
      [],
    )
    .setAux([{ label: '查询数', value: String(input.queries.length), role: 'final' }])
    .commit();

  return rec.build();
}
