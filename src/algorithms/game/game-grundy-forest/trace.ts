// 森林 Grundy 计算 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameGrundyForest, type GameGrundyForestHooks, type GameNode } from './impl.ts';

export const DEFAULT_INPUT: GameNode[] = [
  { id: 'A', children: [{ id: 'B' }, { id: 'C' }] },
  { id: 'D' },
];

export function buildTrace(input: GameNode[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `森林 ${input.length} 棵树`, en: `Forest of ${input.length} trees` })
    .setAux([{ label: 'trees', value: String(input.length), role: 'pivot' }])
    .commit();

  const hooks: GameGrundyForestHooks = {
    onNodeSg: (node, sg) => {
      rec
        .begin({ zh: `节点 ${node} SG=${sg}`, en: `Node ${node} SG=${sg}` })
        .setAux([{ label: `SG(${node})`, value: String(sg), role: 'compare' as BarRole }])
        .commit();
    },
    onForest: (xorSum) => {
      rec
        .begin({ zh: `森林 SG 异或和 = ${xorSum}`, en: `Forest SG xor = ${xorSum}` })
        .setAux([{ label: 'xor', value: String(xorSum), role: 'pivot' }])
        .commit();
    },
  };

  const result = gameGrundyForest(input, hooks);

  rec
    .begin({
      zh: `结论：森林 SG=${result}，先手${result !== 0 ? '必胜' : '必败'}`,
      en: `Result: forest SG=${result}, first ${result !== 0 ? 'wins' : 'loses'}`,
    })
    .setAux([{ label: 'SG', value: String(result), role: result !== 0 ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}
