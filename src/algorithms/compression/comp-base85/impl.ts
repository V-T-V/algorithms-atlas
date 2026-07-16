export interface B85Hooks {
  onBlock?: (chars: string) => void;
}
export function ascii85Encode(bytes: number[], hooks: B85Hooks = {}): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 4) {
    let n = 0;
    let cnt = 0;
    for (let k = 0; k < 4; k++) {
      n = n * 256 + (bytes[i + k] ?? 0);
      if (i + k < bytes.length) cnt++;
    }
    const chars: string[] = [];
    for (let k = 0; k < 5; k++) {
      chars.unshift(ALPHA85[n % 85]!);
      n = Math.floor(n / 85);
    }
    out += chars.slice(0, cnt + 1).join('');
    hooks.onBlock?.(chars.join(''));
  }
  return out;
}
const ALPHA85 = Array.from({ length: 85 }, (_, i) => String.fromCharCode(33 + i)).join('');
