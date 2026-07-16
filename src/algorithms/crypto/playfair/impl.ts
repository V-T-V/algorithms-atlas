// =============================================================================
// Playfair密码（Playfair Cipher）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 把密钥 + 字母表（去掉 J）去重组成 5×5 矩阵。 */
function buildMatrix(key: string): string[][] {
  const seen = new Set<string>();
  const flat: string[] = [];
  const push = (c: string): void => {
    const up = c === 'J' ? 'I' : c;
    if (up < 'A' || up > 'Z') return;
    if (!seen.has(up)) {
      seen.add(up);
      flat.push(up);
    }
  };
  for (const c of key.toUpperCase()) push(c);
  for (let c = 'A'.charCodeAt(0); c <= 'Z'.charCodeAt(0); c++) push(String.fromCharCode(c));
  const m: string[][] = [];
  for (let r = 0; r < 5; r++) m.push(flat.slice(r * 5, r * 5 + 5));
  return m;
}

function findPos(matrix: string[][], ch: string): [number, number] {
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (matrix[r]![c] === ch) return [r, c];
    }
  }
  return [-1, -1];
}

/** 把明文预处理成字母对：J→I，过长插入 X，相同字母对插入 X。 */
export function prepareText(text: string): string[] {
  const letters = text
    .toUpperCase()
    .replace(/J/g, 'I')
    .replace(/[^A-Z]/g, '')
    .split('');
  const pairs: string[] = [];
  let i = 0;
  while (i < letters.length) {
    const a = letters[i]!;
    const b = letters[i + 1];
    if (!b) {
      pairs.push(a + 'X');
      i += 1;
    } else if (a === b) {
      pairs.push(a + 'X');
      i += 1;
    } else {
      pairs.push(a + b);
      i += 2;
    }
  }
  return pairs;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PlayfairHooks {
  onPair?: (i: number, inPair: string, outPair: string) => void;
}

export interface PlayfairResult {
  /** 密文。 */
  text: string;
}

/**
 * Playfair 密码：5×5 矩阵上的双字母代换。
 * 规则：
 * - 同行：各右移 1（绕回）
 * - 同列：各下移 1（绕回）
 * - 矩形：同行另一列互换
 * @param text 明文
 * @param key 密钥（J 自动并入 I）
 * @param hooks 可选的事件钩子
 */
export function playfair(
  text: string,
  key: string = 'PLAYFAIR',
  hooks: PlayfairHooks = {},
): PlayfairResult {
  const matrix = buildMatrix(key);
  const pairs = prepareText(text);
  const out: string[] = [];

  for (let i = 0; i < pairs.length; i++) {
    const [a, b] = [pairs[i]![0]!, pairs[i]![1]!];
    const [ra, ca] = findPos(matrix, a);
    const [rb, cb] = findPos(matrix, b);
    let na: string;
    let nb: string;
    if (ra === rb) {
      // 同行：右移
      na = matrix[ra]![(ca + 1) % 5]!;
      nb = matrix[rb]![(cb + 1) % 5]!;
    } else if (ca === cb) {
      // 同列：下移
      na = matrix[(ra + 1) % 5]![ca]!;
      nb = matrix[(rb + 1) % 5]![cb]!;
    } else {
      // 矩形：互换列
      na = matrix[ra]![cb]!;
      nb = matrix[rb]![ca]!;
    }
    out.push(na, nb);
    hooks.onPair?.(i, pairs[i]!, na + nb);
  }

  return { text: out.join('') };
}
