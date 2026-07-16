// =============================================================================
// 3×N 铺砖（多米诺+三多米诺）· 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tiling3xN, type Tiling3xNHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 4, tromino: true };

export function buildTrace(input: { n: number; tromino?: boolean } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, tromino = true } = input;
  const states = 8;
  let result = 0;
  let curCol = -1;

  // dist 表：每列 8 个状态值（滚动快照）
  const history: number[][] = [];

  const render = (note: { zh: string; en: string }): void => {
    // 显示当前列的状态分布
    const rows = history.length === 0 ? [] : history[history.length - 1]!;
    const grid: Cell[][] = [];
    for (let s = 0; s < states; s++) {
      const bits = s.toString(2).padStart(3, '0');
      const v = rows.length ? (rows[s] ?? 0) : 0;
      grid.push([
        { v: bits[0] ?? '', role: 'default' as BarRole },
        { v: bits[1] ?? '', role: 'default' as BarRole },
        { v: bits[2] ?? '', role: 'default' as BarRole },
        { v: v || '·', role: (v > 0 ? 'frontier' : 'default') as BarRole },
      ]);
    }
    rec
      .begin(note)
      .setGrid(grid)
      .setAux([
        { label: '列', value: curCol >= 0 ? String(curCol) : '—', role: 'compare' },
        { label: 'f[0]', value: rows.length ? String(rows[0]) : '·', role: 'final' },
        { label: '骨牌', value: tromino ? '多米诺+三多米诺' : '仅多米诺', role: 'frontier' },
        { label: '答案', value: result ? String(result) : '（计算中）', role: 'final' },
      ])
      .commit();
  };

  render({ zh: `3×${n} 网格`, en: `3×${n} grid` });

  const hooks: Tiling3xNHooks = {
    onColumn: (col, dist) => {
      curCol = col;
      history.push([...dist]);
      render({ zh: `第 ${col} 列后 f[0]=${dist[0]}`, en: `After column ${col}: f[0]=${dist[0]}` });
    },
    onResult: (w) => {
      result = w;
      curCol = -1;
    },
  };

  tiling3xN(n, { tromino }, hooks);

  rec
    .begin({ zh: `完成：${result} 种铺法`, en: `Done: ${result} tilings` })
    .setAux([{ label: '答案', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
