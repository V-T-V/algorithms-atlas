// MTD(f) 算法 · 实现

export interface MtdNode {
  id: string;
  utility?: number; // 叶子效用（站当前玩家视角，negamax 语义）
  children?: MtdNode[];
}

export interface MtdHooks {
  onTest?: (guess: number, bound: 'lower' | 'upper', value: number) => void;
  onConverge?: (value: number, iterations: number) => void;
}

/** 零窗口 negamax（Test）：返回 node 在窗口 [beta-1, beta] 下的值。 */
function test(node: MtdNode, beta: number, depth: number): number {
  const alpha = beta - 1;
  if (depth === 0 || !node.children || node.children.length === 0) {
    return node.utility ?? 0;
  }
  let best = -Infinity;
  for (const child of node.children) {
    const v = -test(child, -alpha === -Infinity ? Infinity : -alpha + 1, depth - 1);
    // 简化：用 -beta 做零窗口递归
    if (v > best) best = v;
    if (best >= beta) break; // 剪枝（high bound）
  }
  return best;
}

/** 标准 alpha-beta negamax（用于实际 Test 实现）。 */
function alphaBeta(node: MtdNode, alpha: number, beta: number, depth: number): number {
  if (depth === 0 || !node.children || node.children.length === 0) {
    return node.utility ?? 0;
  }
  let best = -Infinity;
  for (const child of node.children) {
    const v = -alphaBeta(child, -beta, -alpha, depth - 1);
    if (v > best) best = v;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

/** 零窗口 Test：返回值 >= guess 则为下界，否则上界。 */
function testCall(node: MtdNode, guess: number, depth: number): number {
  const beta = guess + 1;
  return alphaBeta(node, beta - 1, beta, depth);
}

/**
 * MTD(f) 算法。
 * @param root 根节点
 * @param f 初始猜测
 * @param maxDepth 搜索深度
 * @param maxIter 最大 Test 次数
 */
export function mtdF(
  root: MtdNode,
  f: number,
  maxDepth: number,
  maxIter = 40,
  hooks: MtdHooks = {},
): number {
  let guess = f;
  let lower = -Infinity;
  let upper = Infinity;
  let iter = 0;
  do {
    iter++;
    const beta = guess === lower ? guess + 1 : guess;
    const t = testCall(root, beta - 1, maxDepth);
    if (t < beta) {
      upper = t;
      hooks.onTest?.(guess, 'upper', t);
    } else {
      lower = t;
      hooks.onTest?.(guess, 'lower', t);
    }
    guess = lower === -Infinity ? upper : upper === Infinity ? lower : (lower + upper) / 2;
  } while (lower < upper && iter < maxIter);
  hooks.onConverge?.(guess, iter);
  return guess;
}

// 防止未使用函数警告
void test;
