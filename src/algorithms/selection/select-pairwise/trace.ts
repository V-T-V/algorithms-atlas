// 锦标赛选最小 · 录制帧序列
// 用 setBars 展示每轮存活者，用 setAux 展示轮次与比较次数。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tournamentMin, type TournamentSelectHooks } from './impl.ts';

export const DEFAULT_INPUT = [7, 2, 9, 4, 1, 8, 5, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  let curField: number[] = [...a];
  let curRound = 0;
  let comparing: [number, number] | null = null;
  let winnerHighlight: number | null = null;
  let totalCmp = 0;

  const render = (note: { zh: string; en: string }): void => {
    const fieldSet = new Set(curField);
    // 用值匹配会因重复歧义，这里靠 label 标注
    const bars = curField.map((v) => {
      let role: BarRole = 'frontier';
      if (winnerHighlight === v) role = 'final';
      if (comparing && (comparing[0] === v || comparing[1] === v)) role = 'compare';
      return { value: v, role, label: String(v) };
    });
    rec
      .begin(note)
      .setBars(bars)
      .setAux([
        { label: '轮次', value: `R${curRound}`, role: 'pivot' as BarRole },
        { label: '存活者', value: String(curField.length), role: 'frontier' as BarRole },
        { label: '已比较', value: String(totalCmp), role: 'compare' as BarRole },
      ])
      .commit();
    comparing = null;
    winnerHighlight = null;
    void fieldSet;
  };

  render({ zh: `初始 ${a.length} 个种子`, en: `${a.length} seeds initially` });

  const hooks: TournamentSelectHooks = {
    onRound: (r, size) => {
      curRound = r;
      render({ zh: `第 ${r} 轮：${size} 个存活者`, en: `Round ${r}: ${size} alive` });
    },
    onMatch: (_r, _mi, x, y, winner) => {
      if (y !== null) {
        totalCmp++;
        comparing = [x, y];
        winnerHighlight = winner;
        render({ zh: `${x} vs ${y} → ${winner} 晋级`, en: `${x} vs ${y} → ${winner} advances` });
      } else {
        winnerHighlight = winner;
        render({ zh: `${winner} 轮空晋级`, en: `${winner} bye, advances` });
      }
    },
    onChampion: (winner, cmp) => {
      curField = [winner];
      winnerHighlight = winner;
      render({
        zh: `冠军（最小）= ${winner}，比较 ${cmp} 次`,
        en: `Champion (min) = ${winner}, ${cmp} comparisons`,
      });
    },
  };

  tournamentMin(input, hooks);

  rec
    .begin({ zh: `锦标赛完成`, en: `Tournament complete` })
    .setBars([{ value: tournamentMin(input).minimum, role: 'final' as BarRole, label: 'MIN' }])
    .setAux([
      { label: '最小值', value: String(tournamentMin(input).minimum), role: 'final' as BarRole },
      { label: '比较次数', value: 'n−1', role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
