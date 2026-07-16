// =============================================================================
// 最长递增子序列个数 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findNumberOfLIS, type NumberOfLongestHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 4, 7];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const length: number[] = new Array<number>(n).fill(1);
  const count: number[] = new Array<number>(n).fill(1);
  let curI = -1;
  let curJ = -1;
  let ansLen = 0;
  let ansCnt = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = input.map((_, i) =>
      i === curI ? 'compare' : i === curJ ? 'swap' : 'default',
    );
    rec
      .begin(note)
      .setArray(input.slice(), roles, [
        { index: curI < 0 ? 0 : curI, label: 'i' },
        { index: curJ < 0 ? 0 : curJ, label: 'j' },
      ])
      .setAux([
        { label: 'length', value: length.join(' '), role: 'frontier' },
        { label: 'count', value: count.join(' '), role: 'swap' },
      ])
      .commit();
  };

  snap({ zh: `nums=[${input.join(', ')}]`, en: `nums=[${input.join(', ')}]` });

  const hooks: NumberOfLongestHooks = {
    onPair: (j, i) => {
      curI = i;
      curJ = j;
      snap({ zh: `检查 j=${j}→i=${i}`, en: `Check j=${j}→i=${i}` });
    },
    onUpdate: (i, len, cnt) => {
      length[i] = len;
      count[i] = cnt;
      curJ = -1;
      snap({
        zh: `i=${i}: length=${len}, count=${cnt}`,
        en: `i=${i}: length=${len}, count=${cnt}`,
      });
    },
    onResult: (len, cnt) => {
      ansLen = len;
      ansCnt = cnt;
      curI = -1;
      curJ = -1;
      snap({ zh: `LIS 长度=${len}, 个数=${cnt}`, en: `LIS len=${len}, count=${cnt}` });
    },
  };

  findNumberOfLIS(input, hooks);

  rec
    .begin({ zh: `完成：${ansCnt} 个长 ${ansLen}`, en: `Done: ${ansCnt} of length ${ansLen}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '个数 / count', value: String(ansCnt), role: 'final' }])
    .commit();

  return rec.build();
}
