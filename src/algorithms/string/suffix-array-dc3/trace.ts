// =============================================================================
// DC3 后缀数组 · 录制帧序列
// setAux 展示后缀数组 sa（排序后的后缀起点）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { suffixArrayDc3String, type SuffixArrayDc3Hooks } from './impl.ts';

export const DEFAULT_INPUT = 'banana';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;
  let sa: number[] = [];
  let phase = '';

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 's', value: s },
    { label: 'phase', value: phase || '-' },
    { label: 'sa', value: `[${sa.join(', ')}]`, role: 'final' },
  ];

  const snap = (
    note: { zh: string; en: string },
    pointers: Array<{ index: number; label: string }>,
  ): void => {
    rec
      .begin(note)
      .setArray(CODE(s), new Array(n).fill('default'), pointers)
      .setAux(aux())
      .commit();
  };

  snap({ zh: `DC3 后缀数组：${s}`, en: `DC3 suffix array: ${s}` }, []);

  // suffixArrayDc3String 不接收 hooks；这里以阶段标注示意（sa 以最终结果为准）
  const hooks: SuffixArrayDc3Hooks = {
    onSortB12: () => {
      phase = 'B12 sorted';
      snap({ zh: 'B12（mod 1/2 后缀）已排序', en: 'B12 sorted' }, []);
    },
    onSortB0: () => {
      phase = 'B0 sorted';
      snap({ zh: 'B0（mod 0 后缀）已排序', en: 'B0 sorted' }, []);
    },
    onMerge: (partial) => {
      sa = partial;
      phase = 'merged';
      snap({ zh: '归并完成', en: 'Merged' }, []);
    },
    onDone: (finalSa) => {
      sa = finalSa;
      phase = 'done';
    },
  };
  void hooks;

  const { sa: finalSa } = suffixArrayDc3String(s);
  sa = finalSa;

  snap(
    { zh: `完成：sa = [${sa.join(', ')}]`, en: `Done: sa = [${sa.join(', ')}]` },
    sa.length > 0 ? [{ index: sa[0]!, label: 'min' }] : [],
  );
  rec
    .begin({ zh: '后缀数组构造完成', en: 'Suffix array done' })
    .setArray(
      CODE(s),
      new Array(n).fill('final'),
      sa.length > 0 ? [{ index: sa[0]!, label: 'min' }] : [],
    )
    .setAux(aux())
    .commit();
  return rec.build();
}
