// =============================================================================
// LL(1) 预测分析（Predictive Parser）· 纯算法实现
// 自顶向下、表驱动：用栈 + 当前输入 token 查预测表选产生式。
// 简化：硬编码文法 S → a S b | ε（演示 a^n b^n 类语言）。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 文法符号（终结符或非终结符）；'$' 表示输入结束标记。 */
export type Symbol = string;

/** 产生式：左部非终结符 -> 右部符号序列（空数组表示 ε）。 */
export interface Production {
  lhs: string; // 非终结符
  rhs: Symbol[]; // 右部（[] 表示 ε）
  label: string; // 展示用，如 'S → aSb'
}

/** 一条分析步骤的快照。 */
export interface ParseStep {
  /** 栈底在左，栈顶在右（最右是栈顶）。 */
  stack: Symbol[];
  /** 剩余输入（含 $）。 */
  input: Symbol[];
  /** 本步动作（展示用）。 */
  action: string;
}

/** 分析结果。 */
export interface ParseResult {
  accepted: boolean;
  steps: ParseStep[];
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface LL1Hooks {
  /** 每一步：栈、剩余输入、动作。 */
  onStep?: (stack: Symbol[], input: Symbol[], action: string) => void;
  /** 选用一条产生式。 */
  onProduction?: (prod: Production) => void;
  /** 匹配一个终结符。 */
  onMatch?: (terminal: string) => void;
  /** 接受/拒绝。 */
  onResult?: (accepted: boolean) => void;
}

// —— 演示用硬编码文法 S → a S b | ε ——

/** S → a S b */
export const PROD_S_ASB: Production = {
  lhs: 'S',
  rhs: ['a', 'S', 'b'],
  label: 'S → aSb',
};
/** S → ε */
export const PROD_S_EPS: Production = { lhs: 'S', rhs: [], label: 'S → ε' };

/**
 * LL(1) 预测分析表：M[非终结符][终结符] = 产生式。
 * 对 S → aSb | ε：
 *   FIRST(aSb) = {a}，FIRST(ε)=ε，FOLLOW(S)={$}
 *   → M[S][a] = aSb，M[S][$] = ε
 */
export function predict(nonTerminal: string, terminal: string): Production | undefined {
  if (nonTerminal === 'S') {
    if (terminal === 'a') return PROD_S_ASB;
    if (terminal === '$' || terminal === 'b') return PROD_S_EPS;
  }
  return undefined;
}

/** 输入串末尾追加结束标记 $。 */
function withEndMark(input: string): Symbol[] {
  const syms = input.length === 0 ? [] : input.split('');
  return [...syms, '$'];
}

/**
 * LL(1) 分析：判定输入串是否能从 S 推导（属于 a^n b^n）。
 *
 * @param input 输入字符（如 "aabb"），不含 $
 * @param hooks 可选事件钩子
 * @returns { accepted, steps }
 */
export function ll1Parse(input: string, hooks: LL1Hooks = {}): ParseResult {
  const inputSyms = withEndMark(input);
  // 栈：栈底是 $，栈顶在数组末尾。初始为 [S, $] 的逆——我们用栈顶在末尾，所以初始 = ['$', 'S']
  const stack: Symbol[] = ['$', 'S'];
  const steps: ParseStep[] = [];
  let pos = 0;

  const emit = (action: string): void => {
    const step: ParseStep = {
      stack: [...stack],
      input: inputSyms.slice(pos),
      action,
    };
    steps.push(step);
    hooks.onStep?.(step.stack, step.input, step.action);
  };

  emit('初始：栈 [$, S]，输入结束符 $');

  // 主循环：栈非空（栈底 $ 单独存在）
  while (stack.length > 0) {
    const top = stack[stack.length - 1]!;
    const cur = inputSyms[pos] ?? '$';

    if (isNonTerminal(top)) {
      const prod = predict(top, cur);
      if (!prod) {
        emit(`错误：无产生式匹配 M[${top}][${cur}]`);
        hooks.onResult?.(false);
        return { accepted: false, steps };
      }
      // 弹栈顶
      stack.pop();
      // 把右部逆序压栈（除非 ε：什么都不压）
      for (let i = prod.rhs.length - 1; i >= 0; i--) {
        stack.push(prod.rhs[i]!);
      }
      emit(`应用 ${prod.label}：展开 ${top} → ${prod.rhs.length ? prod.rhs.join('') : 'ε'}`);
      hooks.onProduction?.(prod);
    } else {
      // 终结符（含 $）
      if (top === cur) {
        stack.pop();
        pos++;
        if (top === '$') {
          emit('接受：栈空且输入耗尽');
          hooks.onMatch?.(top);
          hooks.onResult?.(true);
          return { accepted: true, steps };
        }
        emit(`匹配终结符 "${top}"，前进`);
        hooks.onMatch?.(top);
      } else {
        emit(`错误：期望 "${top}"，实际 "${cur}"`);
        hooks.onResult?.(false);
        return { accepted: false, steps };
      }
    }
  }

  // 栈空但输入未耗尽
  emit('错误：栈已空但输入未耗尽');
  hooks.onResult?.(false);
  return { accepted: false, steps };
}

/** 是否非终结符：约定大写字母是非终结符。 */
function isNonTerminal(sym: string): boolean {
  return sym.length === 1 && sym >= 'A' && sym <= 'Z';
}
