// =============================================================================
// B 树
// =============================================================================

export interface BTreeNode {
  keys: number[];
  children: BTreeNode[];
  leaf: boolean;
}

export interface BTreeHooks {
  onSplit?: (parent: BTreeNode, childIndex: number, upKey: number) => void;
  onInsert?: (key: number) => void;
  onSearch?: (key: number, found: boolean) => void;
}

function makeNode(leaf: boolean): BTreeNode {
  return { keys: [], children: [], leaf };
}

export class BTree {
  root: BTreeNode;
  t: number;
  size = 0;

  constructor(t = 2) {
    this.t = t;
    this.root = makeNode(true);
  }

  search(key: number, hooks: BTreeHooks = {}): boolean {
    const result = this.searchIn(this.root, key);
    hooks.onSearch?.(key, result);
    return result;
  }

  private searchIn(node: BTreeNode, key: number): boolean {
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]!) i++;
    if (i < node.keys.length && key === node.keys[i]!) return true;
    if (node.leaf) return false;
    return this.searchIn(node.children[i]!, key);
  }

  insert(key: number, hooks: BTreeHooks = {}): void {
    const r = this.root;
    if (r.keys.length === 2 * this.t - 1) {
      const s = makeNode(false);
      s.children.push(r);
      this.splitChild(s, 0, hooks);
      this.root = s;
    }
    this.insertNonFull(this.root, key, hooks);
    this.size++;
    hooks.onInsert?.(key);
  }

  private splitChild(parent: BTreeNode, i: number, hooks: BTreeHooks): void {
    const t = this.t;
    const y = parent.children[i]!;
    const z = makeNode(y.leaf);
    // 中位数是 y.keys[t-1]
    const upKey = y.keys[t - 1]!;
    // z 拿 y.keys[t..2t-2]（共 t-1 个）
    z.keys = y.keys.slice(t);
    // y 保留 y.keys[0..t-2]（共 t-1 个）
    y.keys = y.keys.slice(0, t - 1);
    // 子节点：z 拿 y.children[t..2t-1]（共 t 个）
    if (!y.leaf) {
      z.children = y.children.slice(t);
      y.children = y.children.slice(0, t);
    }
    parent.keys.splice(i, 0, upKey);
    parent.children.splice(i + 1, 0, z);
    hooks.onSplit?.(parent, i, upKey);
  }

  private insertNonFull(node: BTreeNode, key: number, hooks: BTreeHooks): void {
    let i = node.keys.length - 1;
    if (node.leaf) {
      while (i >= 0 && key < node.keys[i]!) {
        // 腾位置
        i--;
      }
      // 插在 i+1 处
      node.keys.splice(i + 1, 0, key);
    } else {
      while (i >= 0 && key < node.keys[i]!) i--;
      i++;
      if (node.children[i]!.keys.length === 2 * this.t - 1) {
        this.splitChild(node, i, hooks);
        if (key > node.keys[i]!) i++;
      }
      this.insertNonFull(node.children[i]!, key, hooks);
    }
  }

  inorder(): number[] {
    const out: number[] = [];
    const visit = (n: BTreeNode) => {
      for (let i = 0; i < n.keys.length; i++) {
        if (!n.leaf) visit(n.children[i]!);
        out.push(n.keys[i]!);
      }
      if (!n.leaf) visit(n.children[n.keys.length]!);
    };
    visit(this.root);
    return out;
  }
}
