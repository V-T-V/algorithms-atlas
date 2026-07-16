// 第 k 大（小顶堆）· 录制帧序列
// 用 setArray 展示扫描进度（指针 i），用 setAux 展示当前堆内容与堆顶。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kthLargest, type KthLargestHooks } from './impl.ts';

export const DEFAULT_INPUT = { arr: [3, 2, 1, 5, 6, 4], k: 2 };

export function buildTrace(input: { arr: number[]; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, k } = input;
  let heapSnap: number[] = [];
  let scanIdx = -1;
  let evictInfo = '';

  const roles = (): BarRole[] => new Array(arr.length).fill('default');

  const snapshot = (note: { zh: string; en: string }): void => {
    const ptrs =
      scanIdx >= 0
        ? [{ index: scanIdx, label: 'i' }]
        : ([] as Array<{ index: number; label: string }>);
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '堆内容', value: `[${heapSnap.join(', ')}]`, role: 'pivot' as BarRole },
      {
        label: '堆顶(=第k大候选)',
        value: heapSnap.length ? String(heapSnap[0]) : '∅',
        role: 'swap' as BarRole,
      },
      { label: 'k', value: String(k), role: 'frontier' as BarRole },
    ];
    if (evictInfo) aux.push({ label: '事件', value: evictInfo, role: 'compare' as BarRole });
    rec.begin(note).setArray(arr, roles(), ptrs).setAux(aux).commit();
    evictInfo = '';
  };

  snapshot({
    zh: `找第 ${k} 大，维护大小 ${k} 的小顶堆`,
    en: `Find kth(${k}) largest via size-${k} min-heap`,
  });

  const hooks: KthLargestHooks = {
    onScan: (i, v, sz) => {
      scanIdx = i;
      void v;
      void sz;
    },
    onPush: (_v, heap) => {
      heapSnap = [...heap];
      snapshot({
        zh: `push ${_v}，堆 = [${heap.join(', ')}]`,
        en: `push ${_v}, heap = [${heap.join(', ')}]`,
      });
    },
    onSkip: (v, top) => {
      evictInfo = `${v} <= 堆顶 ${top}，丢弃`;
      snapshot({ zh: `${v} ≤ 堆顶 ${top}，丢弃`, en: `${v} <= top ${top}, skip` });
    },
    onEvict: (old, nv, heap) => {
      heapSnap = [...heap];
      evictInfo = `弹出 ${old}，压入 ${nv}`;
      snapshot({ zh: `弹出 ${old}，压入 ${nv}`, en: `Evict ${old}, push ${nv}` });
    },
  };

  const ans = kthLargest(arr, k, hooks);

  rec
    .begin({ zh: `第 ${k} 大 = ${ans}`, en: `Kth(${k}) largest = ${ans}` })
    .setArray(arr, [], [])
    .setAux([
      { label: '结果', value: String(ans), role: 'final' as BarRole },
      { label: '最终堆', value: `[${heapSnap.join(', ')}]`, role: 'pivot' as BarRole },
      { label: '复杂度', value: 'O(n log k)', role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
