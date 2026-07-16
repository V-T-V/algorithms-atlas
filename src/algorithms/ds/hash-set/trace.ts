// =============================================================================
// 哈希集合 · 录制帧序列
// 用 setMap 展示每个桶：值为该桶的元素链，命中标 'compare'，
// 冲突链（长度>1）标 'warn'，新增标 'final'。
// 用 setAux 展示 size / 负载因子 / 桶数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { HashSet, type HashSetHooks } from './impl.ts';

/** 演示：插入若干（含重复与冲突），命中/未命中查找，删除，触发扩容。 */
export const DEFAULT_INPUT = {
  capacity: 4,
  adds: ['apple', 'banana', 'cherry', 'apple', 'date', 'fig'],
  contains: ['banana', 'grape'],
  removes: ['cherry'],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    capacity?: number;
    adds?: readonly string[];
    contains?: readonly string[];
    removes?: readonly string[];
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const capacity = input.capacity ?? 4;
  const set = new HashSet(capacity);

  let hotSlot = -1;
  let hotKey: string | null = null;
  let conflictSlot = -1;
  let resizing = false;

  const renderMap = () => {
    const snap = set.snapshot();
    const entries: Array<{ key: string; value: string; role?: BarRole }> = [];
    for (let s = 0; s < set.capacity; s++) {
      const bucket = snap[s] ?? [];
      if (bucket.length === 0) {
        let role: BarRole = 'default';
        if (s === hotSlot) role = 'compare';
        entries.push({ key: `[${s}]`, value: '∅', role });
      } else {
        const pairs = bucket.map((k) => {
          const isHot = s === hotSlot && k === hotKey;
          return k + (isHot ? ' ◀' : '');
        });
        let role: BarRole = 'final';
        if (resizing) role = 'warn';
        else if (s === hotSlot) role = 'compare';
        else if (s === conflictSlot) role = 'warn';
        entries.push({ key: `[${s}]`, value: pairs.join(' → '), role });
      }
    }
    return entries;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setMap(renderMap())
      .setAux([
        { label: 'size', value: String(set.size), role: 'final' },
        { label: 'capacity', value: String(set.capacity), role: 'compare' },
        { label: '负载因子', value: set.loadFactor().toFixed(2), role: 'default' },
      ])
      .commit();
    conflictSlot = -1;
    resizing = false;
  };

  snapshot({ zh: `空哈希集合（${capacity} 个桶）`, en: `Empty hash set (${capacity} slots)` });

  const addHooks: HashSetHooks = {
    onHash: (key, slot) => {
      hotSlot = slot;
      hotKey = key;
    },
    onCompare: (slot, key, found) => {
      hotSlot = slot;
      hotKey = key;
      void found;
    },
    onAdd: (slot, key) => {
      hotSlot = slot;
      hotKey = key;
      conflictSlot = set.snapshot()[slot]!.length > 1 ? slot : -1;
      snapshot({
        zh: `添加 ${key} 到桶 [${slot}]${conflictSlot === slot ? '（冲突，链入）' : ''}`,
        en: `Add ${key} into slot [${slot}]${conflictSlot === slot ? ' (collision, chain)' : ''}`,
      });
    },
    onResize: (oldCap, newCap) => {
      resizing = true;
      snapshot({
        zh: `负载过高，rehash ${oldCap} → ${newCap}`,
        en: `Load too high, rehash ${oldCap} → ${newCap}`,
      });
    },
  };

  for (const k of input.adds ?? []) set.add(k, addHooks);

  const probeHooks: HashSetHooks = {
    onHash: (key, slot) => {
      hotSlot = slot;
      hotKey = key;
    },
    onProbe: (slot, idxInBucket, key, hit) => {
      hotSlot = slot;
      hotKey = key;
      conflictSlot = idxInBucket > 0 ? slot : -1;
      snapshot(
        hit
          ? {
              zh: `桶 [${slot}] 第 ${idxInBucket} 项命中 ${key}`,
              en: `Slot [${slot}] item ${idxInBucket} matches ${key}`,
            }
          : {
              zh: `桶 [${slot}] 第 ${idxInBucket} 项 ≠ ${key}`,
              en: `Slot [${slot}] item ${idxInBucket} ≠ ${key}`,
            },
      );
    },
    onResult: (kind, key, found) => {
      snapshot(
        found
          ? {
              zh: `${kind === 'contains' ? '查找' : '删除'} ${key} ✓`,
              en: `${kind === 'contains' ? 'Contains' : 'Remove'} ${key} ✓`,
            }
          : {
              zh: `${kind === 'contains' ? '查找' : '删除'} ${key} ✗（不存在）`,
              en: `${kind === 'contains' ? 'Contains' : 'Remove'} ${key} ✗ (absent)`,
            },
      );
    },
  };

  for (const k of input.contains ?? []) set.contains(k, probeHooks);
  for (const k of input.removes ?? []) set.remove(k, probeHooks);

  // 终态
  hotSlot = -1;
  hotKey = null;
  rec
    .begin({
      zh: `完成，集合共 ${set.size} 个元素，capacity=${set.capacity}`,
      en: `Done, ${set.size} elements, capacity=${set.capacity}`,
    })
    .setMap(renderMap())
    .commit();

  return rec.build();
}
