// =============================================================================
// 哈希表（链地址） · 录制帧序列
// 通过 HashTable 的钩子，把执行过程录成 Frame[]。
// 用 setMap 展示每个桶：key=value，slot 信息编码到 value 文本。
// 命中查找标 'pivot'，发生冲突的桶标 'warn'，新插入标 'final'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { HashTable, hashTable, type HashTableHooks } from './impl.ts';

/** 演示：插入若干键（产生冲突），再做命中/未命中查找与删除。 */
export const DEFAULT_INPUT = {
  capacity: 5,
  puts: [
    { key: 'apple', value: 1 },
    { key: 'banana', value: 2 },
    { key: 'cherry', value: 3 },
    { key: 'date', value: 4 },
    { key: 'apple', value: 10 }, // 更新
    { key: 'fig', value: 6 },
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
  const capacity = input.capacity ?? 7;
  const ht = new HashTable(capacity);

  let hotSlot = -1; // 当前操作桶
  let hotKey: string | null = null;
  let conflictSlot = -1; // 发生冲突（链长>1）的桶

  /** 把每个桶渲染为 setMap 条目。 */
  const renderMap = () => {
    const snap = ht.snapshot();
    const entries: Array<{ key: string; value: string; role?: BarRole }> = [];
    for (let s = 0; s < capacity; s++) {
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
        entries.push({
          key: `[${s}]`,
          value: pairs.join(' → '),
          role: (s === hotSlot ? 'compare' : s === conflictSlot ? 'warn' : 'final') as BarRole,
        });
      }
    }
    return entries;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setMap(renderMap())
      .setAux([
        { label: '元素数', value: String(ht.size), role: 'final' },
        { label: '负载因子', value: ht.loadFactor().toFixed(2), role: 'default' },
      ])
      .commit();
  };

  snapshot({ zh: `空哈希表（${capacity} 个桶）`, en: `Empty hash table (${capacity} slots)` });

  const putHooks: HashTableHooks = {
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
      conflictSlot = ht.snapshot()[slot]!.length > 1 ? slot : -1;
      snapshot({
        zh: `插入 ${key}=${value} 到桶 [${slot}]${conflictSlot === slot ? '（发生冲突，链入）' : ''}`,
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
  };

  // 仅插入 puts（hashTable 便利函数会一次性插入，这里改成逐个以便钩子可见）
  for (const p of input.puts ?? []) {
    ht.put(p.key, p.value, putHooks);
  }

  const getHooks: HashTableHooks = {
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
              zh: `桶 [${slot}] 第 ${idxInBucket} 项 ≠ ${key}（沿链继续）`,
              en: `Slot [${slot}] item ${idxInBucket} ≠ ${key} (follow chain)`,
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

  for (const k of input.gets ?? []) ht.get(k, getHooks);
  for (const k of input.deletes ?? []) ht.delete(k, getHooks);

  // 终态
  hotSlot = -1;
  hotKey = null;
  conflictSlot = -1;
  rec
    .begin({
      zh: `完成，共 ${ht.size} 个元素，负载因子 ${ht.loadFactor().toFixed(2)}`,
      en: `Done, ${ht.size} entries, load factor ${ht.loadFactor().toFixed(2)}`,
    })
    .setMap(renderMap())
    .commit();

  return rec.build();
}

void hashTable;
