// PJW ELF Hash · 实现
export interface PjwHooks {
  onByte?: (i: number, byte: number, h: number) => void;
  onConclude?: (hash: number) => void;
}
export function pjwHash(data: string, hooks: PjwHooks = {}): number {
  let h = 0,
    g;
  for (let i = 0; i < data.length; i++) {
    h = (h << 4) + data.charCodeAt(i);
    g = h & 0xf0000000;
    if (g !== 0) {
      h ^= g >>> 24;
      h &= ~g;
    }
    hooks.onByte?.(i, data.charCodeAt(i), h >>> 0);
  }
  hooks.onConclude?.(h >>> 0);
  return h >>> 0;
}
