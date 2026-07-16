// =============================================================================
// 开放寻址哈希表 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { OpenHashMap, type OpenHashMapHooks } from './impl.ts';

export const DEFAULT_INPUT: { ops: Array<{ k: string; v: number }>; probes: string[] } = {
  ops: [
    { k: 'apple', v: 1 },
    { k: 'banana', v: 2 },
    { k: 'cherry', v: 3 },
    { k: 'date', v: 4 },
    { k: 'apple', v: 10 }, // 覆盖
  ],
  probes: ['banana', 'cherry', 'grape'],
};

export function buildTrace(
  input: { ops: Array<{ k: string; v: number }>; probes: string[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { ops, probes } = input;

  rec
    .begin({
      zh: `开放寻址哈希表：插入 ${ops.length} 项`,
      en: `Open-addressing map: insert ${ops.length} entries`,
    })
    .setAux([{ label: '初始容量', value: '8', role: 'frontier' }])
    .commit();

  const hooks: OpenHashMapHooks = {
    onInsert: (idx, key) => {
      rec
        .begin({ zh: `插入槽 ${idx} ← "${key}"`, en: `Insert slot ${idx} ← "${key}"` })
        .setAux([{ label: '插入', value: `slot${idx}:${key}`, role: 'final' }])
        .commit();
    },
    onProbe: (idx, key) => {
      rec
        .begin({
          zh: `探测槽 ${idx}（查 "${key}"）`,
          en: `Probe slot ${idx} (looking for "${key}")`,
        })
        .setAux([{ label: '探测', value: String(idx), role: 'compare' }])
        .commit();
    },
    onResize: (oldCap, newCap) => {
      rec
        .begin({ zh: `扩容 ${oldCap} → ${newCap}`, en: `Resize ${oldCap} → ${newCap}` })
        .setAux([{ label: '扩容', value: `${oldCap}→${newCap}`, role: 'warn' }])
        .commit();
    },
    onDelete: (idx) => {
      rec
        .begin({ zh: `删除槽 ${idx}（标记墓碑）`, en: `Delete slot ${idx} (tombstone)` })
        .setAux([{ label: '删除', value: String(idx), role: 'warn' }])
        .commit();
    },
  };

  const map = new OpenHashMap(8, hooks);
  for (const { k, v } of ops) map.put(k, v);
  rec
    .begin({ zh: `插入完成，size=${map.length}`, en: `Inserts done, size=${map.length}` })
    .setAux([{ label: 'size', value: String(map.length), role: 'final' }])
    .commit();

  for (const key of probes) {
    const v = map.get(key);
    rec
      .begin({
        zh: `get("${key}") = ${v === undefined ? '(无)' : v}`,
        en: `get("${key}") = ${v === undefined ? '(none)' : v}`,
      })
      .setAux([
        {
          label: key,
          value: v === undefined ? '无' : String(v),
          role: v === undefined ? 'warn' : 'final',
        },
      ])
      .commit();
  }

  return rec.build();
}
