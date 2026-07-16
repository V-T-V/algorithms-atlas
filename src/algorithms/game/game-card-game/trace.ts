// 纸牌游戏 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameCardGame, type GameCardGameHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  hand1: ['Ah', 'Kh', 'Qh', 'Jh', 'Th'],
  hand2: ['9s', '9d', '9h', '9c', '2s'],
};

export function buildTrace(input: { hand1: string[]; hand2: string[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { hand1, hand2 } = input;

  rec
    .begin({
      zh: `手1 [${hand1.join(' ')}] vs 手2 [${hand2.join(' ')}]`,
      en: `Hand1 [${hand1.join(' ')}] vs Hand2 [${hand2.join(' ')}]`,
    })
    .setAux([
      { label: '手1', value: hand1.join(' '), role: 'compare' },
      { label: '手2', value: hand2.join(' '), role: 'warn' },
    ])
    .commit();

  const hooks: GameCardGameHooks = {
    onRank: (handIndex, rank, desc) => {
      rec
        .begin({ zh: `手${handIndex} 牌型：${desc}`, en: `Hand${handIndex}: ${desc}` })
        .setAux([{ label: `手${handIndex}`, value: `${desc}(rank ${rank})`, role: 'final' }])
        .commit();
    },
  };

  const winner = gameCardGame(hand1, hand2, hooks);

  rec
    .begin({
      zh: `胜者：${winner === 0 ? '平局' : '手' + winner}`,
      en: `Winner: ${winner === 0 ? 'draw' : 'hand ' + winner}`,
    })
    .setAux([{ label: '胜者', value: winner === 0 ? 'draw' : `hand${winner}`, role: 'final' }])
    .commit();

  return rec.build();
}
