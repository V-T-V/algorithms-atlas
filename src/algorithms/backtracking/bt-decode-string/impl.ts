export interface DsHooks {
  onBlock?: (repeat: number, inner: string) => void;
  onResult?: (s: string) => void;
}
export function decodeString(s: string, hooks: DsHooks = {}): string {
  let i = 0;
  const decode = (): string => {
    let out = '';
    while (i < s.length && s[i] !== ']') {
      if (s[i]! >= '0' && s[i]! <= '9') {
        let num = 0;
        while (s[i]! >= '0' && s[i]! <= '9') {
          num = num * 10 + Number(s[i]!);
          i++;
        }
        i++; // '['
        const inner = decode();
        hooks.onBlock?.(num, inner);
        out += inner.repeat(num);
        i++; // ']'
      } else {
        out += s[i]!;
        i++;
      }
    }
    return out;
  };
  const r = decode();
  hooks.onResult?.(r);
  return r;
}
