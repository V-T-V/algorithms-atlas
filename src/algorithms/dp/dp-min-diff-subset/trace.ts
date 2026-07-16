// =============================================================================
// 最小差子集分割 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minDiffSubset, type MinDiffHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 6, 11, 5];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const _n = input.length;
  const sum = input.reduce((a, b) => a + b, 0);
  const half = Math.floor(sum / 2);
  const reach: boolean[] = new Array<boolean>(half + 1).fill(false);
  reach[0] = true;
  let curItem = -1;
  let lastReach = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const values: number[] = [];
    const roles: BarRole[] = [];
    for (let j = 0; j <= half; j++) {
      values.push(j);
      roles.push(j === lastReach ? 'compare' : reach[j]! ? 'frontier' : 'default');
    }
    rec
      .begin(note)
      .setArray(values, roles, [{ index: curItem < 0 ? 0 : curItem, label: 'item' }])
      .setAux([
        {
          label: '可达和',
          value: reach.map((r, j) => (r ? `${j}` : '·')).join(' '),
          role: 'frontier',
        },
        { label: 'sum/half', value: `${sum}/${half}`, role: 'pivot' },
      ])
      .commit();
  };

  snap({
    zh: `nums=[${input.join(', ')}] sum=${sum} half=${half}`,
    en: `nums=[${input.join(', ')}] sum=${sum} half=${half}`,
  });

  const hooks: MinDiffHooks = {
    onItem: (i) => {
      curItem = i;
      snap({ zh: `考虑 nums[${i}]=${input[i]}`, en: `Consider nums[${i}]=${input[i]}` });
    },
    onReach: (j) => {
      reach[j] = true;
      lastReach = j;
      snap({ zh: `可达和 +${j}`, en: `Reachable sum +${j}` });
    },
    onResult: (diff, s1) => {
      ans = diff;
      lastReach = -1;
      curItem = -1;
      snap({
        zh: `差=${diff}（s1=${s1}, s2=${sum - s1}）`,
        en: `Diff=${diff} (s1=${s1}, s2=${sum - s1})`,
      });
    },
  };

  minDiffSubset(input, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '最小差 / min diff', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
