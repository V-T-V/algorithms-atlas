// =============================================================================
// LFU 缓存 · 录制帧序列
// 用 setArray 展示缓存条目（按频率升序排列），用 setAux 展示频率桶。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LFUCache, type LfuHooks } from './impl.ts';

/** 演示输入：容量 2，展示频率提升 + 同频 LRU 淘汰。 */
export const DEFAULT_INPUT = {
  capacity: 2,
  steps: [
    { op: 'put', key: 'A', value: 1 }, // A: freq1
    { op: 'put', key: 'B', value: 2 }, // B: freq1
    { op: 'get', key: 'A' }, // A: freq2
    { op: 'put', key: 'C', value: 3 }, // 淘汰 B（freq1，比 A 小）
    { op: 'get', key: 'B' }, // 未命中
    { op: 'put', key: 'A', value: 9 }, // A 更新 freq3
  ],
};

type Step = (typeof DEFAULT_INPUT.steps)[number];

/** 录制演示帧序列。 */
export function buildTrace(
  input: { capacity: number; steps: readonly Step[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const cache = new LFUCache<string, number>(input.capacity);

  let hitKey: string | null = null;
  let missKey: string | null = null;
  let evictedKey: string | null = null;
  let evictedFreq = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    // 按 (freq 升序, 插入顺序) 排列展示
    const items = cache.entries().sort((a, b) => a.freq - b.freq);
    const values = items.map((e) => e.value);
    const roles: BarRole[] = items.map((e) => {
      if (e.key === hitKey) return 'final';
      if (e.key === missKey) return 'warn';
      return 'default';
    });
    rec.begin(note);
    rec.setArray(
      values,
      roles,
      items.map((e, i) => ({ index: i, label: `${e.key}·f${e.freq}` })),
    );
    rec.setAux([
      { label: '容量', value: String(input.capacity), role: 'default' },
      { label: '最小频率', value: String(cache.minFrequency), role: 'compare' },
      evictedKey
        ? { label: '淘汰', value: `${evictedKey}(f${evictedFreq})`, role: 'warn' as BarRole }
        : { label: '淘汰', value: '-', role: 'default' as BarRole },
    ]);
    rec.commit();
    hitKey = null;
    missKey = null;
    evictedKey = null;
    evictedFreq = 0;
  };

  snapshot({ zh: `空缓存，容量 ${input.capacity}`, en: `Empty cache, capacity ${input.capacity}` });

  const hooks: LfuHooks<string, number> = {
    onHit: (k) => {
      hitKey = k;
    },
    onMiss: (k) => {
      missKey = k;
    },
    onEvict: (k, _v, freq) => {
      evictedKey = k;
      evictedFreq = freq;
    },
    onPut: () => {
      /* snapshot 展示 */
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
        snapshot({ zh: `get(${step.key}) → 未命中`, en: `get(${step.key}) → miss` });
      } else {
        snapshot({
          zh: `get(${step.key}) → ${val}（频率提升）`,
          en: `get(${step.key}) → ${val} (freq bumped)`,
        });
      }
    }
  }

  // 终态
  const finalItems = cache.entries().sort((a, b) => a.freq - b.freq);
  rec
    .begin({
      zh: `完成；缓存：[${finalItems.map((e) => `${e.key}:f${e.freq}`).join(', ')}]`,
      en: `Done; cache: [${finalItems.map((e) => `${e.key}:f${e.freq}`).join(', ')}]`,
    })
    .setArray(
      finalItems.map((e) => e.value),
      finalItems.map(() => 'final' as BarRole),
      finalItems.map((e, i) => ({ index: i, label: `${e.key}·f${e.freq}` })),
    )
    .commit();

  return rec.build();
}
