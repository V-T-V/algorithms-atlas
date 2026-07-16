// =============================================================================
// 全排列 · 录制帧序列
// 通过 permutations 的钩子把回溯过程录成 Frame[]。
// 可视化：setArray 渲染当前排列，pointers 标出交换位 first/i；
// 每个完整排列额外 commit 一帧（标 final）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { factorial, permutations, type PermutationsHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  // 当前排列镜像（与 impl 内部 a 同步）
  const a = [...input];
  const n = a.length;
  let fixed = 0; // 已固定的前缀长度（[0, fixed) 已确定）

  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  const render = (
    note: { zh: string; en: string },
    first: number | null,
    i: number | null,
    final: boolean,
    perm: number[] | null,
  ): void => {
    const values = perm ?? a;
    const roles: BarRole[] = values.map((_, idx) => {
      if (final) return 'final';
      if (idx < fixed) return 'sorted';
      if (first !== null && idx === first) return 'swap';
      if (i !== null && idx === i) return 'compare';
      return 'default';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (!final) {
      if (first !== null) pointers.push({ index: first, label: 'first' });
      if (i !== null && i !== first) pointers.push({ index: i, label: 'i' });
    }
    rec
      .begin(note)
      .setArray([...values], roles, pointers)
      .commit();
  };

  rec
    .begin({ zh: `开始生成 ${input.join(', ')} 的全排列`, en: `Permute [${input.join(', ')}]` })
    .setArray(
      [...a],
      a.map(() => 'default' as BarRole),
      [],
    )
    .commit();

  const hooks: PermutationsHooks = {
    onSwap: (first, i) => {
      swap(first, i);
      fixed = first + 1;
      render(
        {
          zh: `固定第 ${first} 位：交换 a[${first}] ↔ a[${i}]`,
          en: `Fix position ${first}: swap a[${first}] ↔ a[${i}]`,
        },
        first,
        i,
        false,
        null,
      );
    },
    onUnswap: (first, i) => {
      swap(first, i);
      fixed = first;
      render(
        {
          zh: `撤销交换 a[${first}] ↔ a[${i}]，回溯`,
          en: `Undo swap a[${first}] ↔ a[${i}], backtrack`,
        },
        first,
        i,
        false,
        null,
      );
    },
    onPermutation: (perm) => {
      render(
        {
          zh: `找到一个排列：[${perm.join(', ')}]`,
          en: `Permutation found: [${perm.join(', ')}]`,
        },
        null,
        null,
        true,
        perm,
      );
    },
  };

  permutations(input, hooks);

  // 终态
  const first = permutations(input)[0]!;
  rec
    .begin({ zh: `完成：共 ${factorial(n)} 个全排列`, en: `Done: ${factorial(n)} permutations` })
    .setArray(
      first,
      first.map(() => 'final' as BarRole),
      [],
    )
    .commit();

  return rec.build();
}
