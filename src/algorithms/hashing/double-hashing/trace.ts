// =============================================================================
// 双重哈希 · 录制帧序列
// 用 setArray 展示哈希槽，role 标 空/占用/冲突探测/新插入。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { doubleHashing, type DoubleHashingHooks, type Slot } from './impl.ts';

export const DEFAULT_INPUT = [10, 22, 31, 4, 17];
export const DEFAULT_SIZE = 7; // 素数

/** 把 slots 数组转成 setArray 用的 values（null → -1）与 roles。 */
function render(
  slots: Slot[],
  curHash: number,
  probeSlots: Set<number>,
  insertSlot: number | null,
): { values: number[]; roles: BarRole[] } {
  const values = slots.map((s) => (s === null ? -1 : s));
  const roles: BarRole[] = slots.map(() => 'default');
  for (const p of probeSlots) {
    if (slots[p] !== null) roles[p] = 'warn';
    else roles[p] = 'compare';
  }
  if (curHash >= 0 && roles[curHash] === 'default') roles[curHash] = 'frontier';
  if (insertSlot !== null) roles[insertSlot] = 'final';
  return { values, roles };
}

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT, size: number = DEFAULT_SIZE): Frame[] {
  const rec = new TraceRecorder();
  const slots: Slot[] = new Array(size).fill(null);
  let curHash = -1;
  let probeSlots = new Set<number>();
  let insertSlot: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const { values, roles } = render(slots, curHash, probeSlots, insertSlot);
    const pointers: Array<{ index: number; label: string }> = [];
    if (insertSlot !== null) pointers.push({ index: insertSlot, label: '插入' });
    else if (probeSlots.size > 0) {
      const last = [...probeSlots].pop()!;
      pointers.push({ index: last, label: '探测' });
    }
    if (curHash >= 0 && !pointers.some((p) => p.index === curHash)) {
      pointers.push({ index: curHash, label: 'h1' });
    }
    rec.begin(note).setArray(values, roles, pointers).commit();
    probeSlots = new Set();
    insertSlot = null;
  };

  snapshot({
    zh: `哈希表大小 ${size}，双重哈希探测 (h1 + i·h2) % ${size}，插入序列：${input.join(', ')}`,
    en: `Table size ${size}, double hashing (h1 + i·h2) % ${size}, insert sequence: ${input.join(', ')}`,
  });

  const hooks: DoubleHashingHooks = {
    onHash: (key, h1, h2) => {
      curHash = h1;
      probeSlots = new Set();
      snapshot({
        zh: `插入 ${key}：h1=${key} % ${size} = ${h1}，步长 h2=${h2}`,
        en: `Insert ${key}: h1=${key} % ${size} = ${h1}, step h2=${h2}`,
      });
    },
    onProbe: (_i, slot) => {
      probeSlots.add(slot);
    },
    onCollision: (slot) => {
      snapshot({
        zh: `槽 ${slot} 已占用（冲突），按步长 h2 跳跃`,
        en: `Slot ${slot} occupied (collision), jump by step h2`,
      });
    },
    onInsert: (key, slot) => {
      slots[slot] = key;
      insertSlot = slot;
      snapshot({
        zh: `${key} 落入槽 ${slot}`,
        en: `${key} placed at slot ${slot}`,
      });
      curHash = -1;
    },
  };

  doubleHashing(input, size, hooks);

  rec
    .begin({
      zh: `插入完成（负载因子 ${input.length}/${size} = ${(input.length / size).toFixed(2)}）`,
      en: `Insert done (load factor ${input.length}/${size} = ${(input.length / size).toFixed(2)})`,
    })
    .setArray(
      slots.map((s) => (s === null ? -1 : s)),
      slots.map((s) => (s === null ? 'default' : 'final')),
      [],
    )
    .commit();

  return rec.build();
}
