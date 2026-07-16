// =============================================================================
// CSV 解析器 · 录制帧序列
// 用 setGrid 展示已解析的行/字段，aux 展示当前状态机状态与字符。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parseCsv, type CsvState, type CsvHooks } from './impl.ts';

export const DEFAULT_INPUT =
  'name,age,note\nAlice,30,"hello, world"\nBob,25,"line1\nline2"\nCarol,40,"say ""hi"""\n';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let curState: CsvState = 'FieldStart';
  let curRecord = -1;
  let curField = -1;
  let rows: string[][] = [];
  let curRow: string[] = [];
  let curValue = '';
  let charIndex = 0;

  const renderGrid = (): Cell[][] => {
    const maxCols = Math.max(4, ...rows.map((r) => r.length), curRow.length + 1);
    const header: Cell[] = [{ v: 'row', role: 'default' }];
    for (let c = 0; c < maxCols; c++) header.push({ v: `col${c}`, role: 'pivot' });
    const grid: Cell[][] = [header];
    for (let r = 0; r < rows.length; r++) {
      const row: Cell[] = [{ v: r, role: 'pivot' }];
      for (let c = 0; c < maxCols; c++) {
        const v = rows[r]![c];
        row.push({ v: v === undefined ? '' : v, role: 'sorted' });
      }
      grid.push(row);
    }
    // 当前行（未提交）
    const liveRow: Cell[] = [{ v: `${rows.length}*`, role: 'swap' }];
    for (let c = 0; c < maxCols; c++) {
      const v = curRow[c];
      if (c < curRow.length) {
        liveRow.push({ v: v!, role: 'final' });
      } else if (c === curRow.length) {
        liveRow.push({ v: curValue + '▌', role: 'swap' });
      } else {
        liveRow.push({ v: '', role: 'default' });
      }
    }
    grid.push(liveRow);
    return grid;
  };

  rec
    .begin({
      zh: `CSV 状态机解析：输入 ${input.length} 字符。`,
      en: `CSV state-machine parse: input ${input.length} chars.`,
    })
    .setGrid(renderGrid())
    .setAux([
      { label: '状态', value: curState, role: 'frontier' as BarRole },
      { label: '当前记录', value: '0', role: 'pivot' as BarRole },
      { label: '当前字段', value: '0', role: 'pivot' as BarRole },
      { label: '分隔符', value: ',', role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: CsvHooks = {
    onRecord: (ri) => {
      curRecord = ri;
      curField = 0;
      curValue = '';
    },
    onField: (_ri, fi) => {
      curField = fi;
      curValue = '';
    },
    onTransition: (from, to, ch) => {
      curState = to;
      const displayCh =
        ch === '\n' ? '\\n' : ch === '\r' ? '\\r' : ch === ',' ? ',' : ch === '"' ? '"' : ch;
      // 每个状态转换记录一帧（节流：仅关键转换）
      if (from !== to) {
        rec
          .begin({
            zh: `字符[${charIndex}] '${displayCh}'：状态 ${from} → ${to}`,
            en: `char[${charIndex}] '${displayCh}': state ${from} → ${to}`,
          })
          .setGrid(renderGrid())
          .setAux([
            { label: '状态', value: to, role: 'swap' as BarRole },
            { label: '字符', value: `'${displayCh}'`, role: 'compare' as BarRole },
            { label: '当前记录', value: String(curRecord), role: 'pivot' as BarRole },
            { label: '当前字段', value: String(curField), role: 'pivot' as BarRole },
            { label: '已解析行', value: String(rows.length), role: 'default' as BarRole },
          ])
          .commit();
      }
      charIndex++;
    },
    onFieldEnd: (value) => {
      curRow.push(value);
      curValue = '';
    },
    onRecordEnd: (fields) => {
      rows.push([...fields]);
      curRow = [];
      rec
        .begin({
          zh: `记录 ${rows.length - 1} 完成：[${fields.map((f) => `"${f}"`).join(', ')}]`,
          en: `Record ${rows.length - 1} done: [${fields.map((f) => `"${f}"`).join(', ')}]`,
        })
        .setGrid(renderGrid())
        .setAux([
          { label: '状态', value: 'FieldStart', role: 'frontier' as BarRole },
          { label: '已解析行', value: String(rows.length), role: 'final' as BarRole },
          { label: '本行字段数', value: String(fields.length), role: 'default' as BarRole },
        ])
        .commit();
    },
  };

  rows = parseCsv(input, {}, hooks);

  // 终态
  const maxCols = Math.max(...rows.map((r) => r.length), 0);
  rec
    .begin({
      zh: `完成：解析 ${rows.length} 行，每行最多 ${maxCols} 字段。`,
      en: `Done: parsed ${rows.length} rows, up to ${maxCols} fields each.`,
    })
    .setGrid(renderGrid())
    .setAux([
      { label: '总行数', value: String(rows.length), role: 'final' as BarRole },
      { label: '最大字段数', value: String(maxCols), role: 'final' as BarRole },
      { label: '输入字节', value: String(input.length), role: 'default' as BarRole },
    ])
    .commit();

  return rec.build();
}
