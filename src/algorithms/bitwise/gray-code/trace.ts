// 格雷码 · 录制帧序列
// 用 setGrid 展示每个格雷码的二进制位（每行一个码，每列一位）。

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { grayCode, type GrayCodeHooks } from './impl.ts';

export const DEFAULT_N = 3;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  let codes: number[] = [];

  const render = (note: { zh: string; en: string }) => {
    const grid: Cell[][] = codes.map((code) => {
      const row: Cell[] = [];
      for (let b = n - 1; b >= 0; b--) {
        row.push({ v: (code >> b) & 1, role: 'default' as BarRole });
      }
      return row;
    });
    rec.begin(note).setGrid(grid).commit();
  };

  render({ zh: `生成 ${n} 位格雷码（起点：0）`, en: `Generating ${n}-bit Gray code (start: 0)` });

  const hooks: GrayCodeHooks = {
    onReflect: (bits) => {
      render({
        zh: `反射：在 ${bits - 1} 位基础上前缀 1（共 ${1 << bits} 个）`,
        en: `Reflect: prefix bit ${bits - 1} with 1 (total ${1 << bits})`,
      });
    },
    onEmit: () => {
      // 不每帧渲染（太多），只渲染反射后
    },
  };
  codes = grayCode(n, hooks);

  // 终态：高亮相邻差异位
  const grid: Cell[][] = codes.map((code, i) => {
    const row: Cell[] = [];
    const prev = i > 0 ? codes[i - 1]! : 0;
    const diff = i > 0 ? code ^ prev : -1;
    for (let b = n - 1; b >= 0; b--) {
      const bit = (code >> b) & 1;
      const isDiff = diff >= 0 && ((diff >> b) & 1) === 1;
      row.push({ v: bit, role: (isDiff ? 'final' : 'default') as BarRole });
    }
    return row;
  });
  rec
    .begin({
      zh: `完成：${codes.length} 个格雷码，相邻仅差 1 位`,
      en: `Done: ${codes.length} codes, adjacent differ by 1 bit`,
    })
    .setGrid(grid)
    .commit();

  return rec.build();
}
