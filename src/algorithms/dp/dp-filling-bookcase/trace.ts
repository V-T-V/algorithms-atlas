// =============================================================================
// 填充书架 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minHeightShelves, type FillingBookcaseHooks } from './impl.ts';

export const DEFAULT_BOOKS: Array<[number, number]> = [
  [1, 1],
  [2, 3],
  [2, 3],
  [1, 1],
  [1, 1],
  [1, 1],
  [1, 2],
];
export const DEFAULT_WIDTH = 4;

export function buildTrace(
  books: ReadonlyArray<[number, number]> = DEFAULT_BOOKS,
  shelfWidth: number = DEFAULT_WIDTH,
): Frame[] {
  const rec = new TraceRecorder();
  const n = books.length;
  const dp: number[] = new Array<number>(n + 1).fill(-1);
  let cur = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = books.map((_, i) =>
      i === cur - 1 ? 'compare' : i < cur ? 'frontier' : 'default',
    );
    rec
      .begin(note)
      .setBars(books.map((b, i) => ({ value: b[0], role: roles[i]!, label: `h${b[1]}` })))
      .setAux([
        { label: 'dp', value: dp.map((v) => (v < 0 ? '·' : v)).join(' '), role: 'frontier' },
        { label: 'shelfWidth', value: String(shelfWidth), role: 'pivot' },
      ])
      .commit();
  };

  snap({ zh: `${n} 本书 / shelfWidth=${shelfWidth}`, en: `${n} books / shelfWidth=${shelfWidth}` });

  const hooks: FillingBookcaseHooks = {
    onFill: (i, val) => {
      dp[i] = val;
      cur = i;
      snap({ zh: `dp[${i}] = ${val}`, en: `dp[${i}] = ${val}` });
    },
    onResult: (t) => {
      ans = t;
      cur = -1;
      snap({ zh: `最小总高度 = ${t}`, en: `Min height = ${t}` });
    },
  };

  minHeightShelves(books, shelfWidth, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(books.map((b) => ({ value: b[0], role: 'final' as BarRole, label: `h${b[1]}` })))
    .setAux([{ label: '高度 / height', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
