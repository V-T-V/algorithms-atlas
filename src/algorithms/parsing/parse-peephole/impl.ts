// =============================================================================
// 窥孔优化 · 纯算法实现
// 简单三地址/栈式 IR；若干模式规则；滑动窗口替换。
// =============================================================================

export interface Instr {
  op: string;
  /** 目标寄存器或地址。 */
  dst?: string;
  /** 源寄存器或立即数（字符串形式）。 */
  src1?: string;
  src2?: string;
}

export interface PeepholeResult {
  instrs: Instr[];
  rewrites: number;
  passes: number;
}

export interface PeepholeHooks {
  onRewrite?: (window: Instr[], replacement: Instr[], atIndex: number) => void;
  onPass?: (pass: number, rewritesThisPass: number) => void;
  onResult?: (r: PeepholeResult) => void;
}

/**
 * 单遍窗口扫描（窗口大小 = 2）。
 * 返回新指令序列与本遍重写次数。
 */
function passOnce(instrs: Instr[], hooks: PeepholeHooks): { instrs: Instr[]; rewrites: number } {
  const out: Instr[] = [];
  let rewrites = 0;
  let i = 0;
  while (i < instrs.length) {
    const a = instrs[i]!;
    const b = instrs[i + 1];
    if (b) {
      // 规则 1：LOAD r,x; STORE x,r → 删除两条
      if (a.op === 'LOAD' && b.op === 'STORE' && a.dst === b.src1 && a.src1 === b.dst) {
        rewrites++;
        hooks.onRewrite?.([a, b], [], i);
        i += 2;
        continue;
      }
      // 规则 2：LOAD r,x; LOAD r,x → 删除一条（同一寄存器同一地址）
      if (a.op === 'LOAD' && b.op === 'LOAD' && a.dst === b.dst && a.src1 === b.src1) {
        rewrites++;
        hooks.onRewrite?.([a, b], [a], i);
        out.push(a);
        i += 2;
        continue;
      }
      // 规则 3：STORE x,r; LOAD r,x → 用 NOP 替换为空（保留 STORE 即可，因为 r 已是 src）
      if (a.op === 'STORE' && b.op === 'LOAD' && a.dst === b.src1 && a.src1 === b.dst) {
        rewrites++;
        hooks.onRewrite?.([a, b], [a], i);
        out.push(a);
        i += 2;
        continue;
      }
    }
    // 单条规则
    // ADD r,0 / SUB r,0 → 删除
    if ((a.op === 'ADD' || a.op === 'SUB') && a.src2 === '0') {
      rewrites++;
      hooks.onRewrite?.([a], [], i);
      i += 1;
      continue;
    }
    // MUL r,1 → 删除
    if (a.op === 'MUL' && a.src2 === '1') {
      rewrites++;
      hooks.onRewrite?.([a], [], i);
      i += 1;
      continue;
    }
    // MUL r,0 → MOV r,0
    if (a.op === 'MUL' && a.src2 === '0') {
      const rep: Instr = { op: 'MOV', dst: a.dst, src1: '0' };
      rewrites++;
      hooks.onRewrite?.([a], [rep], i);
      out.push(rep);
      i += 1;
      continue;
    }
    // MUL r,2 → SHL r,1（强度削减）
    if (a.op === 'MUL' && a.src2 === '2') {
      const rep: Instr = { op: 'SHL', dst: a.dst, src1: a.src1, src2: '1' };
      rewrites++;
      hooks.onRewrite?.([a], [rep], i);
      out.push(rep);
      i += 1;
      continue;
    }
    out.push(a);
    i += 1;
  }
  return { instrs: out, rewrites };
}

/**
 * 不动点窥孔优化。
 *
 * @param instrs 指令序列
 * @param maxPasses 最大轮数
 * @param hooks 可选钩子
 */
export function peephole(
  instrs: Instr[],
  maxPasses = 20,
  hooks: PeepholeHooks = {},
): PeepholeResult {
  let cur = [...instrs];
  let total = 0;
  let passes = 0;
  for (let p = 1; p <= maxPasses; p++) {
    const r = passOnce(cur, hooks);
    passes = p;
    hooks.onPass?.(p, r.rewrites);
    if (r.rewrites === 0) break;
    total += r.rewrites;
    cur = r.instrs;
  }
  const result: PeepholeResult = { instrs: cur, rewrites: total, passes };
  hooks.onResult?.(result);
  return result;
}

/** 指令格式化。 */
export function instrStr(i: Instr): string {
  const parts = [i.op];
  if (i.dst) parts.push(i.dst);
  if (i.src1) parts.push(i.src1);
  if (i.src2) parts.push(i.src2);
  return parts.join(' ');
}
