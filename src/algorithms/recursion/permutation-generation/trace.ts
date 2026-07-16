// =============================================================================
// 排列生成 · 录制帧序列
// 可视化：setArray 渲染当前排列，pointers 标交换位（start / j）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { permutations, type PermutationHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  let cur = [...a];
  let count = 0;
  let swapI = -1;
  let swapJ = -1;

  const render = (note: { zh: string; en: string }, isEmit: boolean = false): void => {
    const roles: BarRole[] = cur.map(() => 'default' as BarRole);
    const pointers: Array<{ index: number; label: string }> = [];
    if (isEmit) {
      cur.forEach((_, i) => (roles[i] = 'final'));
    } else {
      if (swapI >= 0) {
        roles[swapI] = 'pivot';
        pointers.push({ index: swapI, label: 'start' });
      }
      if (swapJ >= 0 && swapJ !== swapI) {
        roles[swapJ] = 'swap';
        pointers.push({ index: swapJ, label: 'j' });
      }
      // 已固定的前缀
      if (swapI >= 0) for (let k = 0; k < swapI; k++) roles[k] = 'frontier';
    }
    rec
      .begin(note)
      .setArray(cur, roles, pointers)
      .setAux([
        { label: '当前排列', value: `[${cur.join(', ')}]`, role: isEmit ? 'final' : 'pivot' },
        { label: '已生成', value: `${count} 个`, role: 'frontier' },
      ])
      .commit();
  };

  render({
    zh: `生成 [${input.join(', ')}] 的全排列（共 ${input.length}! = ${fact(input.length)} 个）`,
    en: `Generate all permutations of [${input.join(', ')}] (${input.length}! = ${fact(input.length)} total)`,
  });

  const hooks: PermutationHooks = {
    onSwap: (i, j, arr) => {
      swapI = i;
      swapJ = j;
      cur = [...arr];
      render({
        zh: `固定位置 ${i}：交换 a[${i}] 与 a[${j}]`,
        en: `Fix position ${i}: swap a[${i}] and a[${j}]`,
      });
      // 执行实际交换以反映到 cur
      const t = cur[i]!;
      cur[i] = cur[j]!;
      cur[j] = t;
    },
    onRecurse: (start, arr) => {
      cur = [...arr];
      swapI = start;
      swapJ = -1;
      if (start < cur.length) {
        render({
          zh: `递归处理位置 ${start}..${cur.length - 1}`,
          en: `Recurse on positions ${start}..${cur.length - 1}`,
        });
      }
    },
    onEmit: (perm, idx) => {
      cur = [...perm];
      count = idx + 1;
      swapI = -1;
      swapJ = -1;
      render(
        {
          zh: `生成第 ${idx + 1} 个排列：[${perm.join(', ')}]`,
          en: `Permutation #${idx + 1}: [${perm.join(', ')}]`,
        },
        true,
      );
    },
  };

  const all = permutations(input, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：共生成 ${all.length} 个排列`,
      en: `Done: ${all.length} permutations generated`,
    })
    .setArray(
      cur,
      cur.map(() => 'final' as BarRole),
      [],
    )
    .setAux([
      { label: '总数', value: `${all.length} = ${input.length}!`, role: 'final' },
      { label: '全部', value: all.map((p) => `[${p.join(',')}]`).join(' '), role: 'final' },
    ])
    .commit();

  return rec.build();
}

function fact(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
