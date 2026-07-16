// =============================================================================
// 石子游戏 IV · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stoneGame4, type StoneGame4Hooks } from './impl.ts';

export const DEFAULT_INPUT = 17;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const dp: boolean[] = new Array<boolean>(n + 1).fill(false);
  const known: number[] = new Array<number>(n + 1).fill(-1); // -1 未知，0/1 已知
  let cur = -1;
  let firstWins = false;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    const labels: Record<number, string> = {};
    for (let i = 0; i <= n; i++) {
      if (known[i]! === -1) {
        labels[i] = `${i}\n·`;
      } else {
        labels[i] = `${i}\n${known[i]! ? 'W' : 'L'}`;
        if (i === n) roles[i] = 'final';
        else roles[i] = known[i]! ? 'frontier' : 'warn';
      }
      if (i === cur) roles[i] = 'compare';
    }
    const values = Array.from({ length: n + 1 }, (_, i) => i + 1);
    rec
      .begin(note)
      .setBars(rec.barsFrom(values, roles, labels))
      .setAux([
        {
          label: 'dp',
          value: known.map((v) => (v < 0 ? '·' : v ? 'W' : 'L')).join(' '),
          role: 'compare',
        },
        { label: 'W=必胜 L=必败', value: '', role: 'frontier' },
      ])
      .commit();
    void dp;
  };

  snap({ zh: `n = ${n} 个石子`, en: `n = ${n} stones` });

  const hooks: StoneGame4Hooks = {
    onState: (i, win) => {
      known[i] = win ? 1 : 0;
      dp[i] = win;
      cur = i;
      snap({ zh: `dp[${i}] = ${win ? '必胜' : '必败'}`, en: `dp[${i}] = ${win ? 'WIN' : 'LOSE'}` });
    },
    onResult: (w) => {
      firstWins = w;
      cur = -1;
    },
  };

  stoneGame4(n, hooks);

  rec
    .begin({
      zh: firstWins ? '先手必胜' : '先手必败',
      en: firstWins ? 'First wins' : 'First loses',
    })
    .setBars(
      rec.barsFrom(
        Array.from({ length: n + 1 }, (_, i) => i + 1),
        { [n]: 'final' as BarRole },
        Object.fromEntries(
          Array.from({ length: n + 1 }, (_, i) => [
            i,
            `${i}\n${known[i]! < 0 ? '·' : known[i]! ? 'W' : 'L'}`,
          ]),
        ),
      ),
    )
    .setAux([
      {
        label: '结论',
        value: firstWins ? '先手必胜' : '先手必败',
        role: firstWins ? 'final' : 'warn',
      },
    ])
    .commit();

  return rec.build();
}
