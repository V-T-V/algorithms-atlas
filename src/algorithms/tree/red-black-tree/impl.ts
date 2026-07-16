// =============================================================================
// 红黑树 Red-Black Tree · 纯算法实现
// 零 DOM 依赖，可独立单测。通过 hooks 暴露每步操作供录制器使用。
// 自平衡 BST：用节点颜色（红/黑）+ 5 条性质保证最长路径不超过最短的 2 倍。
// 本实现仅做【插入】（5 种修复情况 + 左/右旋转 + 颜色翻转）。
//
// 红黑树五性质：
//   1. 每个节点非红即黑
//   2. 根是黑色
//   3. 每个叶子（NIL）是黑色
//   4. 红节点的两个孩子必须都是黑色（红节点不能相邻）
//   5. 从任一节点到其所有后代叶子的简单路径上，黑节点数目相同（黑高）
// =============================================================================

/** 节点颜色。 */
export type Color = 'RED' | 'BLACK';

/** 红黑树节点（带父指针，便于回溯修复）。 */
export interface RBNode {
  value: number;
  color: Color;
  left: RBNode | null;
  right: RBNode | null;
  parent: RBNode | null;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface RBHooks {
  /** 比较 value 与节点 node.value（dir: 'left' | 'right'）。 */
  onCompare?: (value: number, nodeValue: number, dir: 'left' | 'right') => void;
  /** 插入一个新节点（红色）。 */
  onInsert?: (value: number) => void;
  /** 进入修复情况 case（1..5）。 */
  onFixCase?: (caseNo: 1 | 2 | 3 | 4 | 5, nodeValue: number) => void;
  /** 发生旋转：type 为 'L'（左旋）/ 'R'（右旋），围绕 pivotValue。 */
  onRotate?: (type: 'L' | 'R', pivotValue: number) => void;
  /** 节点颜色被改变（重新着色）。 */
  onRecolor?: (nodeValue: number, from: Color, to: Color) => void;
}

/** 红黑树（仅插入）。 */
export class RedBlackTree {
  root: RBNode | null = null;
  private readonly hooks: RBHooks;

  constructor(hooks: RBHooks = {}) {
    this.hooks = hooks;
  }

  /** 顺序插入一组值。 */
  insertMany(values: readonly number[]): void {
    for (const v of values) this.insert(v);
  }

  /** 插入单个值；重复值忽略。 */
  insert(value: number): void {
    // 1. 标准 BST 插入，新节点为红色
    let parent: RBNode | null = null;
    let cur = this.root;
    while (cur !== null) {
      parent = cur;
      if (value === cur.value) return; // 重复值不插入
      const dir: 'left' | 'right' = value < cur.value ? 'left' : 'right';
      this.hooks.onCompare?.(value, cur.value, dir);
      cur = dir === 'left' ? cur.left : cur.right;
    }
    const node: RBNode = { value, color: 'RED', left: null, right: null, parent };
    this.hooks.onInsert?.(value);
    if (parent === null) {
      this.root = node;
    } else if (value < parent.value) {
      parent.left = node;
    } else {
      parent.right = node;
    }
    // 2. 修复红黑性质
    this.fixInsert(node);
  }

  /** 插入后修复，处理 5 种情况。 */
  private fixInsert(z: RBNode): void {
    // 用指针逐步向上：z 为当前红节点，z.parent 为红时需修复
    while (z.parent !== null && z.parent.color === 'RED') {
      const parent = z.parent;
      const grand = parent.parent;
      if (grand === null) break; // 父为根：由最后根染黑覆盖
      const parentIsLeft = grand.left === parent;
      const uncle = parentIsLeft ? grand.right! : grand.left!;

      if (uncle !== null && uncle.color === 'RED') {
        // Case 1：叔叔为红 → 父/叔染黑，祖染红，z 上移到祖
        this.hooks.onFixCase?.(1, z.value);
        this.recolor(parent, 'BLACK');
        this.recolor(uncle, 'BLACK');
        this.recolor(grand, 'RED');
        z = grand;
        continue;
      }

      // 叔叔为黑（含 null 视作黑）
      if (parentIsLeft) {
        if (z === parent.right) {
          // Case 2：z 是父的右孩子（左-右）→ 左旋父，转化为 Case 3
          this.hooks.onFixCase?.(2, z.value);
          z = parent;
          this.rotateLeft(z);
        }
        // Case 3：z 是父的左孩子（左-左）→ 右旋祖，交换父/祖颜色
        this.hooks.onFixCase?.(3, z.value);
        const p = z.parent!; // 旋转后 z 的父
        const g = p.parent!;
        this.recolor(p, 'BLACK');
        this.recolor(g, 'RED');
        this.rotateRight(g);
      } else {
        // 镜像：父是祖的右孩子
        if (z === parent.left) {
          // Case 4：z 是父的左孩子（右-左）→ 右旋父，转化为 Case 5
          this.hooks.onFixCase?.(4, z.value);
          z = parent;
          this.rotateRight(z);
        }
        // Case 5：z 是父的右孩子（右-右）→ 左旋祖，交换父/祖颜色
        this.hooks.onFixCase?.(5, z.value);
        const p = z.parent!;
        const g = p.parent!;
        this.recolor(p, 'BLACK');
        this.recolor(g, 'RED');
        this.rotateLeft(g);
      }
    }
    // 根必须为黑（性质 2）
    if (this.root!.color === 'RED') {
      this.recolor(this.root!, 'BLACK');
    }
  }

  /** 左旋（围绕 x）：x 的右孩子 y 上提。 */
  private rotateLeft(x: RBNode): void {
    this.hooks.onRotate?.('L', x.value);
    const y = x.right!;
    x.right = y.left;
    if (y.left !== null) y.left.parent = x;
    y.parent = x.parent;
    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
  }

  /** 右旋（围绕 y）：y 的左孩子 x 上提。 */
  private rotateRight(y: RBNode): void {
    this.hooks.onRotate?.('R', y.value);
    const x = y.left!;
    y.left = x.right;
    if (x.right !== null) x.right.parent = y;
    x.parent = y.parent;
    if (y.parent === null) {
      this.root = x;
    } else if (y === y.parent.left) {
      y.parent.left = x;
    } else {
      y.parent.right = x;
    }
    x.right = y;
    y.parent = x;
  }

  private recolor(node: RBNode, color: Color): void {
    if (node.color === color) return;
    const from = node.color;
    node.color = color;
    this.hooks.onRecolor?.(node.value, from, color);
  }
}

/** 便捷函数：顺序插入 values，返回红黑树实例（含 root）。 */
export function redBlackTree(values: readonly number[], hooks: RBHooks = {}): RedBlackTree {
  const tree = new RedBlackTree(hooks);
  tree.insertMany(values);
  return tree;
}

/** 中序遍历（应得到升序）。 */
export function inorder(root: RBNode | null): number[] {
  const out: number[] = [];
  const walk = (n: RBNode | null): void => {
    if (!n) return;
    walk(n.left);
    out.push(n.value);
    walk(n.right);
  };
  walk(root);
  return out;
}

/** 黑高：从 node 到任一叶子路径上的黑节点数（不含 node 自身）。 */
function blackHeight(node: RBNode | null): number {
  if (node === null) return 0; // NIL 视作黑，但不计数（叶子）
  const lh = blackHeight(node.left);
  const rh = blackHeight(node.right);
  if (lh < 0 || rh < 0 || lh !== rh) return -1;
  return lh + (node.color === 'BLACK' ? 1 : 0);
}

/** 校验是否满足红黑树性质（颜色、BST 序、无相邻红、黑高一致、根黑）。 */
export function isRedBlackTree(tree: RedBlackTree): { ok: boolean; reason?: string } {
  const root = tree.root;
  if (root === null) return { ok: true }; // 空树合法
  if (root.color !== 'BLACK') return { ok: false, reason: '根不是黑色' };
  // BST 序
  const sorted = inorder(root);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i - 1]! >= sorted[i]!) return { ok: false, reason: '违反 BST 序' };
  }
  const check = (n: RBNode | null): boolean => {
    if (n === null) return true;
    // 红节点的孩子必须黑
    if (n.color === 'RED') {
      if (n.left !== null && n.left.color === 'RED') return false;
      if (n.right !== null && n.right.color === 'RED') return false;
    }
    // 父指针一致性
    if (n.left !== null && n.left.parent !== n) return false;
    if (n.right !== null && n.right.parent !== n) return false;
    return check(n.left) && check(n.right);
  };
  if (!check(root)) return { ok: false, reason: '红节点相邻或父指针不一致' };
  if (blackHeight(root) < 0) return { ok: false, reason: '黑高不一致' };
  return { ok: true };
}
