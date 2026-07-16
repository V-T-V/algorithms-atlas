// 子集游戏 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameSubsetGame, type GameSubsetGameHooks } from './impl.ts';

export const DEFAULT_INPUT = { piles: [5, 7], removable: [1, 3, 4] };

export function buildTrace(
  input: { piles: number[]; removable: number[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { piles, removable } = input;

  rec
    .begin({
      zh: `堆 [${piles.join(', ')}]，可取 {${removable.join(', ')}}`,
      en: `Piles [${piles.join(', ')}], removable {${removable.join(', ')}}`,
    })
    .setBars(piles.map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([{ label: 'S', value: removable.join(','), role: 'pivot' }])
    .commit();

  const hooks: GameSubsetGameHooks = {
    onSg: (size, sgVal) => {
      rec
        .begin({ zh: `SG(${size})=${sgVal}`, en: `SG(${size})=${sgVal}` })
        .setAux([{ label: `SG(${size})`, value: String(sgVal), role: 'compare' as BarRole }])
        .commit();
    },
    onHeapXor: (heapIndex, sgVal) => {
      rec
        .begin({ zh: `堆 ${heapIndex} 的 SG=${sgVal}`, en: `Heap ${heapIndex} SG=${sgVal}` })
        .setBars(
          piles.map((v, i) => ({
            value: v,
            role: (i === heapIndex ? 'final' : 'default') as BarRole,
          })),
        )
        .commit();
    },
  };

  const result = gameSubsetGame(piles, removable, hooks);

  rec
    .begin({
      zh: `结论：异或=${result}，先手${result !== 0 ? '必胜' : '必败'}`,
      en: `Result: xor=${result}, first ${result !== 0 ? 'wins' : 'loses'}`,
    })
    .setAux([{ label: 'xor', value: String(result), role: result !== 0 ? 'final' : 'warn' }])
    .commit();

  return rec.build();
}
