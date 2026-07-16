// =============================================================================
// 哈希映射 · 录制帧序列
// 用 setMap 展示每个桶：key=value，命中标 'compare'，冲突链（>1）标 'warn'，
// 新插入标 'final'，rehash 期间标 'pivot'。
// 用 setAux 展示 size / capacity / 负载因子。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { HashMap, type HashMapHooks } from './impl.ts';

/** 演示：插入（含更新与冲突），命中/未命中查找，删除，触发扩容。 */
export const DEFAULT_INPUT = {
  capacity: 4,
  puts: [
    { key: 'apple', value: 1 },
    { key: 'banana', value: 2 },
    { key: 'cherry', value: 3 },
    { key: 'apple', value: 10 }, // 更新
    { key: 'date', value: 4 },
    { key: 'fig', value: 6 }, // 触发 rehash
  ],
  gets: ['banana', 'grape'],
  deletes: ['cherry'],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    capacity?: number;
    puts?: ReadonlyArray<{ key: string; value: number }>;
    gets?: readonly string[];
    deletes?: readonly string[];
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const capacity = input.capacity ?? 4;
  const map = new HashMap(capacity);

  let hotSlot = -1;
  let hotKey: string | null = null;
  let conflictSlot = -1;
  let resizing = false;

  const renderMap = () => {
    const snap = map.snapshot();
    const entries: Array<{ key: string; value: string; role?: BarRole }> = [];
    for (let s = 0; s < map.capacity; s++) {
      const bucket = snap[s] ?? [];
      if (bucket.length === 0) {
        let role: BarRole = 'default';
        if (s === hotSlot) role = 'compare';
        entries.push({ key: `[${s}]`, value: '∅', role });
      } else {
        const pairs = bucket.map((e) => {
          const isHot = s === hotSlot && e.key === hotKey;
          return `${e.key}=${e.value}` + (isHot ? ' ◀' : '');
        });
        let role: BarRole = 'final';
        if (resizing) role = 'pivot';
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
        { label: 'size', value: String(map.size), role: 'final' },
        { label: 'capacity', value: String(map.capacity), role: 'compare' },
        { label: '负载因子', value: map.loadFactor().toFixed(2), role: 'default' },
      ])
      .commit();
    conflictSlot = -1;
    resizing = false;
  };

  snapshot({ zh: `空哈希映射（${capacity} 个桶）`, en: `Empty hash map (${capacity} slots)` });

  const putHooks: HashMapHooks = {
    onHash: (key, slot) => {
      hotSlot = slot;
      hotKey = key;
    },
    onCompare: (slot, key, found) => {
      hotSlot = slot;
      hotKey = key;
      void found;
    },
    onInsert: (slot, key, value) => {
      hotSlot = slot;
      hotKey = key;
      conflictSlot = map.snapshot()[slot]!.length > 1 ? slot : -1;
      snapshot({
        zh: `插入 ${key}=${value} 到桶 [${slot}]${conflictSlot === slot ? '（冲突，链入）' : ''}`,
        en: `Insert ${key}=${value} into slot [${slot}]${conflictSlot === slot ? ' (collision, chain)' : ''}`,
      });
    },
    onUpdate: (slot, key, oldV, newV) => {
      hotSlot = slot;
      snapshot({
        zh: `${key} 已存在，更新 ${oldV} → ${newV}`,
        en: `${key} exists, update ${oldV} → ${newV}`,
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

  for (const p of input.puts ?? []) map.put(p.key, p.value, putHooks);

  const probeHooks: HashMapHooks = {
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
    onResult: (kind, key, found, value) => {
      snapshot(
        found
          ? {
              zh: `${kind === 'get' ? '查找' : '删除'} ${key} ✓ = ${value}`,
              en: `${kind === 'get' ? 'Get' : 'Delete'} ${key} ✓ = ${value}`,
            }
          : {
              zh: `${kind === 'get' ? '查找' : '删除'} ${key} ✗（不存在）`,
              en: `${kind === 'get' ? 'Get' : 'Delete'} ${key} ✗ (absent)`,
            },
      );
    },
  };

  for (const k of input.gets ?? []) map.get(k, probeHooks);
  for (const k of input.deletes ?? []) map.delete(k, probeHooks);

  // 终态
  hotSlot = -1;
  hotKey = null;
  rec
    .begin({
      zh: `完成，共 ${map.size} 个键值，capacity=${map.capacity}`,
      en: `Done, ${map.size} entries, capacity=${map.capacity}`,
    })
    .setMap(renderMap())
    .commit();

  return rec.build();
}
