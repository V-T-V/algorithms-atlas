// =============================================================================
// Polybius 方阵密码 · 录制帧序列
// setGrid 展示 5×5 方阵（高亮当前字母格），setMap 展示明文/密文。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coordToLetter, polybiusEncrypt, type PolybiusHooks } from './impl.ts';

export const DEFAULT_INPUT = 'HELLO';

function buildSquare(highlight?: { row: number; col: number }): Cell[][] {
  const grid: Cell[][] = [];
  for (let r = 1; r <= 5; r++) {
    const row: Cell[] = [];
    for (let c = 1; c <= 5; c++) {
      row.push({
        v: coordToLetter(r, c),
        role: highlight && highlight.row === r && highlight.col === c ? 'pivot' : 'default',
      });
    }
    grid.push(row);
  }
  return grid;
}

export function buildTrace(text: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `明文「${text}」，5×5 方阵（I/J 合并）`,
      en: `Plaintext "${text}", 5×5 square (I/J merged)`,
    })
    .setGrid(buildSquare())
    .setAux([{ label: '说明', value: '每个字母 = 行列两位数字', role: 'pivot' as BarRole }])
    .commit();

  let acc = '';
  const hooks: PolybiusHooks = {
    onEncode: (_i, letter, row, col, digits) => {
      acc += digits;
      rec
        .begin({
          zh: `'${letter}' → 行 ${row} 列 ${col} = "${digits}"`,
          en: `'${letter}' -> row ${row} col ${col} = "${digits}"`,
        })
        .setGrid(buildSquare({ row, col }))
        .setAux([{ label: '密文累积', value: acc, role: 'final' as BarRole }])
        .commit();
    },
  };

  const { text: cipher } = polybiusEncrypt(text, hooks);

  rec
    .begin({ zh: `完成：密文「${cipher}」`, en: `Done: ciphertext "${cipher}"` })
    .setMap([
      { key: '明文', value: text.toUpperCase().replace(/J/g, 'I'), role: 'default' as BarRole },
      { key: '密文', value: cipher, role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
