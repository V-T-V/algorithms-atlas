// =============================================================================
// Strand 排序 · 录制帧序列
// 通过 strandSort 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { strandSort, type StrandSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 1, 8, 2, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let result: number[] = [];

  const snapshot = (note: { zh: string; en: string }, strand: number[]): void => {
    rec
      .begin(note)
      .setAux([
        { label: '子链', value: strand.join(', ') || '—', role: 'frontier' as BarRole },
        { label: '结果', value: result.join(', ') || '—', role: 'final' as BarRole },
      ])
      .commit();
  };

  snapshot({ zh: `初始数组：${input.join(', ')}`, en: `Initial array: ${input.join(', ')}` }, []);

  const currentStrand: number[] = [];
  const hooks: StrandSortHooks = {
    onStrandStart: (v) => {
      currentStrand.length = 0;
      currentStrand.push(v);
      snapshot({ zh: `新子链起点：${v}`, en: `New strand starts: ${v}` }, currentStrand);
    },
    onStrandAppend: (v) => {
      currentStrand.push(v);
      snapshot({ zh: `子链追加：${v}`, en: `Append to strand: ${v}` }, currentStrand);
    },
    onMerge: () => {
      // 这里无法拿到合并后的结果，单独成帧
    },
  };

  const sorted = strandSort(input, hooks);
  result = sorted;

  rec
    .begin({ zh: '排序完成', en: 'Sorted' })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
