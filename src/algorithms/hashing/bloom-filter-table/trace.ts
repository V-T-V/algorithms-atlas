// =============================================================================
// 布隆过滤器 · 录制帧序列
// 用 setArray 展示位数组（0/1），role 标 新置位/已置位/检查命中/检查未命中。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bloomFilter, BloomFilter, type BloomFilterHooks } from './impl.ts';

export const DEFAULT_INPUT: { keys: string[]; queries: string[]; size: number; hashCount: number } =
  {
    keys: ['apple', 'banana', 'cherry'],
    // 查询里混入已插入与未插入项，演示「真阳」「可能假阳」「真阴」
    queries: ['apple', 'grape', 'banana', 'xyz'],
    size: 16,
    hashCount: 3,
  };

/** 把位数组渲染为 values(0/1) + roles。 */
function render(
  bf: BloomFilter,
  currentBits: Set<number>,
  checkBits: Map<number, boolean>,
): { values: number[]; roles: BarRole[] } {
  const values = bf.bits.map((b) => (b ? 1 : 0));
  const roles: BarRole[] = bf.bits.map(() => 'default');
  // 已置位
  for (let i = 0; i < bf.size; i++) {
    if (bf.bits[i]) roles[i] = 'final';
  }
  // 检查中的位
  for (const [bit, isSet] of checkBits) {
    roles[bit] = isSet ? 'compare' : 'warn';
  }
  // 当前 add 置位的位
  for (const bit of currentBits) roles[bit] = 'swap';
  return { values, roles };
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    keys: string[];
    queries: string[];
    size: number;
    hashCount: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { keys, queries, size, hashCount } = input;
  const bf = new BloomFilter(size, hashCount);
  let currentBits = new Set<number>();
  let checkBits = new Map<number, boolean>();

  const snapshot = (note: { zh: string; en: string }): void => {
    const { values, roles } = render(bf, currentBits, checkBits);
    const pointers: Array<{ index: number; label: string }> = [];
    for (const bit of currentBits) pointers.push({ index: bit, label: 'set' });
    for (const bit of checkBits.keys()) {
      if (!pointers.some((p) => p.index === bit)) pointers.push({ index: bit, label: 'chk' });
    }
    rec.begin(note).setArray(values, roles, pointers).commit();
    currentBits = new Set();
    checkBits = new Map();
  };

  snapshot({
    zh: `位数组大小 m=${size}，哈希函数 k=${hashCount}。先插入：${keys.join(', ')}`,
    en: `Bit array m=${size}, hash functions k=${hashCount}. First insert: ${keys.join(', ')}`,
  });

  // —— 插入阶段 ——
  const addHooks: BloomFilterHooks = {
    onSet: (bit, already) => {
      currentBits.add(bit);
      if (!already) {
        snapshot({
          zh: `置位 bit[${bit}] = 1`,
          en: `Set bit[${bit}] = 1`,
        });
      }
    },
    onAdd: (key) => {
      snapshot({
        zh: `插入 "${key}" 完成`,
        en: `Insert "${key}" done`,
      });
    },
  };
  bloomFilter(keys, size, hashCount, addHooks);

  // —— 查询阶段 ——
  snapshot({
    zh: `开始查询：${queries.join(', ')}`,
    en: `Start querying: ${queries.join(', ')}`,
  });

  for (const q of queries) {
    const isMember = keys.includes(q);
    const result = bf.contains(q, {
      onCheck: (bit, isSet) => {
        checkBits.set(bit, isSet);
        if (!isSet) {
          snapshot({
            zh: `查 "${q}"：bit[${bit}]=0 → 一定不在`,
            en: `Query "${q}": bit[${bit}]=0 → definitely absent`,
          });
        }
      },
      onResult: (key, maybe) => {
        snapshot({
          zh: `查 "${key}"：所有位=1 → ${
            maybe ? '可能在（可能假阳性）' : '不在'
          }（实际${isMember ? '已插入' : '未插入'}）`,
          en: `Query "${key}": all bits=1 → ${
            maybe ? 'maybe present (possible false positive)' : 'absent'
          } (actually ${isMember ? 'inserted' : 'not inserted'})`,
        });
      },
    });
    void result;
  }

  // 终态
  const setCount = bf.countSetBits();
  rec
    .begin({
      zh: `完成。置位 ${setCount}/${size}（填充率 ${((setCount / size) * 100).toFixed(0)}%）`,
      en: `Done. ${setCount}/${size} bits set (fill rate ${((setCount / size) * 100).toFixed(0)}%)`,
    })
    .setArray(
      bf.bits.map((b) => (b ? 1 : 0)),
      bf.bits.map((b) => (b ? 'final' : 'default')),
      [],
    )
    .commit();

  return rec.build();
}
