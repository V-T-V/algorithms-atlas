// =============================================================================
// 列置换密码 · 录制帧序列
// setGrid 展示矩阵；setMap 展示密钥与密文。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { columnOrder, columnarEncrypt, normalizeKey, type ColumnarHooks } from './impl.ts';

export const DEFAULT_INPUT = { text: 'THEQUICKBROWNFOX', key: 'ZEBRA' };

export function buildTrace(input: { text: string; key: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, key } = input;
  const norm = normalizeKey(key);
  const width = norm.length;
  const chars = Array.from(text);
  const rows = Math.ceil(chars.length / width);
  const padded = [...chars];
  while (padded.length < rows * width) padded.push('X');

  let grid: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < width; c++) row.push({ v: '', role: 'default' });
    grid.push(row);
  }

  rec
    .begin({
      zh: `明文「${text}」，密钥「${key}」（列宽 ${width}）`,
      en: `Plaintext "${text}", key "${key}" (width ${width})`,
    })
    .setMap([
      { key: '密钥', value: norm, role: 'pivot' as BarRole },
      {
        key: '列读取顺序',
        value: columnOrder(key)
          .map((c) => `${norm[c]}(col${c})`)
          .join(' < '),
        role: 'sorted' as BarRole,
      },
    ])
    .commit();

  // 填入
  let fillIdx = 0;
  const hooks: ColumnarHooks = {
    onFill: (r, c, ch) => {
      grid = grid.map((row, rr) =>
        row.map((cell, cc) => {
          if (rr === r && cc === c) return { v: ch, role: 'pivot' };
          if (cell.v !== '' && !(rr === r && cc === c)) return { ...cell, role: 'final' };
          return { ...cell };
        }),
      );
      rec
        .begin({ zh: `填入 '${ch}'（行 ${r} 列 ${c}）`, en: `Fill '${ch}' (row ${r}, col ${c})` })
        .setGrid(grid)
        .commit();
      fillIdx++;
    },
    onReadColumn: (c, content) => {
      // 高亮当前读取列
      grid = grid.map((row, r) =>
        row.map((cell, cc) => (cc === c ? { ...grid[r]![cc]!, role: 'compare' } : { ...cell })),
      );
      rec
        .begin({ zh: `读列 ${c}：「${content}」`, en: `Read col ${c}: "${content}"` })
        .setGrid(grid)
        .setAux([{ label: '密文累积', value: '...', role: 'final' as BarRole }])
        .commit();
    },
  };

  const { text: cipher } = columnarEncrypt(text, key, hooks);
  void fillIdx;

  rec
    .begin({ zh: `完成：密文「${cipher}」`, en: `Done: ciphertext "${cipher}"` })
    .setMap([
      { key: '明文', value: text, role: 'default' as BarRole },
      { key: '密文', value: cipher, role: 'final' as BarRole },
      { key: '密钥', value: norm, role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
