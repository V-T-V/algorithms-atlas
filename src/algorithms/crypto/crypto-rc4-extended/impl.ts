// =============================================================================
// 扩展 RC4 流密码 · 纯算法实现（教学版）
// =============================================================================
const N = 256;

export interface Rc4Hooks {
  onKsa?: (i: number, s: number[]) => void;
  onPrga?: (step: number, keyByte: number) => void;
  onByte?: (i: number, plainByte: number, cipherByte: number) => void;
}

/** KSA：用密钥初始化 S-盒。 */
function ksa(key: Uint8Array, hooks?: Rc4Hooks['onKsa']): number[] {
  const s = Array.from({ length: N }, (_, i) => i);
  let j = 0;
  for (let i = 0; i < N; i++) {
    j = (j + s[i]! + key[i % key.length]!) % N;
    [s[i]!, s[j]!] = [s[j]!, s[i]!];
    hooks?.(i, s);
  }
  return s;
}

/** 加密/解密同一函数（流密码对称）。返回字节数组。 */
export function rc4Process(data: Uint8Array, key: Uint8Array, hooks: Rc4Hooks = {}): Uint8Array {
  const s = ksa(key, hooks.onKsa);
  let i = 0;
  let j = 0;
  const out = new Uint8Array(data.length);
  for (let k = 0; k < data.length; k++) {
    i = (i + 1) % N;
    j = (j + s[i]!) % N;
    [s[i]!, s[j]!] = [s[j]!, s[i]!];
    const keyByte = s[(s[i]! + s[j]!) % N]!;
    hooks.onPrga?.(k, keyByte);
    const cb = data[k]! ^ keyByte;
    out[k] = cb;
    hooks.onByte?.(k, data[k]!, cb);
  }
  return out;
}

/** 字符串便捷封装。 */
export function rc4EncryptText(text: string, key: string, hooks: Rc4Hooks = {}): Uint8Array {
  return rc4Process(new TextEncoder().encode(text), new TextEncoder().encode(key), hooks);
}
