// =============================================================================
// 布谷鸟过滤器 · 录制帧序列
// 用 setGrid 展示所有桶（行=桶，列=槽，值=指纹 hex）。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  add,
  lookup,
  remove,
  createFilter,
  altIndex,
  fingerprint,
  hashStr,
  BUCKET_SIZE,
  type CuckooFilter,
  type CuckooFilterHooks,
  type Rng,
} from './impl.ts';

export const DEFAULT_INPUT = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape'];
export const DEFAULT_BUCKETS = 8;

// 一个简单确定性 RNG（线性同余），用于可复现的踢出选择。
function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    return s / 0x100000000;
  };
}

function renderGrid(
  filter: CuckooFilter,
  highlightBuckets: Set<number>,
  kickBucket: number | null,
  placeBucket: number | null,
): Cell[][] {
  const header: Cell[] = [{ v: 'bucket', role: 'default' }];
  for (let s = 0; s < BUCKET_SIZE; s++) header.push({ v: `s${s}`, role: 'pivot' });
  const rows: Cell[][] = [header];
  for (let i = 0; i < filter.numBuckets; i++) {
    let role: BarRole = 'default';
    if (placeBucket === i) role = 'final';
    else if (kickBucket === i) role = 'swap';
    else if (highlightBuckets.has(i)) role = 'compare';
    const row: Cell[] = [{ v: `b${i}`, role }];
    for (let s = 0; s < BUCKET_SIZE; s++) {
      const fp = filter.buckets[i]![s]!;
      row.push({
        v: fp === 0 ? '·' : '0x' + fp.toString(16).padStart(2, '0'),
        role: fp === 0 ? 'default' : role,
      });
    }
    rows.push(row);
  }
  return rows;
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: string[] = DEFAULT_INPUT,
  numBuckets: number = DEFAULT_BUCKETS,
): Frame[] {
  const rec = new TraceRecorder();
  const filter = createFilter(numBuckets);
  const rng = makeRng(42);
  let highlightBuckets = new Set<number>();
  let kickBucket: number | null = null;
  let placeBucket: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid(filter, highlightBuckets, kickBucket, placeBucket))
      .setAux([
        { label: '桶数', value: String(numBuckets), role: 'pivot' as BarRole },
        { label: '桶容量', value: String(BUCKET_SIZE), role: 'pivot' as BarRole },
        { label: '已存元素', value: String(filter.count), role: 'default' as BarRole },
        { label: '指纹位数', value: '8', role: 'compare' as BarRole },
      ])
      .commit();
    highlightBuckets = new Set();
    kickBucket = null;
    placeBucket = null;
  };

  snapshot({
    zh: `布谷鸟过滤器：${numBuckets} 桶 × ${BUCKET_SIZE} 槽（8 位指纹）。插入：${input.join(', ')}`,
    en: `Cuckoo filter: ${numBuckets} buckets × ${BUCKET_SIZE} slots (8-bit fp). Insert: ${input.join(', ')}`,
  });

  const hooks: CuckooFilterHooks = {
    onIndex: (item, i1, i2, fp) => {
      highlightBuckets = new Set([i1, i2]);
      snapshot({
        zh: `插入 "${item}"：fp=0x${fp.toString(16)}，候选桶 ${i1} / ${i2}`,
        en: `Add "${item}": fp=0x${fp.toString(16)}, buckets ${i1} / ${i2}`,
      });
    },
    onInsert: (bucket) => {
      placeBucket = bucket;
      snapshot({
        zh: `指纹放入桶 ${bucket}`,
        en: `Fingerprint placed in bucket ${bucket}`,
      });
    },
    onKick: (fromBucket, toBucket, fp) => {
      kickBucket = fromBucket;
      highlightBuckets = new Set([fromBucket, toBucket]);
      snapshot({
        zh: `踢出指纹 0x${fp.toString(16)}：桶 ${fromBucket} → 候选桶 ${toBucket}`,
        en: `Kick fp 0x${fp.toString(16)}: bucket ${fromBucket} → candidate ${toBucket}`,
      });
    },
    onFail: (item) => {
      snapshot({
        zh: `插入 "${item}" 失败：达踢出上限`,
        en: `Add "${item}" failed: kick limit reached`,
      });
    },
  };

  for (const it of input) add(filter, it, hooks, rng);

  // 查询演示
  const queryItems = [input[0]!, 'not-exist'];
  for (const q of queryItems) {
    const found = lookup(filter, q);
    const fp = fingerprint(q);
    const i1 = hashStr(q) % filter.numBuckets;
    const i2 = altIndex(i1, fp, filter.numBuckets);
    highlightBuckets = new Set([i1, i2]);
    rec
      .begin({
        zh: found ? `查询 "${q}"：命中（桶 ${i1}/${i2} 含指纹）` : `查询 "${q}"：未命中`,
        en: found ? `Lookup "${q}": hit (bucket ${i1}/${i2} has fp)` : `Lookup "${q}": miss`,
      })
      .setGrid(renderGrid(filter, highlightBuckets, null, null))
      .setAux([
        { label: '查询', value: q, role: 'pivot' as BarRole },
        {
          label: '结果',
          value: found ? 'FOUND' : 'MISS',
          role: (found ? 'final' : 'warn') as BarRole,
        },
        { label: '已存元素', value: String(filter.count), role: 'default' as BarRole },
      ])
      .commit();
  }

  // 删除演示
  const delItem = input[0]!;
  const delFp = fingerprint(delItem);
  const di1 = hashStr(delItem) % filter.numBuckets;
  const di2 = altIndex(di1, delFp, filter.numBuckets);
  highlightBuckets = new Set([di1, di2]);
  remove(filter, delItem);
  rec
    .begin({
      zh: `删除 "${delItem}"（从桶 ${di1}/${di2} 移除指纹）`,
      en: `Delete "${delItem}" (remove fp from bucket ${di1}/${di2})`,
    })
    .setGrid(renderGrid(filter, highlightBuckets, null, null))
    .setAux([
      { label: '删除', value: delItem, role: 'swap' as BarRole },
      {
        label: '删除后查询',
        value: lookup(filter, delItem) ? '仍 FOUND（假阳或他元素）' : 'MISS',
        role: 'warn' as BarRole,
      },
      { label: '已存元素', value: String(filter.count), role: 'default' as BarRole },
    ])
    .commit();

  // 终态
  rec
    .begin({
      zh: `完成：过滤器存 ${filter.count} 元素`,
      en: `Done: filter holds ${filter.count} items`,
    })
    .setGrid(renderGrid(filter, new Set(), null, null))
    .setAux([
      { label: '已存元素', value: String(filter.count), role: 'final' as BarRole },
      { label: '桶数', value: String(numBuckets), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}

export { fingerprint, altIndex };
