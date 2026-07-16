// 完美哈希 (简化二级) · 实现
export interface PhHooks {
  onBucket?: (bucket: number, keys: string[]) => void;
  onPlace?: (key: string, slot: number) => void;
  onConclude?: (size: number) => void;
}
export function perfectHashBuild(
  keys: readonly string[],
  hooks: PhHooks = {},
): { slot: Map<string, number>; size: number } {
  const n = keys.length;
  const buckets = new Map<number, string[]>();
  const h1 = (k: string) => {
    let h = 0;
    for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0;
    return h % n;
  };
  for (const k of keys) {
    const b = h1(k);
    if (!buckets.has(b)) buckets.set(b, []);
    buckets.get(b)!.push(k);
  }
  const slot = new Map<string, number>();
  let size = 0;
  for (const [b, ks] of buckets) {
    hooks.onBucket?.(b, ks);
    // 找 salt 使 ks 在 size..size+len 内无冲突
    let salt = 0;
    const used = new Set<number>();
    while (used.size < ks.length) {
      used.clear();
      salt++;
      let ok = true;
      for (const k of ks) {
        const s = size + (h1(k + salt) % (ks.length + 1));
        if (used.has(s)) {
          ok = false;
          break;
        }
        used.add(s);
      }
      if (ok) break;
    }
    for (const k of ks) {
      const s = size + (h1(k + (salt || 1)) % (ks.length + 1));
      slot.set(k, s);
      hooks.onPlace?.(k, s);
    }
    size += ks.length + 1;
  }
  hooks.onConclude?.(size);
  return { slot, size };
}
