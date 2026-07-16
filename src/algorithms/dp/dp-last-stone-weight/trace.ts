// =============================================================================
// 最后一块石头重量 II · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lastStoneWeightII, type LastStoneHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 7, 4, 1, 8, 1];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sum = input.reduce((a, b) => a + b, 0);
  const half = Math.floor(sum / 2);
  const reach: boolean[] = new Array<boolean>(half + 1).fill(false);
  reach[0] = true;
  let ans = 0;

  // 逐个石头滚动可达集合
  const snap = (note: { zh: string; en: string }, curItem: number): void => {
    const roles: BarRole[] = input.map((_, i) => (i === curItem ? 'compare' : 'default'));
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, Object.fromEntries(roles.map((r, i) => [i, r]))))
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

  snap(
    {
      zh: `stones=[${input.join(', ')}] sum=${sum} half=${half}`,
      en: `stones=[${input.join(', ')}] sum=${sum} half=${half}`,
    },
    -1,
  );

  // 模拟滚动更新并录制每一项后的状态
  for (let i = 0; i < input.length; i++) {
    for (let j = half; j >= input[i]!; j--) {
      if (reach[j - input[i]!]) reach[j] = true;
    }
    snap(
      { zh: `加入 stones[${i}]=${input[i]} 后的可达和`, en: `After stones[${i}]=${input[i]}` },
      i,
    );
  }

  const hooks: LastStoneHooks = {
    onResult: (w) => {
      ans = w;
    },
  };
  lastStoneWeightII(input, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '最后重量 / last weight', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
