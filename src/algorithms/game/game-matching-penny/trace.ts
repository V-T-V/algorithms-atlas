// 猜硬币 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameMatchingPenny, type GameMatchingPennyHooks } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const M: ReadonlyArray<readonly number[]> = [
    [1, -1],
    [-1, 1],
  ];

  rec
    .begin({
      zh: '猜硬币：行希望相同，列希望不同',
      en: 'Matching Pennies: row wants match, col wants differ',
    })
    .setGrid(M.map((row) => row.map((v) => ({ v, role: 'default' as BarRole }))))
    .commit();

  const hooks: GameMatchingPennyHooks = {
    onConclude: (hasPureNash, nashCells, mixedProb) => {
      rec
        .begin({
          zh: `纯纳什 ${hasPureNash ? JSON.stringify(nashCells) : '无'}，混合概率 ${mixedProb}`,
          en: `Pure Nash ${hasPureNash ? JSON.stringify(nashCells) : 'none'}, mixed prob ${mixedProb}`,
        })
        .setAux([
          {
            label: '纯纳什',
            value: hasPureNash ? '有' : '无',
            role: hasPureNash ? 'final' : 'warn',
          },
          { label: 'P(H)', value: String(mixedProb), role: 'pivot' },
        ])
        .commit();
    },
  };

  gameMatchingPenny(hooks);

  return rec.build();
}
