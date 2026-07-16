// =============================================================================
// R 树 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildRTree, rangeQuery, type RRect, type Rect, type RTreeHooks } from './impl.ts';

export const DEFAULT_INPUT: {
  items: RRect[];
  query: Rect;
} = {
  items: [
    { x0: 0, y0: 0, x1: 5, y1: 5, value: 1 },
    { x0: 10, y0: 10, x1: 15, y1: 15, value: 2 },
    { x0: 20, y0: 0, x1: 25, y1: 5, value: 3 },
    { x0: 0, y0: 20, x1: 5, y1: 25, value: 4 },
    { x0: 30, y0: 30, x1: 35, y1: 35, value: 5 },
    { x0: 12, y0: 1, x1: 18, y1: 4, value: 6 },
  ],
  query: { x0: 0, y0: 0, x1: 20, y1: 20 },
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { items, query } = input;

  rec
    .begin({
      zh: `R 树：插入 ${items.length} 个矩形，查询 [${query.x0},${query.y0}]-[${query.x1},${query.y1}]`,
      en: `R-tree: insert ${items.length} rects, query [${query.x0},${query.y0}]-[${query.x1},${query.y1}]`,
    })
    .commit();

  const hooks: RTreeHooks = {
    onBuild: (mbr, isLeaf, count) => {
      rec
        .begin({
          zh: `建${isLeaf ? '叶' : '内部'}节点 MBR=[${mbr.x0},${mbr.y0}]-[${mbr.x1},${mbr.y1}]（${count} 项）`,
          en: `Build ${isLeaf ? 'leaf' : 'internal'} MBR=[${mbr.x0},${mbr.y0}]-[${mbr.x1},${mbr.y1}] (${count} entries)`,
        })
        .setAux([
          { label: 'MBR', value: `[${mbr.x0},${mbr.y0}]-[${mbr.x1},${mbr.y1}]`, role: 'sorted' },
        ])
        .commit();
    },
    onVisit: (mbr) => {
      rec
        .begin({
          zh: `访问 MBR=[${mbr.x0},${mbr.y0}]-[${mbr.x1},${mbr.y1}]`,
          en: `Visit MBR=[${mbr.x0},${mbr.y0}]-[${mbr.x1},${mbr.y1}]`,
        })
        .setAux([{ label: '访问', value: `[${mbr.x0},${mbr.y0}]`, role: 'compare' }])
        .commit();
    },
    onPrune: (mbr) => {
      rec
        .begin({
          zh: `剪枝：MBR=[${mbr.x0},${mbr.y0}]-[${mbr.x1},${mbr.y1}] 不相交`,
          en: `Prune MBR=[${mbr.x0},${mbr.y0}]-[${mbr.x1},${mbr.y1}]`,
        })
        .setAux([{ label: '剪枝', value: '不相交', role: 'warn' }])
        .commit();
    },
    onCollect: (item) => {
      rec
        .begin({ zh: `命中矩形 value=${item.value}`, en: `Hit rect value=${item.value}` })
        .setAux([{ label: '命中', value: String(item.value), role: 'final' }])
        .commit();
    },
  };

  const tree = buildRTree(items, hooks);
  const result = rangeQuery(tree, query, hooks);
  rec
    .begin({ zh: `查询命中 ${result.length} 项`, en: `Query hit ${result.length} items` })
    .setAux([{ label: '命中数', value: String(result.length), role: 'final' }])
    .commit();

  return rec.build();
}
