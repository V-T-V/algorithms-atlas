// =============================================================================
// BST 合法性验证 · 纯算法实现
// =============================================================================

export class BstNode {
  constructor(
    public value: number,
    public left: BstNode | null = null,
    public right: BstNode | null = null,
  ) {}
}

export interface ValidateHooks {
  onVisit?: (value: number, min: number, max: number, ok: boolean) => void;
}

export function isValidBST(root: BstNode | null, hooks: ValidateHooks = {}): boolean {
  return validate(root, -Infinity, Infinity, hooks);
}

function validate(node: BstNode | null, min: number, max: number, hooks: ValidateHooks): boolean {
  if (node === null) return true;
  const ok = node.value > min && node.value < max;
  hooks.onVisit?.(node.value, min, max, ok);
  if (!ok) return false;
  return (
    validate(node.left, min, node.value, hooks) && validate(node.right, node.value, max, hooks)
  );
}

/** 中序遍历必须严格递增（备用方法）。 */
export function isValidBSTInorder(root: BstNode | null): boolean {
  let prev = -Infinity;
  const check = (node: BstNode | null): boolean => {
    if (node === null) return true;
    if (!check(node.left)) return false;
    if (node.value <= prev) return false;
    prev = node.value;
    return check(node.right);
  };
  return check(root);
}

// 提供构造工具
export function makeNode(
  value: number,
  left: BstNode | null = null,
  right: BstNode | null = null,
): BstNode {
  return new BstNode(value, left, right);
}
