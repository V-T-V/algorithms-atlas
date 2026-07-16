import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pacificAtlantic } from './impl.ts';

export const DEFAULT_HEIGHTS = [
  [1, 2, 2, 3, 5],
  [3, 2, 3, 4, 4],
  [2, 4, 5, 3, 1],
  [6, 7, 1, 4, 5],
  [5, 1, 1, 2, 4],
];

export function buildTrace(opts: { heights?: number[][] } = {}): Frame[] {
  const heights = opts.heights ?? DEFAULT_HEIGHTS;
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `初始化 ${heights.length}×${heights[0]?.length ?? 0} 地形`,
      en: `Init ${heights.length}x${heights[0]?.length ?? 0} terrain`,
    })
    .setGrid(heights.map((row) => row.map((v) => ({ v, role: 'default' as BarRole }))))
    .setAux([{ label: '规则', value: '两海反向 DFS', role: 'compare' as BarRole }])
    .commit();

  const both = new Set<string>();
  pacificAtlantic(heights, {
    onBoth: (r, c) => {
      both.add(`${r},${c}`);
      rec
        .begin({ zh: `(${r},${c}) 可流两洋`, en: `(${r},${c}) reaches both` })
        .setGrid(
          heights.map((row, ri) =>
            row.map((v, ci) => ({
              v,
              role: (both.has(`${ri},${ci}`) ? 'final' : 'default') as BarRole,
            })),
          ),
        )
        .setAux([{ label: '可达两洋', value: `(${r},${c})`, role: 'final' as BarRole }])
        .commit();
    },
  });

  const result = pacificAtlantic(heights);
  rec
    .begin({ zh: `完成：${result.length} 个格子`, en: `Done: ${result.length} cells` })
    .setGrid(
      heights.map((row, ri) =>
        row.map((v, ci) => ({
          v,
          role: (result.some(([r, c]) => r === ri && c === ci) ? 'final' : 'default') as BarRole,
        })),
      ),
    )
    .setAux([{ label: '总数', value: String(result.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
