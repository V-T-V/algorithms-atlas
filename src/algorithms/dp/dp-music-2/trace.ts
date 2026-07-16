// =============================================================================
// 歌单组合 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { playlistCount, type MusicHooks } from './impl.ts';

export const DEFAULT_INPUT = { lens: [1, 2, 3, 4], target: 5 };

export function buildTrace(input: { lens: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { lens, target } = input;
  const dp = new Array<number>(target + 1).fill(0);
  dp[0] = 1;
  let curT = -1;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        dp.map((v, t) => ({ value: v, role: (t === curT ? 'compare' : 'default') as BarRole })),
      )
      .setAux([{ label: 'target', value: String(target), role: 'frontier' }])
      .commit();
  };

  snap({
    zh: `歌单长度列表=[${lens.join(',')}] target=${target}`,
    en: `lens=[${lens.join(',')}] target=${target}`,
  });

  const hooks: MusicHooks = {
    onSong: (i, L) => {
      curT = -1;
      snap({ zh: `考虑第 ${i} 首 len=${L}`, en: `Song ${i} len=${L}` });
    },
    onCell: (t, val) => {
      dp[t] = val;
      curT = t;
      snap({ zh: `dp[${t}]=${val}`, en: `dp[${t}]=${val}` });
    },
  };

  const ans = playlistCount(lens, target, hooks);

  rec
    .begin({ zh: `方案数=${ans}`, en: `ways=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
