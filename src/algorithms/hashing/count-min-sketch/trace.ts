// =============================================================================
// Count-Min Sketch · 录制帧序列
// 用 setGrid 展示 d×w 计数矩阵；更新时高亮当前列，查询时取最小行。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { CountMinSketch, hashWithSeed, type CmsHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // 流：几个高频词 + 噪声
  stream: [
    'apple',
    'apple',
    'apple',
    'banana',
    'banana',
    'cherry',
    'apple',
    'date',
    'banana',
    'apple',
  ],
  query: ['apple', 'banana', 'cherry', 'date', 'fig'],
  d: 4,
  w: 8,
};

interface BuildTraceInput {
  stream?: string[];
  query?: string[];
  d?: number;
  w?: number;
}

/** 录制演示帧序列。 */
export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const stream = input.stream ?? DEFAULT_INPUT.stream;
  const query = input.query ?? DEFAULT_INPUT.query;
  const d = input.d ?? DEFAULT_INPUT.d;
  const w = input.w ?? DEFAULT_INPUT.w;

  const rec = new TraceRecorder();
  const cms = new CountMinSketch(d, w);
  let highlightCols: Set<number> = new Set();
  let queryMinRows: Set<number> = new Set();

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [{ v: 'row\\col', role: 'default' }];
    for (let c = 0; c < w; c++) header.push({ v: c, role: 'pivot' });
    const rows: Cell[][] = [header];
    for (let i = 0; i < d; i++) {
      const isMinRow = queryMinRows.has(i);
      const rowRole: BarRole = isMinRow ? 'final' : 'default';
      const row: Cell[] = [{ v: `h${i}`, role: rowRole }];
      for (let c = 0; c < w; c++) {
        const v = cms.table[i]![c]!;
        let role: BarRole = 'default';
        if (highlightCols.has(c)) role = 'swap';
        else if (v > 0) role = 'sorted';
        if (isMinRow && highlightCols.has(c)) role = 'final';
        row.push({ v: v === 0 ? '·' : v, role });
      }
      rows.push(row);
    }
    return rows;
  };

  rec
    .begin({
      zh: `Count-Min Sketch：${d} 行 × ${w} 列。流：[${stream.join(', ')}]`,
      en: `Count-Min Sketch: ${d} rows × ${w} cols. Stream: [${stream.join(', ')}]`,
    })
    .setGrid(renderGrid())
    .setAux([
      { label: '行数 d', value: String(d), role: 'pivot' as BarRole },
      { label: '列数 w', value: String(w), role: 'pivot' as BarRole },
      { label: '总流量', value: '0', role: 'default' as BarRole },
    ])
    .commit();

  const hooks: CmsHooks = {
    onUpdate: (item, _row, col, oldVal, newVal) => {
      highlightCols = new Set([col]);
      rec
        .begin({
          zh: `更新 "${item}"：列 ${col} 各行 +1（${oldVal}→${newVal}）`,
          en: `Update "${item}": column ${col} +1 each row (${oldVal}→${newVal})`,
        })
        .setGrid(renderGrid())
        .setAux([
          { label: '更新元素', value: item, role: 'swap' as BarRole },
          { label: '当前列', value: String(col), role: 'compare' as BarRole },
          { label: '总流量', value: String(cms.totalCount), role: 'default' as BarRole },
        ])
        .commit();
    },
  };

  for (const it of stream) cms.update(it, 1, hooks);
  highlightCols = new Set();

  // 查询阶段
  for (const q of query) {
    const rowValues: number[] = [];
    let min = Infinity;
    let minRow = -1;
    for (let i = 0; i < d; i++) {
      const col = hashWithSeed(cms.seeds[i]!, q) % w;
      const v = cms.table[i]![col]!;
      rowValues.push(v);
      if (v < min) {
        min = v;
        minRow = i;
      }
    }
    highlightCols = new Set();
    for (let i = 0; i < d; i++) {
      const col = hashWithSeed(cms.seeds[i]!, q) % w;
      highlightCols.add(col);
    }
    queryMinRows = new Set([minRow]);
    rec
      .begin({
        zh: `查询 "${q}"：各行值 [${rowValues.join(',')}]，取最小 → ${min}`,
        en: `Query "${q}": row values [${rowValues.join(',')}], min → ${min}`,
      })
      .setGrid(renderGrid())
      .setAux([
        { label: '查询元素', value: q, role: 'pivot' as BarRole },
        { label: '各行值', value: rowValues.join(','), role: 'compare' as BarRole },
        { label: '估计频率', value: String(min), role: 'final' as BarRole },
        { label: '总流量', value: String(cms.totalCount), role: 'default' as BarRole },
      ])
      .commit();
  }

  // 终态
  queryMinRows = new Set();
  highlightCols = new Set();
  rec
    .begin({
      zh: `完成：总流量 ${cms.totalCount}`,
      en: `Done: total count ${cms.totalCount}`,
    })
    .setGrid(renderGrid())
    .setAux([
      { label: '总流量', value: String(cms.totalCount), role: 'final' as BarRole },
      { label: '行数', value: String(d), role: 'final' as BarRole },
      { label: '列数', value: String(w), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}

export { hashWithSeed };
