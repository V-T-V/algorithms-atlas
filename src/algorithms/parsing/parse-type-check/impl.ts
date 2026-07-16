// =============================================================================
// 类型检查器 · 纯算法实现
// 简单单态类型系统：int / float / bool / string + 算术/比较/逻辑。
// =============================================================================

export type Type = 'int' | 'float' | 'bool' | 'string' | 'error';

export interface AstNode {
  type: string;
  value?: string | number | boolean;
  children?: AstNode[];
}

export interface TypeError {
  nodePath: number[];
  message: string;
}

export interface CheckResult {
  /** 根表达式的推导类型。 */
  rootType: Type;
  /** 各节点的推导类型（按 path 字符串索引）。 */
  nodeTypes: Map<string, Type>;
  errors: TypeError[];
}

export interface CheckHooks {
  onInfer?: (node: AstNode, path: number[], t: Type) => void;
  onError?: (node: AstNode, path: number[], msg: string) => void;
  onResult?: (r: CheckResult) => void;
}

const NUMERIC = new Set<Type>(['int', 'float']);

/** 数值提升：int<int→int, 否则 float。 */
function promote(a: Type, b: Type): Type {
  if (a === 'float' || b === 'float') return 'float';
  return 'int';
}

/**
 * 类型检查 + 推导。
 *
 * @param root AST 根
 * @param hooks 可选钩子
 */
export function typeCheck(root: AstNode, hooks: CheckHooks = {}): CheckResult {
  const nodeTypes = new Map<string, Type>();
  const errors: TypeError[] = [];

  const rec = (node: AstNode, path: number[]): Type => {
    const childTypes: Type[] = (node.children ?? []).map((c, i) => rec(c, [...path, i]));
    let t: Type;
    if (node.type === 'Num') {
      const v = node.value;
      t = typeof v === 'number' && Number.isInteger(v) ? 'int' : 'float';
    } else if (node.type === 'Bool') {
      t = 'bool';
    } else if (node.type === 'Str') {
      t = 'string';
    } else if (node.type === 'Var') {
      // 无符号表，假设 int（演示）
      t = 'int';
    } else if (node.type === 'BinOp') {
      const op = String(node.value);
      const [l, r] = childTypes;
      if (l === 'error' || r === 'error') {
        t = 'error';
      } else if (op === '+' || op === '-' || op === '*' || op === '/') {
        if (NUMERIC.has(l as Type) && NUMERIC.has(r as Type)) {
          t = promote(l as Type, r as Type);
        } else {
          errors.push({ nodePath: path, message: `算术 ${op} 要求两侧数值，得到 ${l} 与 ${r}` });
          t = 'error';
        }
      } else if (
        op === '==' ||
        op === '!=' ||
        op === '<' ||
        op === '>' ||
        op === '<=' ||
        op === '>='
      ) {
        if (NUMERIC.has(l as Type) && NUMERIC.has(r as Type)) {
          t = 'bool';
        } else if (l === r) {
          t = 'bool';
        } else {
          errors.push({ nodePath: path, message: `比较 ${op} 两侧类型不匹配：${l} 与 ${r}` });
          t = 'error';
        }
      } else if (op === 'and' || op === 'or') {
        if (l === 'bool' && r === 'bool') t = 'bool';
        else {
          errors.push({ nodePath: path, message: `逻辑 ${op} 要求两侧 bool，得到 ${l} 与 ${r}` });
          t = 'error';
        }
      } else {
        errors.push({ nodePath: path, message: `未知算子 ${op}` });
        t = 'error';
      }
    } else if (node.type === 'UnaryOp') {
      const op = String(node.value);
      const [c] = childTypes;
      if (op === '-' && NUMERIC.has(c as Type)) t = c as Type;
      else if (op === 'not' && c === 'bool') t = 'bool';
      else {
        errors.push({ nodePath: path, message: `一元 ${op} 不适用于 ${c}` });
        t = 'error';
      }
    } else if (node.type === 'If') {
      // If cond then else：cond=bool，分支类型需一致
      const [cond, thenT, elseT] = childTypes;
      if (cond !== 'bool') {
        errors.push({ nodePath: path, message: `if 条件应为 bool，得到 ${cond}` });
      }
      if (thenT === elseT && thenT !== undefined) t = thenT;
      else if (thenT === 'error' || elseT === 'error') t = 'error';
      else {
        errors.push({ nodePath: path, message: `if 两支类型不同：${thenT} 与 ${elseT}` });
        t = 'error';
      }
    } else {
      t = 'error';
    }
    nodeTypes.set(path.join('.'), t);
    // 若本节点新增了错误，触发 onError
    const lastErr = errors[errors.length - 1];
    if (lastErr && lastErr.nodePath.join('.') === path.join('.')) {
      hooks.onError?.(node, path, lastErr.message);
    }
    hooks.onInfer?.(node, path, t);
    return t;
  };

  const rootType = rec(root, []);
  const result: CheckResult = { rootType, nodeTypes, errors };
  hooks.onResult?.(result);
  return result;
}
