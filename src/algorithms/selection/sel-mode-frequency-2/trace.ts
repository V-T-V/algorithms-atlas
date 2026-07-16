import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { modeFrequency } from './impl.ts';

export const DEFAULT_INPUT = [2, 2, 1, 1, 2, 3, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let bmCandidate = input[0] ?? 0;
  let bmCount = 0;
  let processed = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (let i = 0; i < processed; i++) roles[i] = 'sorted';
    rec
      .begin(note)
      .setBars(
        input.map((v, i) => ({
          value: v,
          role: (i < processed ? 'sorted' : 'default') as BarRole,
          label: String(v),
        })),
      )
      .setAux([
        { label: 'BM 候选', value: String(bmCandidate), role: 'pivot' as BarRole },
        { label: 'BM 计数', value: String(bmCount), role: 'compare' as BarRole },
      ])
      .commit();
    void roles;
  };

  snap({ zh: `初始数组 n=${input.length}`, en: `Init n=${input.length}` });

  const r = modeFrequency(input, {
    onVote: (cand, cnt) => {
      bmCandidate = cand;
      bmCount = cnt;
      processed++;
      snap({
        zh: `投票 candidate=${cand} count=${cnt}`,
        en: `Vote candidate=${cand} count=${cnt}`,
      });
    },
  });

  rec
    .begin({
      zh: `完成：众数=${r.mode}(${r.modeFreq}次) 多数=${r.majority}`,
      en: `Done: mode=${r.mode}(${r.modeFreq}) majority=${r.majority}`,
    })
    .setBars(
      input.map((v) => ({
        value: v,
        role: (v === r.mode ? 'final' : 'default') as BarRole,
        label: String(v),
      })),
    )
    .setAux([
      { label: '众数', value: `${r.mode} (${r.modeFreq})`, role: 'final' as BarRole },
      {
        label: '多数元素',
        value: r.majority === null ? '无' : String(r.majority),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
