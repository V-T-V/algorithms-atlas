// =============================================================================
// 深拷贝链表 · 录制帧序列
// 用 setArray 展示原链表值，pointer 标记当前处理的节点；setAux 展示副本进度。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  copyListDeep,
  buildRandomList,
  randomListToArray,
  type RandomNode,
  type CopyListDeepHooks,
} from './impl.ts';

export const DEFAULT_INPUT = {
  values: [7, 13, 11, 10, 1],
  random: [1, 4, 2, 0, -1], // 各节点 random 指向下标，-1 = null
};

export function buildTrace(input: { values: number[]; random: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildRandomList(input.values, input.random);
  const n = input.values.length;

  // 原节点 → 下标映射
  const idxMap = new Map<RandomNode, number>();
  let cur: RandomNode | null = head;
  let i = 0;
  while (cur) {
    idxMap.set(cur, i++);
    cur = cur.next;
  }

  const copyValues: number[] = []; // 已生成副本的值（顺序）
  let activeOrigIdx = -1;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (activeOrigIdx >= 0 && activeOrigIdx < n) {
      roles[activeOrigIdx] = 'compare';
      pointers.push({ index: activeOrigIdx, label: 'orig' });
    }
    rec
      .begin(note)
      .setArray(input.values, roles, pointers)
      .setAux([{ label: '已拷贝', value: `[${copyValues.join(', ')}]`, role: 'final' as BarRole }])
      .commit();
  };

  snap({
    zh: `原链表：[${input.values.join(', ')}]，random=${JSON.stringify(input.random)}`,
    en: `Original: [${input.values.join(', ')}], random=${JSON.stringify(input.random)}`,
  });

  const hooks: CopyListDeepHooks = {
    onCreate: (orig, copy) => {
      activeOrigIdx = idxMap.get(orig) ?? -1;
      copyValues.push(copy.value);
      snap({
        zh: `复制节点 ${orig.value}（下标 ${activeOrigIdx}）`,
        en: `Copy node ${orig.value} (index ${activeOrigIdx})`,
      });
    },
    onRandom: (copy, target) => {
      void copy;
      void target;
      // random 设置不单独成帧，避免过多
    },
    onCacheHit: () => {
      /* 命中缓存 */
    },
  };

  const copyHead = copyListDeep(head, hooks);
  const result = randomListToArray(copyHead);

  rec
    .begin({
      zh: `深拷贝完成：副本 = ${JSON.stringify(result)}`,
      en: `Deep copy done: clone = ${JSON.stringify(result)}`,
    })
    .setArray(
      input.values,
      input.values.map(() => 'final' as BarRole),
      [],
    )
    .setAux([
      { label: '副本序列', value: `[${copyValues.join(', ')}]`, role: 'final' as BarRole },
      { label: 'random', value: JSON.stringify(result.map((r) => r[1])) },
    ])
    .commit();

  return rec.build();
}
