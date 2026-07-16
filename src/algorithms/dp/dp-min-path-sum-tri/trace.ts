// =============================================================================
// 三角形最小路径和 · 录制帧序列
import type { Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { triangleMinPath, type TriPathHooks } from './impl.ts';

export const DEFAULT_TRIANGLE: ReadonlyArray<readonly number[]> = [
  [2],
  [3, 4],
  [6, 5, 7],
  [4, 1, 8, 3],
];

export function buildTrace(triangle: ReadonlyArray<readonly number[]> = DEFAULT_TRIANGLE): Frame[] {
  const rec = new TraceRecorder();
  let ans = 0;
  let curRow = -1;

  const renderTri = (note: { zh: string; en: string }): void => {
    const rows: Cell[][] = triangle.map((row, i) =>
      row.map((v, j) => ({
        v: String(v),
        role: (i === curRow
          ? 'pivot'
          : i === triangle.length - 1
            ? 'frontier'
            : 'default') as Cell['role'],
      })),
    );
    rec
      .begin(note)
      .setGrid(rows)
      .setAux([{ label: '处理行', value: curRow < 0 ? '-' : String(curRow), role: 'pivot' }])
      .commit();
  };

  renderTri({ zh: '输入三角形', en: 'Input triangle' });

  const hooks: TriPathHooks = {
    onRow: (i, dp) => {
      curRow = i;
      renderTri({
        zh: `处理第 ${i} 行，dp=[${dp.join(',')}]`,
        en: `Process row ${i}, dp=[${dp.join(',')}]`,
      });
    },
    onDone: (s) => {
      ans = s;
      curRow = -1;
      renderTri({ zh: `最小路径和=${s}`, en: `min path sum=${s}` });
    },
  };

  triangleMinPath(triangle, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setAux([{ label: '最小路径和', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
