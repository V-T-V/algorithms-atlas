// =============================================================================
// 计数布隆过滤器 · 录制帧序列
// 用 setArray 展示计数器数组演化：插入→查询→删除→查询。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { CountingBloomFilter, type CountingBloomHooks } from './impl.ts';

export const DEFAULT_INPUT: {
  keys: string[];
  queries: string[];
  removeKeys: string[];
  size: number;
  hashCount: number;
} = {
  keys: ['apple', 'banana', 'cherry'],
  queries: ['apple', 'grape', 'banana'],
  removeKeys: ['banana'],
  size: 16,
  hashCount: 3,
};

function render(
  cbf: CountingBloomFilter,
  touchedSlots: Set<number>,
  checkSlots: Map<number, number>,
  opRole: BarRole,
): { values: number[]; roles: BarRole[] } {
  const values = [...cbf.counters];
  const roles: BarRole[] = cbf.counters.map(() => 'default');
  for (let i = 0; i < cbf.size; i++) {
    if (cbf.counters[i]! > 0) roles[i] = 'final';
  }
  for (const slot of checkSlots.keys()) {
    const c = checkSlots.get(slot)!;
    roles[slot] = c > 0 ? 'compare' : 'warn';
  }
  for (const slot of touchedSlots) {
    roles[slot] = opRole;
  }
  return { values, roles };
}

/** 录制演示帧序列。 */
export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { keys, queries, removeKeys, size, hashCount } = input;
  const cbf = new CountingBloomFilter(size, hashCount);
  let touched = new Set<number>();
  let checked = new Map<number, number>();

  const snapshot = (note: { zh: string; en: string }, opRole: BarRole): void => {
    const { values, roles } = render(cbf, touched, checked, opRole);
    const pointers: Array<{ index: number; label: string }> = [];
    for (const slot of touched) pointers.push({ index: slot, label: '±' });
    for (const slot of checked.keys()) {
      if (!pointers.some((p) => p.index === slot)) pointers.push({ index: slot, label: 'chk' });
    }
    rec
      .begin(note)
      .setArray(values, roles, pointers)
      .setAux([
        {
          label: '非零槽',
          value: `${cbf.countNonZero()}/${size}`,
          role: 'default' as BarRole,
        },
        {
          label: '计数总和',
          value: String(cbf.totalCount()),
          role: 'compare' as BarRole,
        },
      ])
      .commit();
    touched = new Set();
    checked = new Map();
  };

  snapshot(
    {
      zh: `初始化：${size} 个计数器全 0，k=${hashCount} 个哈希函数。开始插入：${keys.join(', ')}`,
      en: `Init: ${size} counters all 0, k=${hashCount} hash functions. Inserting: ${keys.join(', ')}`,
    },
    'default',
  );

  // —— 插入阶段 ——
  const addHooks: CountingBloomHooks = {
    onIncrement: (slot) => touched.add(slot),
    onResult: (key) =>
      snapshot({ zh: `插入 "${key}"：k 个槽各 +1`, en: `Insert "${key}": k slots +1` }, 'swap'),
  };
  for (const k of keys) cbf.add(k, addHooks);

  // —— 查询阶段 ——
  snapshot(
    {
      zh: `开始查询：${queries.join(', ')}`,
      en: `Start querying: ${queries.join(', ')}`,
    },
    'default',
  );

  for (const q of queries) {
    const isMember = keys.includes(q);
    cbf.contains(q, {
      onCheck: (slot, count) => {
        checked.set(slot, count);
      },
      onResult: (key, _op, maybe) => {
        snapshot(
          {
            zh: `查 "${key}"：${maybe ? '所有槽>0 → 可能在（可能假阳性）' : '存在 0 槽 → 一定不在'}（实际${
              isMember ? '已插入' : '未插入'
            }）`,
            en: `Query "${key}": ${maybe ? 'all slots>0 → maybe present' : 'a slot=0 → definitely absent'} (actually ${
              isMember ? 'inserted' : 'not inserted'
            })`,
          },
          'compare',
        );
      },
    });
  }

  // —— 删除阶段 ——
  snapshot(
    {
      zh: `开始删除：${removeKeys.join(', ')}`,
      en: `Start removing: ${removeKeys.join(', ')}`,
    },
    'default',
  );

  const removeHooks: CountingBloomHooks = {
    onDecrement: (slot) => touched.add(slot),
    onResult: (key) =>
      snapshot({ zh: `删除 "${key}"：k 个槽各 -1`, en: `Remove "${key}": k slots -1` }, 'warn'),
  };
  for (const k of removeKeys) cbf.remove(k, removeHooks);

  // —— 删除后查询 ——
  for (const q of removeKeys) {
    cbf.contains(q, {
      onResult: (key, _op, maybe) => {
        snapshot(
          {
            zh: `删除后查 "${key}"：${maybe ? '仍可能在（计数未清零）' : '已不在（计数清零）'}`,
            en: `Post-delete query "${key}": ${maybe ? 'still maybe present' : 'now absent'}`,
          },
          'compare',
        );
      },
    });
  }

  // 终态
  rec
    .begin({
      zh: `完成。非零槽 ${cbf.countNonZero()}/${size}，计数总和 ${cbf.totalCount()}。`,
      en: `Done. Non-zero slots ${cbf.countNonZero()}/${size}, total count ${cbf.totalCount()}.`,
    })
    .setArray(
      [...cbf.counters],
      cbf.counters.map((c) => (c > 0 ? 'final' : 'default') as BarRole),
      [],
    )
    .setAux([
      { label: '非零槽', value: `${cbf.countNonZero()}/${size}`, role: 'final' as BarRole },
      { label: '计数总和', value: String(cbf.totalCount()), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
