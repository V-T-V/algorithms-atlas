// =============================================================================
// 找第一个坏版本 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { firstBadVersion, type FirstBadHooks } from './impl.ts';

export const DEFAULT_N = 16;
export const DEFAULT_FIRST_BAD = 9;

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_N, firstBad: number = DEFAULT_FIRST_BAD): Frame[] {
  const rec = new TraceRecorder();
  // 版本数组：1..n，<firstBad 为好(0)，>=firstBad 为坏(1)
  const values: number[] = [];
  for (let v = 1; v <= n; v++) values.push(v < firstBad ? 0 : 1);
  const lo = 1;
  const hi = n;
  let probe = -1;

  const isBad = (v: number): boolean => v >= firstBad;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = values.map((b) => (b === 1 ? 'warn' : 'sorted'));
    if (probe >= 1 && probe <= n) roles[probe - 1] = 'compare';
    rec
      .begin(note)
      .setArray(
        values,
        roles,
        [lo - 1, hi - 1, probe - 1]
          .filter((x) => x >= 0)
          .map((x, i) => ({ index: x, label: ['lo', 'hi', 'mid'][i]! })),
      )
      .setAux([
        { label: 'lo', value: String(lo), role: 'frontier' },
        { label: 'hi', value: String(hi), role: 'frontier' },
      ])
      .commit();
  };

  snapshot({
    zh: `版本 1..${n}，前好后坏，找第一个坏版本`,
    en: `Versions 1..${n}, find first bad`,
  });

  const hooks: FirstBadHooks = {
    onProbe: (mid, bad) => {
      probe = mid;
      snapshot({
        zh: `查询 v${mid}：${bad ? '坏 → hi=mid' : '好 → lo=mid+1'}`,
        en: `Query v${mid}: ${bad ? 'bad → hi=mid' : 'good → lo=mid+1'}`,
      });
    },
    onDone: (fb) => {
      const roles: BarRole[] = values.map((b, i) =>
        i === fb - 1 ? 'final' : b === 1 ? 'warn' : 'sorted',
      );
      rec
        .begin({ zh: `第一个坏版本：v${fb}`, en: `First bad: v${fb}` })
        .setArray(values, roles, [{ index: fb - 1, label: '✓' }])
        .commit();
    },
  };

  firstBadVersion(n, isBad, hooks);

  return rec.build();
}
