// =============================================================================
// Move-To-Front（MTF）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MtfHooks {
  onEncode?: (symbol: number, idx: number) => void;
  onMove?: (symbol: number) => void;
}

export interface MtfResult {
  /** MTF 编码后的索引序列。 */
  encoded: number[];
  /** 使用的符号表（编码后状态）。 */
  table: number[];
}

/**
 * Move-To-Front：维护一个符号表，每次编码输出当前符号的下标，
 * 并把该符号移到表头（增加局部性，常与 BWT 连用）。
 * @param symbols 输入符号序列（值 0~255）
 * @param tableSize 符号表大小（默认 256）
 * @param hooks 可选的事件钩子
 */
export function mtf(symbols: number[], tableSize = 256, hooks: MtfHooks = {}): MtfResult {
  const table = Array.from({ length: tableSize }, (_, i) => i);
  const encoded: number[] = [];
  for (const sym of symbols) {
    const idx = table.indexOf(sym);
    encoded.push(idx);
    hooks.onEncode?.(sym, idx);
    table.splice(idx, 1);
    table.unshift(sym);
    hooks.onMove?.(sym);
  }
  return { encoded, table };
}

/** MTF 解码：根据索引序列与符号表前移规则还原。 */
export function inverseMtf(encoded: number[], tableSize = 256): number[] {
  const table = Array.from({ length: tableSize }, (_, i) => i);
  const out: number[] = [];
  for (const idx of encoded) {
    const sym = table[idx]!;
    out.push(sym);
    table.splice(idx, 1);
    table.unshift(sym);
  }
  return out;
}
