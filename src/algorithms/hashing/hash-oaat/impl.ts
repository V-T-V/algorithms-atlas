// Jenkins One-At-A-Time · 实现
export interface OaatHooks {
  onByte?: (i: number, byte: number, h: number) => void;
  onConclude?: (hash: number) => void;
}
export function oaatHash(data: string, hooks: OaatHooks = {}): number {
  let h = 0;
  for (let i = 0; i < data.length; i++) {
    h += data.charCodeAt(i);
    h += h << 10;
    h ^= h >>> 6;
    hooks.onByte?.(i, data.charCodeAt(i), h >>> 0);
  }
  h += h << 3;
  h ^= h >>> 11;
  h += h << 15;
  hooks.onConclude?.(h >>> 0);
  return h >>> 0;
}
