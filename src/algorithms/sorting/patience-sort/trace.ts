// =============================================================================
// 耐心排序 · 录制帧序列
// 通过 patienceSort 的钩子，把执行过程录成 Frame[]。
// 用 map 视图展示每个「牌堆」，用 aux 展示输出序列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { patienceSort, type PatienceSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [9, 3, 7, 1, 5, 8, 2, 6, 4];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const piles: number[][] = [];
  const output: number[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const entries = piles.map((p, i) => ({
      key: `堆 ${i}`,
      value: p.join(', '),
      role: (p.length > 0 ? 'default' : 'warn') as BarRole,
    }));
    rec
      .begin(note)
      .setMap(entries)
      .setAux([{ label: '输出', value: output.join(', ') || '—', role: 'final' as BarRole }])
      .commit();
  };

  snapshot({ zh: `初始数组：${input.join(', ')}`, en: `Initial array: ${input.join(', ')}` });

  const hooks: PatienceSortHooks = {
    onPlace: (v, pileIndex) => {
      if (pileIndex >= piles.length) piles.push([]);
      piles[pileIndex]!.push(v);
      snapshot({
        zh: `把 ${v} 放到堆 ${pileIndex} 顶端`,
        en: `Place ${v} on top of pile ${pileIndex}`,
      });
    },
    onMergePick: (v, pileIndex) => {
      piles[pileIndex]!.pop();
      output.push(v);
      snapshot({
        zh: `合并：取堆 ${pileIndex} 顶 ${v} 加入输出`,
        en: `Merge: pick ${v} from pile ${pileIndex} to output`,
      });
    },
  };

  patienceSort(input, hooks);

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setAux([{ label: '输出', value: output.join(', '), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
