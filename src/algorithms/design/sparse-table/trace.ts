// =============================================================================
// 稀疏表 · 录制帧序列
// 用 setGrid 展示 st 表（行=层 k，列=下标 i）；
// 查询阶段用 setBars 高亮查询区间与参与比较的两个子区间。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SparseTable, type SparseTableHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 4, 7, 1, 8, 3, 6, 9, 0];
/** 默认查询：[2, 7] 的最小值。 */
export const DEFAULT_QUERY: [number, number] = [2, 7];

interface TraceOptions {
  arr: number[];
  query: [number, number];
}

/** 录制演示帧序列。 */
export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const arr = opts.arr ?? DEFAULT_INPUT;
  const query = opts.query ?? DEFAULT_QUERY;
  const rec = new TraceRecorder();

  // 初始：原数组
  rec
    .begin({
      zh: `初始数组：[${arr.join(', ')}]`,
      en: `Initial array: [${arr.join(', ')}]`,
    })
    .setBars(rec.barsFrom(arr))
    .commit();

  // 构建阶段：逐层填充 st 表，用 grid 展示
  const levels: number[][] = [];
  let highlightLevel = -1;
  let highlightCol = -1;

  const gridSnapshot = (note: { zh: string; en: string }): void => {
    // grid：行=层 k（含 0），列=下标 i；空位（越界）显示 '-'
    const rows: Array<Array<string | number | undefined>> = levels.map((lv) => {
      const row: Array<string | number | undefined> = [];
      for (let i = 0; i < arr.length; i++) {
        row.push(i < lv.length ? lv[i] : undefined);
      }
      return row;
    });
    const roles: Record<string, BarRole> = {};
    if (highlightLevel >= 0 && highlightCol >= 0) {
      roles[`${highlightLevel},${highlightCol}`] = 'swap';
    }
    const grid: Cell[][] = rows.map((row, r) =>
      row.map((v, c) => ({ v, role: roles[`${r},${c}`] ?? 'default' })),
    );
    rec.begin(note).setGrid(grid).commit();
    highlightLevel = -1;
    highlightCol = -1;
  };

  const buildHooks: SparseTableHooks = {
    onBuild: (k, lv) => {
      levels[k] = [...lv];
      highlightLevel = k;
      // 高亮该层第一个有效单元
      highlightCol = lv.length > 0 ? 0 : -1;
      gridSnapshot({
        zh: `构建第 ${k} 层：st[${k}][i] = 长度 2^${k} 区间的最小值`,
        en: `Build level ${k}: st[${k}][i] = min over length-2^${k} range`,
      });
    },
  };

  const st = new SparseTable(arr, buildHooks);

  // 查询阶段
  const [l, r] = query;
  const len = r - l + 1;
  const k = st.log[len]!;
  const leftStart = l;
  const rightStart = r - (1 << k) + 1;

  // 高亮参与查询的两个子区间
  rec
    .begin({
      zh: `查询 [${l}, ${r}]：k=⌊log2(${len})⌋=${k}，取 min(st[${k}][${leftStart}], st[${k}][${rightStart}])`,
      en: `Query [${l}, ${r}]: k=⌊log2(${len})⌋=${k}, min(st[${k}][${leftStart}], st[${k}][${rightStart}])`,
    })
    .setBars(
      arr.map((v, i) => ({
        value: v,
        role:
          (i >= leftStart && i < leftStart + (1 << k)) ||
          (i >= rightStart && i < rightStart + (1 << k))
            ? ('compare' as BarRole)
            : i >= l && i <= r
              ? ('frontier' as BarRole)
              : ('default' as BarRole),
      })),
    )
    .setAux([
      { label: '区间长度', value: String(len), role: 'default' as BarRole },
      { label: 'k', value: String(k), role: 'pivot' as BarRole },
      {
        label: `st[${k}][${leftStart}]`,
        value: String(st.st[k]![leftStart]!),
        role: 'compare' as BarRole,
      },
      {
        label: `st[${k}][${rightStart}]`,
        value: String(st.st[k]![rightStart]!),
        role: 'compare' as BarRole,
      },
    ])
    .commit();

  // 终态
  const result = st.query(l, r);
  rec
    .begin({
      zh: `min(a[${l}..${r}]) = ${result}`,
      en: `min(a[${l}..${r}]) = ${result}`,
    })
    .setBars(
      arr.map((v, i) => ({
        value: v,
        role: i >= l && i <= r ? ('final' as BarRole) : ('default' as BarRole),
        label: v === result && i >= l && i <= r ? 'min' : undefined,
      })),
    )
    .setAux([
      { label: '区间最小值', value: String(result), role: 'final' as BarRole },
      { label: '层数 K', value: String(st.st.length), role: 'default' as BarRole },
    ])
    .commit();

  return rec.build();
}
