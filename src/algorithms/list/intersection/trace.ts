// =============================================================================
// 两个链表交集 · 录制帧序列
// setAux 展示双指针与交集结果。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, intersection, type IntersectionHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: number[]; b: number[] } = { a: [1, 4, 5], b: [3, 4, 5, 6, 7] };

/** 录制演示帧序列。 */
export function buildTrace(input: { a: number[]; b: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const out: number[] = [];
  let va: number | null = null;
  let vb: number | null = null;
  let dir: 'a' | 'b' | 'both' = 'a';

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: 'a', value: a.join(' → ') },
        { label: 'b', value: b.join(' → ') },
        { label: 'pa', value: va === null ? '-' : String(va), role: 'compare' },
        { label: 'pb', value: vb === null ? '-' : String(vb), role: 'frontier' },
        { label: '交集', value: out.join(', ') || '-', role: 'final' },
        { label: 'move', value: dir },
      ])
      .commit();
  };

  snap({ zh: '双指针求交集', en: 'Two-pointer intersection' });

  const hooks: IntersectionHooks = {
    onCompare: (x, y, d) => {
      va = x;
      vb = y;
      dir = d;
      if (d === 'both' && (out.length === 0 || out[out.length - 1] !== x)) out.push(x);
      snap({
        zh: `${x} vs ${y} → ${d === 'both' ? '收录' : d === 'a' ? 'a 前进' : 'b 前进'}`,
        en: `${x} vs ${y} → ${d}`,
      });
    },
    onDone: () => {},
  };

  const res = intersection(buildList(a), buildList(b), hooks);
  out.length = 0;
  out.push(...listToArray(res));
  snap({ zh: `完成：[${out.join(', ')}]`, en: `Done: [${out.join(', ')}]` });
  return rec.build();
}
