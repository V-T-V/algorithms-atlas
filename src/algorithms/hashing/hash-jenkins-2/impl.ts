// Jenkins One-at-a-Time 32-bit · 实现
const MASK32 = 0xffffffff;
export interface JenkinsHooks {
  onOctet?: (i: number, byte: number, hash: number) => void;
  onResult?: (hash: number) => void;
}
export function hashJenkins2(data: string | readonly number[], hooks: JenkinsHooks = {}): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let hash = 0;
  for (let i = 0; i < bytes.length; i++) {
    hash = (hash + bytes[i]!) & MASK32;
    hash = (hash + (hash << 10)) & MASK32;
    hash = (hash ^ (hash >>> 6)) & MASK32;
    hooks.onOctet?.(i, bytes[i]!, hash);
  }
  hash = (hash + (hash << 3)) & MASK32;
  hash = (hash ^ (hash >>> 11)) & MASK32;
  hash = (hash + (hash << 15)) & MASK32;
  hooks.onResult?.(hash >>> 0);
  return hash >>> 0;
}
