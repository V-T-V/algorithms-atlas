// CTW · 实现（简化：order-d 二叉上下文）
export interface CtwHooks {
  onPredict?: (bit: number, prob: number) => void;
}
interface Node {
  a: number;
  b: number;
}
export function ctwPredict(bits: number[], depth = 4, hooks: CtwHooks = {}): number[] {
  const tree = new Map<string, Node>();
  const probs: number[] = [];
  for (let i = 0; i < bits.length; i++) {
    const bit = bits[i]!;
    const ctx = bits.slice(Math.max(0, i - depth), i).join('');
    const node = tree.get(ctx) ?? { a: 0, b: 0 };
    // Krichevsky-Trofimov 估计
    const prob1 = (node.b + 0.5) / (node.a + node.b + 1);
    hooks.onPredict?.(bit, bit === 1 ? prob1 : 1 - prob1);
    probs.push(bit === 1 ? prob1 : 1 - prob1);
    if (bit === 1) node.b++;
    else node.a++;
    tree.set(ctx, node);
  }
  return probs;
}
