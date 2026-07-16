// =============================================================================
// 青蛙过河（含能量）· 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { frogEnergyJump, type FrogEnergyHooks } from './impl.ts';

export const DEFAULT_H = [10, 30, 40, 20];
export const DEFAULT_K = 2;

export function buildTrace(h: readonly number[] = DEFAULT_H, k: number = DEFAULT_K): Frame[] {
  const rec = new TraceRecorder();
  const n = h.length;
  const dp = new Array<number>(n).fill(Number.POSITIVE_INFINITY);
  if (n > 0) dp[0] = 0;
  let cur = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = h.map((_, i) =>
      i === cur ? 'pivot' : i === n - 1 ? 'final' : 'frontier',
    );
    rec
      .begin(note)
      .setArray([...h], roles, [{ index: cur < 0 ? 0 : cur, label: 'i' }])
      .setAux([
        {
          label: 'dp',
          value: dp.map((v) => (Number.isFinite(v) ? `${v}` : '∞')).join(' '),
          role: 'pivot',
        },
        { label: 'K', value: String(k), role: 'compare' },
      ])
      .commit();
  };

  snap({ zh: `h=[${h.join(',')}] K=${k}`, en: `h=[${h.join(',')}] K=${k}` });

  const hooks: FrogEnergyHooks = {
    onStone: (i, val) => {
      dp[i] = val;
      cur = i;
      snap({ zh: `dp[${i}]=${val}`, en: `dp[${i}]=${val}` });
    },
    onDone: (c) => {
      ans = c;
      cur = -1;
      snap({ zh: `最小代价=${c}`, en: `min cost=${c}` });
    },
  };

  frogEnergyJump(h, k, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(h.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: '最小代价', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
