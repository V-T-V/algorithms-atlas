// =============================================================================
// 闪排序 · 录制帧序列
// 通过 flashSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { flashSort, type FlashSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [8, 4, 1, 5, 9, 2, 6, 3, 7, 0];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  let phase: 'classify' | 'permute' | 'insertion' = 'classify';
  let writing: [number, number] | null = null;
  let upper: number[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    if (writing) roles[writing[0]] = 'swap';
    rec
      .begin(note)
      .setBars(rec.barsFrom(a, roles))
      .setAux([
        { label: '阶段', value: phase, role: 'pivot' },
        { label: '桶上界', value: upper.length ? upper.join(', ') : '—', role: 'frontier' },
      ])
      .commit();
    writing = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: FlashSortHooks = {
    onClassify: (m) => {
      phase = 'classify';
      snapshot({ zh: `划分 ${m} 个等宽桶`, en: `Split into ${m} equal-width classes` });
    },
    onBoundaries: (u) => {
      upper = u;
      snapshot({
        zh: `桶上界（前缀和）：[${u.join(', ')}]`,
        en: `Class upper bounds: [${u.join(', ')}]`,
      });
    },
    onPermute: (pos, v) => {
      phase = 'permute';
      writing = [pos, v];
      snapshot({ zh: `置换：a[${pos}] := ${v}`, en: `Permute: a[${pos}] := ${v}` });
    },
    onInsertion: () => {
      phase = 'insertion';
      snapshot({ zh: '每桶插入排序收尾', en: 'Insertion sort within each class' });
    },
  };

  flashSort(input, hooks);

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
