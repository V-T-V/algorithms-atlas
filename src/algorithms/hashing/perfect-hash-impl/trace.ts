// =============================================================================
// 完美哈希（CHD 简化）· 录制帧序列
// 用 setAux 展示一级分桶与二级参数求解；setArray 展示最终槽位表。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { PerfectHash, type PerfectHashHooks } from './impl.ts';

export const DEFAULT_INPUT: { keys: string[] } = {
  keys: ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape'],
};

/** 录制演示帧序列。 */
export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { keys } = input;

  rec
    .begin({
      zh: `为 ${keys.length} 个固定键构造完美哈希：${keys.join(', ')}`,
      en: `Build perfect hash for ${keys.length} fixed keys: ${keys.join(', ')}`,
    })
    .setAux([
      { label: '键数 n', value: String(keys.length), role: 'pivot' as BarRole },
      { label: '桶数', value: String(Math.max(1, keys.length)), role: 'frontier' as BarRole },
      { label: '阶段', value: '一级分桶', role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: PerfectHashHooks = {
    onBuckets: (sizes) => {
      const nonEmpty = sizes.filter((s) => s > 0).length;
      const maxBucket = Math.max(...sizes);
      rec
        .begin({
          zh: `一级分桶：${sizes.length} 桶，非空 ${nonEmpty} 个，最大桶 ${maxBucket} 键`,
          en: `First-level buckets: ${sizes.length} buckets, ${nonEmpty} non-empty, max bucket ${maxBucket} keys`,
        })
        .setAux([
          { label: '非空桶数', value: String(nonEmpty), role: 'compare' as BarRole },
          { label: '最大桶', value: String(maxBucket), role: 'pivot' as BarRole },
          { label: '阶段', value: '一级分桶完成', role: 'frontier' as BarRole },
          ...sizes
            .map((s, i) => ({ s, i }))
            .filter((o) => o.s > 0)
            .slice(0, 6)
            .map((o) => ({
              label: `桶[${o.i}]`,
              value: String(o.s),
              role: 'default' as BarRole,
            })),
        ])
        .commit();
    },
    onBucketResolved: (bucketIndex, g, slotsUsed) => {
      rec
        .begin({
          zh: `桶[${bucketIndex}] 找到二级参数 g=${g}，占用槽位 [${slotsUsed.join(', ')}]`,
          en: `Bucket[${bucketIndex}] resolved with g=${g}, slots [${slotsUsed.join(', ')}]`,
        })
        .setAux([
          { label: '桶索引', value: String(bucketIndex), role: 'pivot' as BarRole },
          { label: '二级参数 g', value: String(g), role: 'compare' as BarRole },
          { label: '占用槽位', value: slotsUsed.join(', '), role: 'final' as BarRole },
          { label: '阶段', value: '二级求解', role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onResult: (keyToSlot, tableSize) => {
      const slots = new Array<number>(tableSize).fill(0);
      const roles: BarRole[] = new Array(tableSize).fill('default');
      for (const [k, s] of keyToSlot) {
        slots[s] = slots[s]! + 1;
        roles[s] = 'final';
        void k;
      }
      rec
        .begin({
          zh: `构造完成：${keyToSlot.size} 键无冲突映射到 ${tableSize} 槽表。查询仅需两次哈希。`,
          en: `Construction done: ${keyToSlot.size} keys map collision-free into a ${tableSize}-slot table. Lookup needs only two hashes.`,
        })
        .setArray(slots, roles, [])
        .setAux([
          {
            label: '槽位利用率',
            value: `${((keyToSlot.size / tableSize) * 100).toFixed(0)}%`,
            role: 'final' as BarRole,
          },
          { label: '键数', value: String(keyToSlot.size), role: 'default' as BarRole },
          { label: '表大小', value: String(tableSize), role: 'compare' as BarRole },
          { label: '冲突', value: '0（完美）', role: 'final' as BarRole },
        ])
        .commit();
    },
  };

  const ph = new PerfectHash(keys, 0x9e3779b9, hooks);

  // 终态：每个键 → 槽位
  const entries = keys.map((k) => ({
    label: `slot("${k}")`,
    value: String(ph.slotOf(k)),
    role: 'final' as BarRole,
  }));
  rec
    .begin({
      zh: `查询验证：每个键的槽位均唯一（无冲突）。`,
      en: `Lookup verification: each key's slot is unique (collision-free).`,
    })
    .setAux(entries)
    .commit();

  return rec.build();
}
