// =============================================================================
// 链表相交 · 录制帧序列
// setAux 展示两条链与对齐后的双指针。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  buildIntersecting,
  getIntersection,
  type ListNode,
  type GetIntersectionHooks,
} from './impl.ts';

export const DEFAULT_INPUT: { a: number[]; b: number[]; shared: number[] } = {
  a: [4, 1],
  b: [5, 6, 1],
  shared: [8, 4, 5],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { a: number[]; b: number[]; shared: number[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { a, b, shared } = input;
  const { headA, headB } = buildIntersecting(a, b, shared);
  let paVal: number | null = null;
  let pbVal: number | null = null;
  let result: ListNode | null = null;

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'A', value: [...a, ...shared].join(' → ') },
    { label: 'B', value: [...b, ...shared].join(' → ') },
    { label: 'pa', value: paVal === null ? '-' : String(paVal), role: 'compare' },
    { label: 'pb', value: pbVal === null ? '-' : String(pbVal), role: 'frontier' },
    { label: 'intersect', value: result === null ? '-' : String(result.value), role: 'final' },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setAux(aux()).commit();
  };

  snap({ zh: '对齐长度后同步前进', en: 'Align then advance together' });

  const hooks: GetIntersectionHooks = {
    onStep: (pa, pb) => {
      paVal = pa ? pa.value : null;
      pbVal = pb ? pb.value : null;
      snap({ zh: `比较 ${paVal} 与 ${pbVal}`, en: `Compare ${paVal} vs ${pbVal}` });
    },
    onDone: (node) => {
      result = node;
    },
  };

  const found = getIntersection(headA, headB, hooks);
  snap({
    zh: found ? `相交于 ${found.value}` : '不相交',
    en: found ? `Intersect at ${found.value}` : 'No intersection',
  });
  return rec.build();
}
