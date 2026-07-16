// =============================================================================
// LRU 缓存 · 录制帧序列
// 用 setArray 展示缓存槽（最旧→最新顺序），用指针标出最近 / 最久未用。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LRUCache, type LruHooks } from './impl.ts';

/** 演示输入：容量 2，若干 put/get 展示命中、淘汰、更新位置。 */
export const DEFAULT_INPUT = {
  capacity: 2,
  steps: [
    { op: 'put', key: 'A', value: 1 },
    { op: 'put', key: 'B', value: 2 },
    { op: 'get', key: 'A' }, // 命中 A，A 提到最新
    { op: 'put', key: 'C', value: 3 }, // 淘汰 B（最久未用）
    { op: 'get', key: 'B' }, // 未命中
    { op: 'put', key: 'D', value: 4 }, // 淘汰 A
    { op: 'get', key: 'A' }, // 未命中
  ],
};

type Step = (typeof DEFAULT_INPUT.steps)[number];

/** 录制演示帧序列。 */
export function buildTrace(
  input: { capacity: number; steps: readonly Step[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const cache = new LRUCache<string, number>(input.capacity);

  // 当前热点：刚 put/get 的 key（标 final），被淘汰的 key（标 warn）
  let hitKey: string | null = null;
  let evictedKey: string | null = null;
  let missKey: string | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const entries = cache.entries();
    const values = entries.map((e) => e.value);
    const roles: BarRole[] = entries.map((e) => {
      if (e.key === hitKey) return 'final';
      if (e.key === missKey) return 'warn';
      return 'default';
    });
    const _labels = entries.map((e) => String(e.key));
    const pointers: Array<{ index: number; label: string }> = [];
    if (entries.length > 0) {
      // 最旧在最左（index 0），最新在最右
      pointers.push({ index: 0, label: '最久未用' });
      pointers.push({ index: entries.length - 1, label: '最近使用' });
    }
    rec.begin(note);
    rec.setArray(values, roles, pointers);
    rec.setAux([
      { label: '容量', value: String(input.capacity), role: 'default' },
      { label: '已用', value: String(cache.size), role: 'default' },
      evictedKey
        ? { label: '淘汰', value: evictedKey, role: 'warn' as BarRole }
        : { label: '淘汰', value: '-', role: 'default' as BarRole },
    ]);
    rec.commit();
    hitKey = null;
    evictedKey = null;
    missKey = null;
  };

  snapshot({ zh: `空缓存，容量 ${input.capacity}`, en: `Empty cache, capacity ${input.capacity}` });

  const hooks: LruHooks<string, number> = {
    onHit: (key) => {
      hitKey = key;
    },
    onMiss: (key) => {
      missKey = key;
    },
    onEvict: (key) => {
      evictedKey = key;
    },
    onPut: () => {
      /* 由 snapshot 统一展示 */
    },
  };

  for (const step of input.steps) {
    if (step.op === 'put') {
      cache.put(step.key, step.value!, hooks);
      snapshot({
        zh: `put(${step.key}, ${step.value})${evictedKey ? ` → 淘汰 ${evictedKey}` : ''}`,
        en: `put(${step.key}, ${step.value})${evictedKey ? ` → evict ${evictedKey}` : ''}`,
      });
    } else {
      const val = cache.get(step.key, hooks);
      if (val === undefined) {
        snapshot({
          zh: `get(${step.key}) → 未命中`,
          en: `get(${step.key}) → miss`,
        });
      } else {
        snapshot({
          zh: `get(${step.key}) → ${val}（命中，提为最新）`,
          en: `get(${step.key}) → ${val} (hit, moved to front)`,
        });
      }
    }
  }

  // 终态
  const finalEntries = cache.entries();
  rec
    .begin({
      zh: `完成；缓存（旧→新）：[${finalEntries.map((e) => e.key).join(', ')}]`,
      en: `Done; cache (old→new): [${finalEntries.map((e) => e.key).join(', ')}]`,
    })
    .setArray(
      finalEntries.map((e) => e.value),
      finalEntries.map(() => 'final' as BarRole),
      finalEntries.length
        ? [
            { index: 0, label: '最久未用' },
            { index: finalEntries.length - 1, label: '最近使用' },
          ]
        : [],
    )
    .commit();

  return rec.build();
}
