// =============================================================================
// 混沌密码 Chaocipher · 纯算法实现
// 经典简化版（Lubkin / Byrne 还原）：
//  - 两个字母表（明文 left / 密文 right）。
//  - 加密一个字符：
//    1. 在 right 表中找明文字符下标 i（Chaocipher 约定以 right 表定位）。
//       （标准约定：明文字母在 LEFT 表中的位置 i，密文取 RIGHT[i]）
//    2. 取密文 = right[i]。
//    3. 把 left 表首字母旋转到位置 0 后整体左移（zenith=0），把位置 1..13 整体循环左移一位。
//    4. 对 right 表做类似但以 nadir=13 为支点的旋转。
//  这里采用广泛流传的"左移1位+中间段左移"版本。
// =============================================================================
const ZENITH = 0;
const NADIR = 13;

export interface ChaocipherHooks {
  onState?: (i: number, left: string, right: string) => void;
  onChar?: (i: number, plain: string, cipher: string) => void;
}

/** 旋转 left 表：把表视为首字母在 zenith，整体左移 1 位，再把 [1..13] 段循环左移一位。 */
function permuteLeft(l: string[]): string[] {
  const arr = [...l];
  // 把第一个字符放到末尾（整体左移1）
  const first = arr.shift()!;
  arr.push(first);
  // 取出 [1..13]（即索引 1..12）做循环左移一位
  const seg = arr.splice(1, 12);
  if (seg.length > 0) {
    const head = seg.shift()!;
    seg.push(head);
  }
  arr.splice(1, 0, ...seg);
  return arr;
}

/** 旋转 right 表：以 nadir 为支点，整体左移到让 nadir 字母到末尾附近，再循环中间段。 */
function permuteRight(r: string[]): string[] {
  const arr = [...r];
  // 左移 1 位
  const first = arr.shift()!;
  arr.push(first);
  // 取出 [NADIR..end]（索引 13..25）做循环左移一位
  const seg = arr.splice(NADIR, arr.length - NADIR);
  if (seg.length > 0) {
    const head = seg.shift()!;
    seg.push(head);
  }
  arr.splice(NADIR, 0, ...seg);
  return arr;
}

export function chaocipherEncrypt(
  text: string,
  leftInit = 'HXUCZVAMDSLKPEFJRIGTWOBNYQ',
  rightInit = 'PTLNBQDEOYSFAVZKGJRIHWXUMC',
  hooks: ChaocipherHooks = {},
): string {
  let left = leftInit.toUpperCase().split('');
  let right = rightInit.toUpperCase().split('');
  if (left.length !== 26 || right.length !== 26) throw new Error('字母表长度必须为 26');
  hooks.onState?.(-1, left.join(''), right.join(''));
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const up = text[i]!.toUpperCase();
    const idx = left.indexOf(up);
    if (idx === -1) {
      out += text[i]!;
      continue;
    }
    const cipherCh = right[idx]!;
    out += cipherCh;
    hooks.onChar?.(i, text[i]!, cipherCh);
    left = permuteLeft(left);
    right = permuteRight(right);
    hooks.onState?.(i, left.join(''), right.join(''));
  }
  return out;
}

void ZENITH;
