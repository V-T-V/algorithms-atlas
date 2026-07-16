// =============================================================================
// 复制带随机指针的链表 · 录制帧序列
// setAux 展示原链与副本的 [value, randomIdx]。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildRandomList, randomListToArray, copyRandom, type CopyRandomHooks } from './impl.ts';

export const DEFAULT_INPUT: { values: number[]; randomIdx: number[] } = {
  values: [7, 13, 11, 10, 1],
  randomIdx: [-1, 0, 4, 2, 0],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { values: number[]; randomIdx: number[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { values, randomIdx } = input;
  const head = buildRandomList(values, randomIdx);
  let phase = '';

  const fmt = (arr: Array<[number, number]>): string =>
    arr.map((p, i) => `${i}:(${p[0]},r=${p[1] < 0 ? '∅' : p[1]})`).join(' ');

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: 'phase', value: phase || '-' },
        { label: 'orig', value: fmt(randomListToArray(head)), role: 'compare' },
        { label: 'copy', value: '-', role: 'final' },
      ])
      .commit();
  };

  snap({ zh: '深拷贝带随机指针链表', en: 'Deep-copy list with random pointer' });

  const hooks: CopyRandomHooks = {
    onInterleave: () => {
      phase = '交织：每个节点后插入副本';
    },
    onRandom: () => {
      phase = '设置副本 random';
    },
    onSplit: () => {
      phase = '拆分出副本';
    },
  };

  const copy = copyRandom(head, hooks);
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setAux([
      { label: 'phase', value: 'done' },
      { label: 'orig', value: fmt(randomListToArray(head)), role: 'compare' },
      { label: 'copy', value: fmt(randomListToArray(copy)), role: 'final' },
    ])
    .commit();
  return rec.build();
}
