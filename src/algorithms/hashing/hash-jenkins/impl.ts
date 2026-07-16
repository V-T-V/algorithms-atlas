// Jenkins one-at-a-time · 实现
export interface JenkinsHooks {
  onByte?: (i: number, c: number, hash: number) => void;
  onFinalize?: (hash: number) => void;
}

export function jenkins(data: string | readonly number[], hooks: JenkinsHooks = {}): number {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let hash = 0;
  for (let i = 0; i < bytes.length; i++) {
    const c = bytes[i]!;
    hash = (hash + c) >>> 0;
    hash = (hash + (hash << 10)) >>> 0;
    hash = (hash ^ (hash >>> 6)) >>> 0;
    hooks.onByte?.(i, c, hash);
  }
  hash = (hash + (hash << 3)) >>> 0;
  hash = (hash ^ (hash >>> 11)) >>> 0;
  hash = (hash + (hash << 15)) >>> 0;
  hooks.onFinalize?.(hash);
  return hash >>> 0;
}
