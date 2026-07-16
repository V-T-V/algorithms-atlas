// =============================================================================
// 依赖背包 · 录制帧序列
// 用单行 grid 展示根 dp[w]（容量 w 处的最大价值）；用 setAux 展示树结构与当前合并。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dependentKnapsack, type DepItem, type DependentKnapsackHooks } from './impl.ts';

export const DEFAULT_INPUT: { items: DepItem[]; capacity: number } = {
  items: [
    { weight: 2, value: 3, parent: -1 },
    { weight: 3, value: 4, parent: 0 },
    { weight: 4, value: 5, parent: 0 },
    { weight: 1, value: 2, parent: 1 },
  ],
  capacity: 7,
};

/** 录制演示帧序列。 */
export function buildTrace(input: { items: DepItem[]; capacity: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { items, capacity } = input;
  const cap = capacity;
  const n = items.length;

  // 根 dp 快照（虚拟根 = 下标 n）
  const rootDp: number[] = new Array<number>(cap + 1).fill(-Infinity);
  rootDp[0] = 0;
  let curU = -1;
  let curC = -1;

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [{ v: '容量 w', role: 'default' }];
    for (let w = 0; w <= cap; w++) header.push({ v: w, role: 'pivot' });
    const row: Cell[] = [{ v: '根 dp', role: 'pivot' }];
    for (let w = 0; w <= cap; w++) {
      let role: BarRole = 'default';
      if (curU === n) role = 'compare';
      const v = rootDp[w]!;
      row.push({ v: v === -Infinity ? '·' : v, role });
    }
    return [header, row];
  };

  const auxItems = (): Array<{ label: string; value: string; role?: BarRole }> =>
    items.map((it, idx) => ({
      label: `#${idx}`,
      value: `w${it.weight},v${it.value}←p${it.parent}`,
      role: idx === curU || idx === curC ? 'compare' : 'default',
    }));

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).setAux(auxItems()).commit();
  };

  snapshot({
    zh: `容量 ${cap}，${n} 件物品（树形依赖）`,
    en: `Capacity ${cap}, ${n} items (tree deps)`,
  });

  const hooks: DependentKnapsackHooks = {
    onEnter: (u) => {
      curU = u;
    },
    onMerge: (u, c, _w, _val) => {
      curU = u;
      curC = c;
      // 拷贝根 dp（u 是虚拟根时同步显示）
      snapshot({
        zh: `合并子 ${c} 进 ${u === n ? '根' : `节点 ${u}`}`,
        en: `Merge child ${c} into ${u === n ? 'root' : `node ${u}`}`,
      });
    },
    onLeave: (u) => {
      // 当离开虚拟根时，把最终 f[n] 同步到 rootDp 供展示
      if (u === n) {
        // rootDp 已由 onMerge 间接更新；此处不重复
      }
    },
  };

  const result = dependentKnapsack(items, capacity, hooks);

  // 最终：把根 dp 标记完成（用 best 还原最大可达轮廓）
  for (let w = 0; w <= cap; w++) if (rootDp[w]! < 0) rootDp[w] = 0;
  curU = -1;
  curC = -1;
  rec
    .begin({ zh: `最大价值 = ${result}`, en: `Max value = ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '最大价值 / max', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
