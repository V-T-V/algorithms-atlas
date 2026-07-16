// =============================================================================
// Mo 算法 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { moDistinctCount, type MoHooks } from './impl.ts';

export const DEFAULT_INPUT: { arr: number[]; queries: Array<{ l: number; r: number }> } = {
  arr: [1, 2, 1, 3, 2, 4, 1, 5],
  queries: [
    { l: 0, r: 4 },
    { l: 2, r: 6 },
    { l: 0, r: 7 },
  ],
};

export function buildTrace(
  input: { arr: number[]; queries: Array<{ l: number; r: number }> } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { arr, queries } = input;

  rec
    .begin({
      zh: `Mo 算法：[${arr.join(',')}] 上 ${queries.length} 个区间查询不同元素数`,
      en: `Mo: ${queries.length} distinct-count queries on [${arr.join(',')}]`,
    })
    .setArray(arr, new Array(arr.length).fill('default'), [])
    .commit();

  const hooks: MoHooks = {
    onMoveL: (L) => {
      const roles: BarRole[] = new Array(arr.length).fill('default');
      roles[L] = 'pivot';
      rec
        .begin({ zh: `L 指针 → ${L}`, en: `L pointer → ${L}` })
        .setArray(arr, roles, [])
        .commit();
    },
    onMoveR: (R) => {
      const roles: BarRole[] = new Array(arr.length).fill('default');
      roles[R] = 'frontier';
      rec
        .begin({ zh: `R 指针 → ${R}`, en: `R pointer → ${R}` })
        .setArray(arr, roles, [])
        .commit();
    },
    onAnswer: (qi, l, r, ans) => {
      const roles: BarRole[] = new Array(arr.length).fill('default');
      for (let i = l; i <= r; i++) roles[i] = 'final';
      rec
        .begin({
          zh: `查询 ${qi}: [${l},${r}] 不同元素 = ${ans}`,
          en: `Query ${qi}: [${l},${r}] distinct = ${ans}`,
        })
        .setArray(arr, roles, [])
        .setAux([{ label: '答案', value: String(ans), role: 'final' }])
        .commit();
    },
  };

  const answers = moDistinctCount(arr, queries, hooks);
  rec
    .begin({ zh: `结果 = [${answers.join(',')}]`, en: `Result = [${answers.join(',')}]` })
    .setAux([{ label: '结果', value: `[${answers.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
