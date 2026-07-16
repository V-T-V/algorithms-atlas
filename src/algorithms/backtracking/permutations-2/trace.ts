// =============================================================================
// 全排列 II · 录制帧序列
// 可视化：setArray 渲染当前排列（未填位置用 -1 占位）；setAux 标 used 标记。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { permutations2, type Permutations2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 1, 2];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sorted = [...input].sort((a, b) => a - b);
  const n = sorted.length;
  const perm: number[] = [];
  const used: boolean[] = new Array<boolean>(n).fill(false);
  let count = 0;

  const render = (
    note: { zh: string; en: string },
    final: boolean,
    prunedIdx: number | null,
  ): void => {
    // 用 -1 占位未填位置
    const values = sorted.map((_, idx) => (used[idx] ? (perm[idx] ?? 0) : 0));
    // 实际展示 perm 内容（已选）
    const display = perm.length ? perm : [0];
    const roles: BarRole[] = display.map(() => (final ? 'final' : 'pivot'));
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '当前排列', value: perm.length ? `[${perm.join(', ')}]` : '∅', role: 'pivot' },
      { label: '排序后数组', value: `[${sorted.join(', ')}]`, role: 'default' },
      {
        label: 'used',
        value: used.map((u, i) => (u ? `${sorted[i]}` : '_')).join(' '),
        role: 'default',
      },
      { label: '已收集', value: String(count), role: 'default' },
    ];
    if (prunedIdx !== null) {
      aux.push({
        label: `剪枝 a[${prunedIdx}]=${sorted[prunedIdx]}`,
        value: '同层重复且前一个未用',
        role: 'warn',
      });
    }
    void values;
    rec.begin(note).setArray(display, roles, []).setAux(aux).commit();
  };

  rec
    .begin({
      zh: `排序后 [${sorted.join(', ')}]，生成不重复全排列`,
      en: `Sorted [${sorted.join(', ')}], generate distinct permutations`,
    })
    .setArray([0], ['default'], [])
    .setAux([
      { label: '当前排列', value: '∅', role: 'default' },
      { label: '排序后数组', value: `[${sorted.join(', ')}]`, role: 'default' },
    ])
    .commit();

  const hooks: Permutations2Hooks = {
    onPick: (_i, _v, p) => {
      perm.length = 0;
      perm.push(...p);
      render({ zh: `选取元素填入`, en: `Pick element` }, false, null);
    },
    onPrune: (i, _v) => {
      render(
        {
          zh: `同层重复 a[${i}]=${sorted[i]}，剪枝`,
          en: `Same-level duplicate a[${i}]=${sorted[i]}, prune`,
        },
        false,
        i,
      );
    },
    onBacktrack: (_i, _v, p) => {
      perm.length = 0;
      perm.push(...p);
      render({ zh: `回溯`, en: `Backtrack` }, false, null);
    },
    onPermutation: (p) => {
      count++;
      perm.length = 0;
      perm.push(...p);
      render(
        {
          zh: `排列 #${count}：[${p.join(', ')}]`,
          en: `Permutation #${count}: [${p.join(', ')}]`,
        },
        true,
        null,
      );
    },
  };

  const result = permutations2(input, hooks);

  rec
    .begin({
      zh: `完成：共 ${result.length} 个不重复排列`,
      en: `Done: ${result.length} distinct permutations`,
    })
    .setArray(
      sorted,
      sorted.map(() => 'final' as BarRole),
      [],
    )
    .setAux([{ label: '不重复排列总数', value: String(result.length), role: 'final' }])
    .commit();

  return rec.build();
}
