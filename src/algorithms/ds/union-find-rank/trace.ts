// =============================================================================
// 按秩并查集 · 录制帧序列
// 用 setMap 展示「元素→根」字典（标注 rank），用 setAux 展示分量数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { UnionFindRank, unionFindRank, type UFRankHooks, type UFRankOps } from './impl.ts';

/** 演示：8 个元素，执行一系列合并，展示 rank 增长。 */
export const DEFAULT_INPUT: UFRankOps = {
  size: 8, // 元素 0..7
  unions: [
    [0, 1],
    [2, 3],
    [4, 5],
    [0, 2], // 等高合并 → rank+1
    [6, 7],
    [4, 6],
    [0, 4], // 大合并
    [1, 5], // 已同根
  ],
};

/** 录制演示帧序列。 */
export function buildTrace(input: UFRankOps = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const uf = new UnionFindRank(input.size);

  let highlight: { a: number; b: number; merged: boolean } | null = null;
  let newRootRank: number | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const roots = uf.roots();
    const entries = roots.map((root, i) => {
      let role: BarRole = 'default';
      if (highlight && (highlight.a === i || highlight.b === i)) role = 'compare';
      if (i === root) role = 'final'; // 根节点高亮
      const rankStr = i === root ? `(r${uf.rankOf(root)})` : '';
      return {
        key: String(i),
        value: `${root}${rankStr}`,
        role,
      };
    });
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '连通分量', value: String(uf.components()), role: 'default' },
    ];
    if (highlight && newRootRank !== null) {
      aux.push({
        label: '新根秩',
        value: String(newRootRank),
        role: highlight.merged ? 'final' : 'warn',
      });
    }
    rec.begin(note).setMap(entries).setAux(aux).commit();
  };

  render({
    zh: `初始：${input.size} 个独立元素（每个自为根，rank=0）`,
    en: `Init: ${input.size} singleton roots (rank=0)`,
  });

  const hooks: UFRankHooks = {
    onUnion: (a, b, ra, rb, newRoot, newRank, merged) => {
      highlight = { a, b, merged };
      newRootRank = newRank;
      render({
        zh: merged
          ? `union(${a},${b})：根 ${ra}(r${uf.rankOf(ra)}) ⋃ ${rb}(r${uf.rankOf(rb)}) → 新根 ${newRoot}(r${newRank})`
          : `union(${a},${b})：已同根 ${ra}，跳过`,
        en: merged
          ? `union(${a},${b}): root ${ra}(r${uf.rankOf(ra)}) ⋃ ${rb}(r${uf.rankOf(rb)}) → new root ${newRoot}(r${newRank})`
          : `union(${a},${b}): already share root ${ra}, skip`,
      });
      highlight = null;
      newRootRank = null;
    },
  };

  unionFindRank(input, hooks);

  // 终态
  const roots = uf.roots();
  rec
    .begin({
      zh: `完成；共 ${uf.components()} 个连通分量`,
      en: `Done; ${uf.components()} component(s)`,
    })
    .setMap(
      roots.map((root, i) => ({
        key: String(i),
        value: `${root}${i === root ? `(r${uf.rankOf(root)})` : ''}`,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
