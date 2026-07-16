// =============================================================================
// RC4流密码（RC4）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface Rc4Hooks {
  onKsaStep?: (i: number, j: number, s: number[]) => void;
  onPrgaStep?: (n: number, i: number, j: number, keyByte: number) => void;
}

export interface Rc4Result {
  /** 密文字节（与明文等长）。 */
  bytes: number[];
}

/** KSA：用密钥初始化 256 字节状态数组 S。 */
function ksa(key: number[], hooks: Rc4Hooks = {}): number[] {
  const S = Array.from({ length: 256 }, (_, i) => i);
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i]! + key[i % key.length]!) & 0xff;
    [S[i], S[j]] = [S[j]!, S[i]!];
    hooks.onKsaStep?.(i, j, [...S]);
  }
  return S;
}

/**
 * RC4：对称流密码。
 * 1. KSA：用密钥打乱 0~255 的 S 盒
 * 2. PRGA：从 S 盒持续生成密钥流，与明文逐字节异或
 * @param input 明文字节
 * @param key 密钥字节
 * @param hooks 可选的事件钩子
 */
export function rc4(
  input: number[],
  key: number[] = [1, 2, 3, 4, 5],
  hooks: Rc4Hooks = {},
): Rc4Result {
  if (key.length === 0) throw new Error('RC4 密钥不能为空');
  const S = ksa(key, hooks);
  let i = 0;
  let j = 0;
  const out: number[] = [];
  for (let n = 0; n < input.length; n++) {
    i = (i + 1) & 0xff;
    j = (j + S[i]!) & 0xff;
    [S[i], S[j]] = [S[j]!, S[i]!];
    const k = S[(S[i]! + S[j]!) & 0xff]!;
    const c = (input[n]! ^ k) & 0xff;
    out.push(c);
    hooks.onPrgaStep?.(n, i, j, k);
  }
  return { bytes: out };
}
