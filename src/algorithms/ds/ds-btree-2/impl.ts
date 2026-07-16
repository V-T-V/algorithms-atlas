// =============================================================================
// B 树（阶 4，即 2-3-4 树）
// =============================================================================

export interface BNode {
  keys: number[];
  children: BNode[];
}

export interface BTreeHooks {
  onSplit?: (parentKeys: number[], midKey: number) => void;
  onInsert?: (key: number) => void;
  onDone?: (root: BNode | null) => void;
}

const MAX_KEYS = 3;

function makeNode(): BNode {
  return { keys: [], children: [] };
}

export class BTree2 {
  root: BNode | null = null;
  constructor(private hooks: BTreeHooks = {}) {}

  insert(key: number): void {
    this.hooks.onInsert?.(key);
    if (!this.root) {
      this.root = makeNode();
      this.root.keys.push(key);
      return;
    }
    // 若根满则预先分裂
    if (this.root.keys.length === MAX_KEYS) {
      const newRoot = makeNode();
      const mid = this.root.keys[1]!;
      const [left, right] = split(this.root, this.hooks);
      newRoot.keys.push(mid);
      newRoot.children.push(left, right);
      this.root = newRoot;
    }
    this.insertNonFull(this.root, key);
  }
  private insertNonFull(node: BNode, key: number): void {
    let i = node.keys.length - 1;
    if (node.children.length === 0) {
      // 叶节点
      while (i >= 0 && key < node.keys[i]!) {
        i--;
      }
      node.keys.splice(i + 1, 0, key);
    } else {
      while (i >= 0 && key < node.keys[i]!) i--;
      i++;
      if (node.children[i]!.keys.length === MAX_KEYS) {
        const mid = node.children[i]!.keys[1]!;
        const [left, right] = split(node.children[i]!, this.hooks);
        node.keys.splice(i, 0, mid);
        node.children.splice(i, 1, left, right);
        if (key > node.keys[i]!) i++;
      }
      this.insertNonFull(node.children[i]!, key);
    }
  }
  contains(key: number): boolean {
    return this.search(this.root, key);
  }
  private search(node: BNode | null, key: number): boolean {
    if (!node) return false;
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]!) i++;
    if (i < node.keys.length && key === node.keys[i]!) return true;
    if (node.children.length === 0) return false;
    return this.search(node.children[i]!, key);
  }
}

function split(node: BNode, hooks: BTreeHooks): [BNode, BNode] {
  const mid = node.keys[1]!;
  hooks.onSplit?.(node.keys, mid);
  const left = makeNode();
  const right = makeNode();
  left.keys.push(node.keys[0]!);
  right.keys.push(node.keys[2]!);
  if (node.children.length > 0) {
    left.children.push(node.children[0]!, node.children[1]!);
    right.children.push(node.children[2]!, node.children[3]!);
  }
  return [left, right];
}
