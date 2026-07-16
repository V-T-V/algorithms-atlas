// =============================================================================
// 最长等差数列 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { longestArithSequence, type LongestArithHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 6, 9, 12];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  let curI = -1;
  let curJ = -1;
  let best = n <= 1 ? n : 2;

  const snap = (note: { zh: string; en: string }, curBest: number): void => {
    const roles: Record<number, BarRole> = {};
    if (curI >= 0) roles[curI] = 'compare';
    if (curJ >= 0) roles[curJ] = 'frontier';
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, roles))
      .setAux([
        { label: '当前 (i,j)', value: curI >= 0 ? `(${curJ},${curI})` : '∅', role: 'compare' },
        { label: '当前最优', value: String(curBest), role: 'final' },
      ])
      .commit();
  };

  snap({ zh: `nums = [${input.join(', ')}]`, en: `nums = [${input.join(', ')}]` }, best);

  const hooks: LongestArithHooks = {
    onCheck: (i, j, diff, len) => {
      curI = i;
      curJ = j;
      if (len > best) best = len;
      snap(
        {
          zh: `i=${i}, j=${j}, d=${diff} → 长度 ${len}`,
          en: `i=${i}, j=${j}, d=${diff} -> len ${len}`,
        },
        best,
      );
    },
    onResult: (m) => {
      curI = -1;
      curJ = -1;
      best = m;
      snap({ zh: `最长等差数列长度 = ${m}`, en: `Longest arithmetic length = ${m}` }, m);
    },
  };

  longestArithSequence(input, hooks);

  rec
    .begin({ zh: `完成：${best}`, en: `Done: ${best}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '答案', value: String(best), role: 'final' }])
    .commit();

  return rec.build();
}
