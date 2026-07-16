// =============================================================================
// 布谷鸟过滤器（Cuckoo Filter）· 纯算法实现
// 每桶 B 个指纹槽；元素 x → 两桶 i1=hash(x), i2=i1 ⊕ hash(fp(x))。
// 通过「钩子」暴露每一步。零 DOM 依赖，可独立单测。
// =============================================================================

export type Rng = () => number;

/** 桶：数组，空槽为 0（指纹非零，0 表示空）。 */
export type Bucket = number[];

/** 算法执行过程中的事件钩子。任一可选。 */
export interface CuckooFilterHooks {
  onIndex?: (item: string, i1: number, i2: number, fp: number) => void;
  onInsert?: (bucket: number, slot: number, fp: number) => void;
  onKick?: (fromBucket: number, toBucket: number, fp: number) => void;
  onLookup?: (item: string, found: boolean) => void;
  onDelete?: (item: string, deleted: boolean) => void;
  onFail?: (item: string) => void;
}

export const FINGERPRINT_BITS = 8;
export const MAX_FINGERPRINT = 1 << FINGERPRINT_BITS; // 256，指纹 ∈ [1,255]
export const BUCKET_SIZE = 4;
export const KICK_LIMIT = 500;

/** 简单 32 位哈希（字符串 → 32 位无符号）。 */
export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 由 item 生成指纹（非零，∈ [1, MAX_FINGERPRINT)）。 */
export function fingerprint(item: string): number {
  const h = hashStr('fp:' + item);
  const fp = (h % (MAX_FINGERPRINT - 1)) + 1; // [1, 255]
  return fp;
}

/** 由指纹推导另一桶索引（部分键 cuckoo：altIndex = index ⊖ hash(fp)）。 */
export function altIndex(index: number, fp: number, numBuckets: number): number {
  const delta = (Math.imul(fp, 0x5bd1e995) >>> 0) % numBuckets;
  // 用 XOR；当 delta=0 时两桶相同（不应发生，fp≥1 且 numBuckets 足够大）
  const alt = (index ^ delta) % numBuckets;
  return (alt + numBuckets) % numBuckets;
}

/** 桶内查找指纹位置，找不到返回 -1。 */
function bucketIndex(bucket: Bucket, fp: number): number {
  for (let i = 0; i < bucket.length; i++) {
    if (bucket[i] === fp) return i;
  }
  return -1;
}

export interface CuckooFilter {
  buckets: Bucket[];
  numBuckets: number;
  count: number;
}

export function createFilter(numBuckets: number): CuckooFilter {
  const buckets: Bucket[] = [];
  for (let i = 0; i < numBuckets; i++) {
    buckets.push(new Array<number>(BUCKET_SIZE).fill(0));
  }
  return { buckets, numBuckets, count: 0 };
}

/** 插入元素。 */
export function add(
  filter: CuckooFilter,
  item: string,
  hooks: CuckooFilterHooks = {},
  rng: Rng = Math.random,
): boolean {
  const fp = fingerprint(item);
  const i1 = hashStr(item) % filter.numBuckets;
  const i2 = altIndex(i1, fp, filter.numBuckets);
  hooks.onIndex?.(item, i1, i2, fp);

  // 优先放入有空位的桶
  if (tryInsert(filter.buckets[i1]!, fp)) {
    filter.count++;
    hooks.onInsert?.(i1, -1, fp);
    return true;
  }
  if (tryInsert(filter.buckets[i2]!, fp)) {
    filter.count++;
    hooks.onInsert?.(i2, -1, fp);
    return true;
  }

  // 两桶满：随机踢出，循环
  let curBucket = rng() < 0.5 ? i1 : i2;
  let curFp = fp;
  for (let n = 0; n < KICK_LIMIT; n++) {
    const slot = Math.floor(rng() * BUCKET_SIZE);
    const evicted = filter.buckets[curBucket]![slot]!;
    filter.buckets[curBucket]![slot] = curFp;
    hooks.onKick?.(curBucket, altIndex(curBucket, evicted, filter.numBuckets), evicted);
    curFp = evicted;
    curBucket = altIndex(curBucket, curFp, filter.numBuckets);
    if (tryInsert(filter.buckets[curBucket]!, curFp)) {
      filter.count++;
      hooks.onInsert?.(curBucket, -1, curFp);
      return true;
    }
  }
  hooks.onFail?.(item);
  return false;
}

/** 尝试把 fp 放入桶（找到空位），成功返回 true。 */
function tryInsert(bucket: Bucket, fp: number): boolean {
  for (let i = 0; i < bucket.length; i++) {
    if (bucket[i] === 0) {
      bucket[i] = fp;
      return true;
    }
  }
  return false;
}

/** 查询元素是否可能在集合中（无假阴性，可能假阳性）。 */
export function lookup(filter: CuckooFilter, item: string, hooks: CuckooFilterHooks = {}): boolean {
  const fp = fingerprint(item);
  const i1 = hashStr(item) % filter.numBuckets;
  const i2 = altIndex(i1, fp, filter.numBuckets);
  const found =
    bucketIndex(filter.buckets[i1]!, fp) >= 0 || bucketIndex(filter.buckets[i2]!, fp) >= 0;
  hooks.onLookup?.(item, found);
  return found;
}

/** 删除元素（若存在）。注意：若因假阳性删除了他元素，会引入假阴性。 */
export function remove(filter: CuckooFilter, item: string, hooks: CuckooFilterHooks = {}): boolean {
  const fp = fingerprint(item);
  const i1 = hashStr(item) % filter.numBuckets;
  const i2 = altIndex(i1, fp, filter.numBuckets);
  const idx1 = bucketIndex(filter.buckets[i1]!, fp);
  if (idx1 >= 0) {
    filter.buckets[i1]![idx1] = 0;
    filter.count--;
    hooks.onDelete?.(item, true);
    return true;
  }
  const idx2 = bucketIndex(filter.buckets[i2]!, fp);
  if (idx2 >= 0) {
    filter.buckets[i2]![idx2] = 0;
    filter.count--;
    hooks.onDelete?.(item, true);
    return true;
  }
  hooks.onDelete?.(item, false);
  return false;
}

/** 批量插入便捷函数。返回过滤器与失败的元素。 */
export function buildFilter(
  items: readonly string[],
  numBuckets: number,
  hooks: CuckooFilterHooks = {},
  rng: Rng = Math.random,
): { filter: CuckooFilter; failed: string[] } {
  const filter = createFilter(numBuckets);
  const failed: string[] = [];
  for (const it of items) {
    if (!add(filter, it, hooks, rng)) failed.push(it);
  }
  return { filter, failed };
}
