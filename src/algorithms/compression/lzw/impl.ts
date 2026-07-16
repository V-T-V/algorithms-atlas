// =============================================================================
// LZW 编码 Lempel-Ziv-Welch · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露字典构建/编码/解码每一步。
// =============================================================================

/** 初始字典大小：0..255 为单字节字符。 */
export const ALPHA_START = 256;

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface LzwHooks {
  /** 当前输入指针前移到位置 pos，前缀串 P 已在字典中。 */
  onAdvance?: (pos: number, p: string) => void;
  /** 字典新增条目：code → string（把 P + nextChar 加入字典）。 */
  onDictAdd?: (code: number, entry: string) => void;
  /** 输出一个码字 code（对应字典中的串）。 */
  onEmit?: (code: number, entry: string) => void;
}

export interface LzwResult {
  /** 编码后的码字序列。 */
  codes: number[];
  /** 最终字典（code → string）。 */
  dict: Map<number, string>;
}

/** 初始字典：0..255 → 单字符。 */
function initDict(): Map<number, string> {
  const dict = new Map<number, string>();
  for (let c = 0; c < ALPHA_START; c++) dict.set(c, String.fromCharCode(c));
  return dict;
}

/**
 * LZW 编码：把字符串压缩成码字序列。
 *
 * 步骤：\n
 * 1. 字典初始化为 256 个单字节字符（code 0..255）\n
 * 2. 维护当前串 P（初始为空）。扫描输入字符 c：\n
 *    - 若 P + c 在字典中，则 P ← P + c，继续\n
 *    - 否则输出 P 对应的码字，把 P + c 加入字典（分配新 code），再 P ← c\n
 * 3. 末尾输出 P 对应的码字\n
 *
 * @param input 输入字符串（字符码 0..255 为佳；超出也可，仅影响初字典是否复用）
 * @param hooks 可选事件钩子
 * @returns 码字序列与最终字典
 */
export function lzw(input: string, hooks: LzwHooks = {}): LzwResult {
  const dict = initDict();
  let nextCode = ALPHA_START;

  if (input.length === 0) {
    return { codes: [], dict };
  }

  const codes: number[] = [];
  // 反查字典：string → code
  const rev = new Map<string, number>();
  for (const [code, s] of dict) rev.set(s, code);

  let p = input[0]!;
  hooks.onAdvance?.(0, p);

  for (let i = 1; i < input.length; i++) {
    const c = input[i]!;
    const pc = p + c;
    if (rev.has(pc)) {
      p = pc;
      hooks.onAdvance?.(i, p);
    } else {
      // 输出 P 的码字
      const code = rev.get(p)!;
      codes.push(code);
      hooks.onEmit?.(code, p);
      // 把 P + c 加入字典
      dict.set(nextCode, pc);
      rev.set(pc, nextCode);
      hooks.onDictAdd?.(nextCode, pc);
      nextCode++;
      p = c;
      hooks.onAdvance?.(i, p);
    }
  }
  // 末尾输出
  const code = rev.get(p)!;
  codes.push(code);
  hooks.onEmit?.(code, p);

  return { codes, dict };
}

/**
 * LZW 解码：由码字序列还原字符串。
 * 仅依赖初始字典 + 编码时「输出即加入字典」的规则。
 */
export function lzwDecode(codes: number[]): string {
  if (codes.length === 0) return '';
  const dict = new Map<number, string>();
  for (let c = 0; c < ALPHA_START; c++) dict.set(c, String.fromCharCode(c));
  let nextCode = ALPHA_START;

  let prev = dict.get(codes[0]!)!;
  let out = prev;
  for (let k = 1; k < codes.length; k++) {
    const code = codes[k]!;
    let entry: string;
    if (dict.has(code)) {
      entry = dict.get(code)!;
    } else if (code === nextCode) {
      // 特殊情形：刚加入即被自身引用 → entry = prev + prev[0]
      entry = prev + prev[0]!;
    } else {
      throw new Error(`LZW 解码：码字 ${code} 越界`);
    }
    out += entry;
    dict.set(nextCode, prev + entry[0]!);
    nextCode++;
    prev = entry;
  }
  return out;
}
