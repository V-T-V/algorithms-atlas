// =============================================================================
// 跳表 · 录制帧序列
// 用 setGrid 展示各层链表（每行一层，左到右升序），role: 当前插入='compare'，
// 当前比较路径='frontier'，完成='final'。aux 显示层数与节点数。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SkipList, type SkipListHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7];

/** 把跳表各层转成网格行（仅层 0..level，跳过头哨兵）。 */
function slToGrid(
  sl: SkipList,
  opts: { hotValue?: number | null; hotSet?: Set<number> } = {},
): Cell[][] {
  // head 的 forward 数组读不到（私有 level），用 toArray + 层结构。
  // 改为：通过遍历各层 forward。但 level 私有；这里用「层 0 全集 + 高层子集」
  // 取自 SkipList 内部结构。为简化，借助反射式访问：head.forward 可读。
  const headForward = sl.head.forward as (typeof sl.head | null)[];
  const grid: Cell[][] = [];
  let maxLevel = headForward.length - 1;
  // 跳过顶层全空的层
  while (maxLevel > 0 && headForward[maxLevel] === null) maxLevel--;

  for (let l = maxLevel; l >= 0; l--) {
    const row: Cell[] = [];
    let cur = headForward[l];
    let guard = 0;
    while (cur && guard < 1000) {
      const v = cur.value;
      let role: BarRole = 'default';
      if (opts.hotValue !== null && opts.hotValue !== undefined && v === opts.hotValue) {
        role = 'compare';
      } else if (opts.hotSet?.has(v)) {
        role = 'frontier';
      }
      row.push({ v: String(v), role });
      cur = cur.forward[l] ?? null;
      guard++;
    }
    if (row.length === 0) row.push({ v: '∅', role: 'default' });
    grid.push([{ v: `L${l}`, role: 'sorted' }, ...row]);
  }
  return grid;
}

/** 录制演示帧序列。 */
export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sl = new SkipList({ seed: 1 });

  let hotValue: number | null = null;
  let hotSet = new Set<number>();
  let levelsInserted = 0;

  const render = (note: { zh: string; en: string }): void => {
    const grid = slToGrid(sl, { hotValue, hotSet });
    rec
      .begin(note)
      .setGrid(grid)
      .setAux([
        { label: '节点数', value: String(sl.size), role: 'final' },
        {
          label: '本次层数',
          value: levelsInserted > 0 ? String(levelsInserted) : '-',
          role: 'pivot',
        },
      ])
      .commit();
  };

  render({ zh: '空跳表，开始插入', en: 'Empty skip list, start inserting' });

  const hooks: SkipListHooks = {
    onCompare: (_level, _nodeValue, _target) => {
      // 标记路径节点：此处仅记录 target 作为热度辅助
    },
    onInsert: (value, levels) => {
      hotValue = value;
      hotSet = new Set<number>();
      levelsInserted = levels;
      render({
        zh: `插入 ${value}（出现在 ${levels} 层，自底向上指数衰减）`,
        en: `Insert ${value} (appears on ${levels} levels, exponential bottom-up)`,
      });
      hotValue = null;
      levelsInserted = 0;
    },
  };

  for (const v of input) {
    sl.insert(v, hooks);
  }

  // 查找演示：一个存在、一个不存在
  const searchHooks: SkipListHooks = {
    onFound: (value, found) => {
      hotValue = value;
      hotSet = found ? new Set<number>([value]) : new Set<number>();
      render(
        found
          ? { zh: `查找 ${value}：命中 ✓`, en: `Search ${value}: hit ✓` }
          : { zh: `查找 ${value}：未命中 ✗`, en: `Search ${value}: miss ✗` },
      );
      hotValue = null;
      hotSet = new Set<number>();
    },
  };
  const probeExist = input[Math.floor(input.length / 2)] ?? input[0]!;
  const probeMissing = 9999;
  sl.search(probeExist, searchHooks);
  sl.search(probeMissing, searchHooks);

  // 终态：所有节点标 final
  hotValue = null;
  hotSet = new Set<number>();
  const finalGrid = slToGrid(sl).map((row) =>
    row.map((c) => ({ v: c.v, role: (c.role === 'sorted' ? 'sorted' : 'final') as BarRole })),
  );
  rec
    .begin({
      zh: `完成，跳表共 ${sl.size} 个节点，升序：[${sl.toArray().join(', ')}]`,
      en: `Done, ${sl.size} nodes, ascending: [${sl.toArray().join(', ')}]`,
    })
    .setGrid(finalGrid)
    .commit();

  return rec.build();
}
