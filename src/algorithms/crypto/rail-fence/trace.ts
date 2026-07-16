// =============================================================================
// Rail Fence · 录制帧序列
// setGrid 展示 Z 字形布局（rows = rails，cols = 文本长度），setMap 展示密文。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { railFenceEncrypt, type RailFenceHooks } from './impl.ts';

export const DEFAULT_INPUT = { text: 'WEAREDISCOVERED', rails: 3 };

export function buildTrace(input: { text: string; rails: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, rails } = input;
  const chars = Array.from(text);
  const n = chars.length;

  const emptyGrid = (): Cell[][] => {
    const g: Cell[][] = [];
    for (let r = 0; r < rails; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < n; c++) row.push({ v: '', role: 'default' });
      g.push(row);
    }
    return g;
  };

  let grid = emptyGrid();

  const render = (
    note: { zh: string; en: string },
    placed?: { col: number; rail: number },
  ): void => {
    if (placed) {
      grid = grid.map((row) => row.map((cell) => ({ ...cell })));
    }
    void placed;
    rec.begin(note).setGrid(grid).commit();
  };

  rec
    .begin({ zh: `明文「${text}」，rails=${rails}`, en: `Plaintext "${text}", rails=${rails}` })
    .setGrid(emptyGrid())
    .commit();

  const hooks: RailFenceHooks = {
    onPlace: (i, ch, rail) => {
      grid = grid.map((row, r) =>
        row.map((cell, c) => {
          if (r === rail && c === i) return { v: ch, role: 'pivot' };
          if (c < i && grid[r]![c]!.v !== '') return { ...grid[r]![c]!, role: 'final' };
          return { ...cell };
        }),
      );
      render({
        zh: `字符 '${ch}' 放到第 ${rail} 栏第 ${i} 列`,
        en: `Char '${ch}' -> rail ${rail}, col ${i}`,
      });
    },
    onReadRail: (rail, content) => {
      render({
        zh: `读取第 ${rail} 栏："${content}"`,
        en: `Read rail ${rail}: "${content}"`,
      });
    },
  };

  const { text: cipher } = railFenceEncrypt(text, rails, hooks);

  rec
    .begin({ zh: `完成：密文「${cipher}」`, en: `Done: ciphertext "${cipher}"` })
    .setMap([
      { key: '明文', value: text, role: 'default' as BarRole },
      { key: '密文', value: cipher, role: 'final' as BarRole },
      { key: 'rails', value: String(rails), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
