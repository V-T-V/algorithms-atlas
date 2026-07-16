// =============================================================================
// Sparse Table · 录制帧序列
// 用 setGrid 展示 st 表（行 k=幂次，列 i=起点），填充中的格标 'compare'，
// 查询时高亮两段覆盖格标 'frontier'，结果下标标 'pivot'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SparseTable, type SparseTableHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  values: [5, 2, 8, 1, 9, 3, 7, 4, 6],
  queries: [[0, 8] as [number, number], [2, 6] as [number, number], [4, 4] as [number, number]],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    values: readonly number[];
    queries?: Array<[number, number]>;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const n = input.values.length;

  const st = new SparseTable(input.values);
  const maxK = st.maxK;

  /** 渲染 st 表网格。hot 控制：filling=正在填的格，covers=查询覆盖的格。 */
  const renderGrid = (
    note: { zh: string; en: string },
    hot: {
      filling?: { k: number; i: number };
      covers?: Set<string>; // "k,i"
      resultIdx?: number;
    } = {},
  ): void => {
    // 第一行放原数组；其后每行 k=0..maxK-1 放 st[k]
    const rows: Array<Array<string | number | undefined>> = [];
    const roleMap: Record<string, BarRole> = {};
    // 原数组行
    const arrRow: Array<string | number> = input.values.map((v) => v);
    rows.push(['a', ...arrRow]);
    for (let i = 0; i < n; i++) roleMap[`0,${i + 1}`] = 'default';
    // st[k] 行
    for (let k = 0; k < maxK; k++) {
      const row: Array<string | number | undefined> = [`k=${k}`];
      for (let i = 0; i < n; i++) {
        const idx = st.st[k]![i];
        row.push(idx === undefined || i + (1 << k) - 1 >= n ? undefined : st.arr[idx]!);
      }
      rows.push(row);
    }
    // 标记填充中的格
    if (hot.filling) {
      roleMap[`${hot.filling.k + 1},${hot.filling.i + 1}`] = 'compare';
    }
    // 标记查询覆盖
    if (hot.covers) {
      for (const key of hot.covers) {
        const [kr, ic] = key.split(',').map(Number);
        roleMap[`${kr},${ic}`] = 'frontier';
      }
    }
    // 结果下标在原数组行高亮
    if (hot.resultIdx !== undefined && hot.resultIdx >= 0) {
      roleMap[`0,${hot.resultIdx + 1}`] = 'pivot';
    }
    rec.begin(note).setGrid(rec.gridFrom(rows, roleMap)).commit();
  };

  renderGrid({ zh: `原数组 ${n} 项，预处理 st 表`, en: `Array of ${n}, preprocess st table` });

  // 重新建表以触发 onFill 钩子
  const covers = new Set<string>();
  const buildHooks: SparseTableHooks = {
    onFill: (k, i, value) => {
      renderGrid(
        { zh: `填 st[${k}][${i}] = ${value}`, en: `Fill st[${k}][${i}] = ${value}` },
        { filling: { k, i } },
      );
    },
  };
  void new SparseTable(input.values, buildHooks);

  // 查询阶段
  const queryHooks: SparseTableHooks = {
    onQueryCompare: (l, r, k, lv, rv) => {
      covers.clear();
      covers.add(`${k + 1},${l + 1}`);
      covers.add(`${k + 1},${r - (1 << k) + 1 + 1}`);
      void lv;
      void rv;
    },
    onResult: () => {},
  };

  for (const [l, r] of input.queries ?? []) {
    covers.clear();
    renderGrid({ zh: `查询区间 [${l}, ${r}] 的最小值`, en: `Query min of [${l}, ${r}]` });
    const idx = st.queryIndex(l, r, queryHooks);
    const value = st.arr[idx]!;
    renderGrid(
      {
        zh: `min[${l}, ${r}] = ${value}（下标 ${idx}）`,
        en: `min[${l}, ${r}] = ${value} (index ${idx})`,
      },
      { covers: new Set(covers), resultIdx: idx },
    );
  }

  // 终态
  rec
    .begin({
      zh: `完成；log 表最大幂 ${maxK - 1}，共 ${input.queries?.length ?? 0} 次查询`,
      en: `Done; max log power ${maxK - 1}, ${input.queries?.length ?? 0} queries`,
    })
    .setGrid(
      rec.gridFrom([
        ['a', ...input.values.map((v) => v as number)],
        ...Array.from({ length: maxK }, (_, k) => [
          `k=${k}`,
          ...Array.from({ length: n }, (_, i) =>
            i + (1 << k) - 1 < n ? st.arr[st.st[k]![i]!]! : undefined,
          ),
        ]),
      ]),
    )
    .commit();

  return rec.build();
}
