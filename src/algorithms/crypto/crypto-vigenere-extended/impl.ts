// =============================================================================
// 扩展维吉尼亚密码 · 纯算法实现
// 字符集 = A-Z(0..25) + 0-9(26..35)，共 36。
// =============================================================================
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const BASE = ALPHA.length; // 36

export interface VigenereExtHooks {
  onChar?: (i: number, plainCh: string, keyCh: string, cipherCh: string) => void;
}

function idx(ch: string): number | null {
  const i = ALPHA.indexOf(ch.toUpperCase());
  return i === -1 ? null : i;
}

export function vigenereExtendedEncrypt(
  text: string,
  key: string,
  hooks: VigenereExtHooks = {},
): string {
  if (key.length === 0) throw new Error('密钥不能为空');
  let out = '';
  let ki = 0;
  for (let i = 0; i < text.length; i++) {
    const pi = idx(text[i]!);
    if (pi === null) {
      out += text[i]!;
      continue;
    }
    const kch = key[ki % key.length]!;
    const kIdx = idx(kch);
    if (kIdx === null) throw new Error(`密钥含非法字符: ${kch}`);
    const ci = (pi + kIdx) % BASE;
    const cch = ALPHA[ci]!;
    out += cch;
    hooks.onChar?.(i, text[i]!, kch, cch);
    ki++;
  }
  return out;
}

export function vigenereExtendedDecrypt(
  text: string,
  key: string,
  hooks: VigenereExtHooks = {},
): string {
  if (key.length === 0) throw new Error('密钥不能为空');
  let out = '';
  let ki = 0;
  for (let i = 0; i < text.length; i++) {
    const ci = idx(text[i]!);
    if (ci === null) {
      out += text[i]!;
      continue;
    }
    const kch = key[ki % key.length]!;
    const kIdx = idx(kch);
    if (kIdx === null) throw new Error(`密钥含非法字符: ${kch}`);
    const pi = (((ci - kIdx) % BASE) + BASE) % BASE;
    out += ALPHA[pi]!;
    hooks.onChar?.(i, text[i]!, kch, ALPHA[pi]!);
    ki++;
  }
  return out;
}
