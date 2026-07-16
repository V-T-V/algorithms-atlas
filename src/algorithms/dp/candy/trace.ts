// =============================================================================
// 分糖果 · 录制帧序列
// 用单行 grid 展示：列 i = 孩子下标，行依次为评分、左扫糖果、右扫（最终）糖果。
// 当前扫描位置标 'compare'，比邻居拿更多的位置标 'pivot'，最终态 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { candy, type CandyHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 0, 2, 5, 3, 2, 1, 4];

/** 录制演示帧序列。 */
export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const ratings = input;
  const n = ratings.length;

  const left = new Array<number>(n).fill(1);
  const right = new Array<number>(n).fill(1);
  let cur = -1;
  let phase: 'left' | 'right' = 'left';
  const done = new Set<number>();

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [{ v: 'i', role: 'default' }];
    for (let i = 0; i < n; i++) header.push({ v: i, role: 'pivot' });
    const rRow: Cell[] = [{ v: '评分', role: 'pivot' }];
    for (let i = 0; i < n; i++) {
      let role: BarRole = 'default';
      if (cur === i && phase === 'left') role = 'compare';
      rRow.push({ v: ratings[i]!, role });
    }
    const lRow: Cell[] = [{ v: '左扫', role: 'pivot' }];
    for (let i = 0; i < n; i++) {
      let role: BarRole = 'default';
      if (cur === i && phase === 'left') role = 'compare';
      lRow.push({ v: left[i]!, role });
    }
    const fRow: Cell[] = [{ v: '最终', role: 'pivot' }];
    for (let i = 0; i < n; i++) {
      let role: BarRole = 'default';
      if (done.has(i)) role = 'final';
      else if (cur === i && phase === 'right') role = 'compare';
      fRow.push({ v: right[i]!, role });
    }
    return [header, rRow, lRow, fRow];
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snapshot({ zh: `评分：[${ratings.join(', ')}]`, en: `Ratings: [${ratings.join(', ')}]` });

  const hooks: CandyHooks = {
    onLeftPass: (i, value) => {
      left[i] = value;
      right[i] = value;
      cur = i;
      phase = 'left';
      snapshot({
        zh: `左扫 i=${i}：评分 ${ratings[i]!}，糖果 ${value}`,
        en: `Left pass i=${i}: rating ${ratings[i]!}, candy ${value}`,
      });
    },
    onRightPass: (i, value) => {
      right[i] = value;
      cur = i;
      phase = 'right';
      done.add(i);
      snapshot({
        zh: `右扫 i=${i}：最终糖果 ${value}`,
        en: `Right pass i=${i}: final candy ${value}`,
      });
    },
  };

  const result = candy(ratings, hooks);
  const sum = result.reduce((a, b) => a + b, 0);

  cur = -1;
  rec
    .begin({ zh: `最少糖果总数 = ${sum}`, en: `Minimum total candies = ${sum}` })
    .setGrid(renderGrid())
    .setAux([{ label: '总数 / total', value: String(sum), role: 'final' }])
    .commit();

  return rec.build();
}
