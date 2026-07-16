// =============================================================================
// 随机化跳表 · 录制帧序列
// 用 setAux 展示每层链表内容，用 onCompare/onInsert 触发帧。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SkipList, makeRng, type SkipNode } from './impl.ts';

export const DEFAULT_INPUT = {
  // 依次插入的键
  keys: [3, 1, 7, 5, 9, 2, 8],
  seed: 42,
  // 演示搜索的键
  search: 5,
};

interface BuildTraceInput {
  keys?: number[];
  seed?: number;
  search?: number;
}

/** 把跳表按层渲染为 aux 条目。 */
function renderLevels(sl: SkipList): Array<{ label: string; value: string; role?: BarRole }> {
  const entries: Array<{ label: string; value: string; role?: BarRole }> = [];
  for (let lv = sl.heads.length - 1; lv >= 0; lv--) {
    const row: number[] = [];
    let cur: SkipNode | undefined = sl.heads[lv]!.right;
    while (cur) {
      row.push(cur.key);
      cur = cur.right;
    }
    entries.push({
      label: `L${lv}`,
      value: row.length > 0 ? row.join(' → ') : '(空)',
      role: (lv === 0 ? 'final' : 'compare') as BarRole,
    });
  }
  return entries;
}

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const keys = input.keys ?? DEFAULT_INPUT.keys;
  const seed = input.seed ?? DEFAULT_INPUT.seed;
  const searchKey = input.search ?? DEFAULT_INPUT.search;

  const rec = new TraceRecorder();
  const sl = new SkipList(makeRng(seed), { p: 0.5, maxLevel: 16 });

  rec
    .begin({
      zh: `随机化跳表：依次插入 [${keys.join(',')}]，p=1/2`,
      en: `Randomized skip list: insert [${keys.join(',')}], p=1/2`,
    })
    .setAux([
      { label: '操作', value: '初始化空表', role: 'pivot' as BarRole },
      { label: 'p', value: '1/2', role: 'frontier' as BarRole },
      { label: '期望高度', value: 'O(log n)', role: 'default' as BarRole },
    ])
    .commit();

  for (const k of keys) {
    sl.insert(k, k * 10);
    rec
      .begin({
        zh: `插入 ${k}（当前高度 ${sl.heads.length} 层）`,
        en: `Insert ${k} (height = ${sl.heads.length} levels)`,
      })
      .setAux([{ label: '操作', value: `插入 ${k}`, role: 'swap' as BarRole }, ...renderLevels(sl)])
      .commit();
  }

  // 演示一次搜索
  const found = sl.search(searchKey);
  rec
    .begin({
      zh: `搜索 ${searchKey} → ${found ? `找到（值=${found.value}）` : '未找到'}`,
      en: `Search ${searchKey} → ${found ? `found (value=${found.value})` : 'not found'}`,
    })
    .setAux([
      { label: '操作', value: `搜索 ${searchKey}`, role: 'pivot' as BarRole },
      {
        label: '结果',
        value: found ? `找到` : '未找到',
        role: (found ? 'final' : 'warn') as BarRole,
      },
      ...renderLevels(sl),
    ])
    .commit();

  // 终态：展示有序遍历
  rec
    .begin({
      zh: `完成：跳表 ${sl.size} 个元素，${sl.heads.length} 层`,
      en: `Done: skip list has ${sl.size} elements, ${sl.heads.length} levels`,
    })
    .setAux([
      { label: '元素数', value: String(sl.size), role: 'final' as BarRole },
      { label: '层数', value: String(sl.heads.length), role: 'pivot' as BarRole },
      {
        label: '有序键',
        value: sl
          .toArray()
          .map((e) => e.key)
          .join(', '),
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
