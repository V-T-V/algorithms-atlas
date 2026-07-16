// =============================================================================
// 排列排序 · 录制帧序列
// 通过 permutationSort 的钩子，把穷举过程录成 Frame[]。
// 为避免帧数爆炸，默认输入很小（4 个元素，最多 24 个排列）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { permutationSort, type PermutationSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 4, 2];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;

  rec
    .begin({
      zh: `输入：[${input.join(', ')}]，字典序枚举 ${Array.from({ length: n }, (_, i) => i + 1).reduce((p, c) => p * c, 1)} 个排列`,
      en: `Input: [${input.join(', ')}]; enumerate permutations in lexicographic order`,
    })
    .setBars(rec.barsFrom(input))
    .commit();

  let tried = 0;
  const hooks: PermutationSortHooks = {
    onAttempt: (attempt, t) => {
      tried = t;
      rec
        .begin({
          zh: `尝试第 ${t} 个排列：[${attempt.join(', ')}]`,
          en: `Attempt #${t}: [${attempt.join(', ')}]`,
        })
        .setBars(attempt.map((v) => ({ value: v, role: 'compare' as BarRole })))
        .commit();
    },
    onCheck: (sorted) => {
      rec
        .begin({
          zh: sorted ? '该排列已有序 ✓' : '未有序，继续',
          en: sorted ? 'This permutation is sorted ✓' : 'Not sorted, continue',
        })
        .setAux([
          { label: '是否有序', value: sorted ? '是' : '否', role: sorted ? 'final' : 'warn' },
        ])
        .commit();
    },
    onAdvance: () => {
      // 生成下一个排列，无需单独帧
    },
  };

  const result = permutationSort(input, hooks);

  rec
    .begin({ zh: `完成：第 ${tried} 个排列即为升序`, en: `Done: attempt #${tried} is sorted` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
