// =============================================================================
// 石子游戏 VIII · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stoneGame8, type StoneGame8Hooks } from './impl.ts';

export const DEFAULT_VALUES = [1, 2, 3, 4, 5];

export function buildTrace(values: readonly number[] = DEFAULT_VALUES): Frame[] {
  const rec = new TraceRecorder();
  const n = values.length;
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i]! + values[i]!;
  const dpList: number[] = new Array<number>(n + 1).fill(0);
  let cur = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = values.map((_, i) => (i === cur ? 'pivot' : 'default'));
    rec
      .begin(note)
      .setArray([...values], roles, [{ index: cur < 0 ? 0 : cur, label: 'i' }])
      .setAux([
        { label: 'prefix', value: prefix.map((v) => `${v}`).join(' '), role: 'frontier' },
        { label: 'dp', value: dpList.map((v) => `${v}`).join(' '), role: 'pivot' },
      ])
      .commit();
  };

  snap({ zh: `values=[${values.join(',')}]`, en: `values=[${values.join(',')}]` });

  const hooks: StoneGame8Hooks = {
    onStep: (i, val) => {
      dpList[i] = val;
      cur = i;
      snap({ zh: `dp[${i}]=${val}`, en: `dp[${i}]=${val}` });
    },
    onDone: (d) => {
      ans = d;
      cur = -1;
      snap({ zh: `分差=${d}`, en: `diff=${d}` });
    },
  };

  stoneGame8(values, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(values.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: 'Alice-Bob 分差', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
