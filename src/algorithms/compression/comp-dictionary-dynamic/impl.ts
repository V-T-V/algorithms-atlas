// =============================================================================
// 动态字典压缩 (LZW 风格) · 纯算法实现
// =============================================================================

export interface DynDictHooks {
  onEmit?: (code: number, seq: string) => void;
  onLearn?: (code: number, seq: string) => void;
}

/** LZW 编码。 */
export function dynDictEncode(data: string, hooks: DynDictHooks = {}): number[] {
  const dict = new Map<string, number>();
  // 初始字典：所有单字节（用 charCode 作为码）
  let nextCode = 256;
  for (let i = 0; i < 256; i++) dict.set(String.fromCharCode(i), i);

  let w = '';
  const out: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const c = data[i]!;
    const wc = w + c;
    if (dict.has(wc)) {
      w = wc;
    } else {
      out.push(dict.get(w)!);
      hooks.onEmit?.(dict.get(w)!, w);
      dict.set(wc, nextCode);
      hooks.onLearn?.(nextCode, wc);
      nextCode++;
      w = c;
    }
  }
  if (w.length > 0) {
    out.push(dict.get(w)!);
    hooks.onEmit?.(dict.get(w)!, w);
  }
  return out;
}

/** LZW 解码。 */
export function dynDictDecode(codes: readonly number[]): string {
  const dict = new Map<number, string>();
  let nextCode = 256;
  for (let i = 0; i < 256; i++) dict.set(i, String.fromCharCode(i));

  if (codes.length === 0) return '';
  let w = dict.get(codes[0]!)!;
  let out = w;
  for (let i = 1; i < codes.length; i++) {
    const code = codes[i]!;
    let entry: string;
    if (dict.has(code)) {
      entry = dict.get(code)!;
    } else if (code === nextCode) {
      entry = w + w[0]!;
    } else {
      throw new Error(`非法码 ${code}`);
    }
    out += entry;
    dict.set(nextCode, w + entry[0]!);
    nextCode++;
    w = entry;
  }
  return out;
}
