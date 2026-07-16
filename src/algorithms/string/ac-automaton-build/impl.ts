// =============================================================================
// AC 自动机 fail 指针构建 · 纯算法实现
// 仅聚焦：建 trie + BFS 求 fail + 规约为 goto 自动机。不执行文本匹配。
// =============================================================================

export interface AcBuildNode {
  id: number;
  children: Map<string, number>;
  fail: number;
  /** 模式串结尾标记（该节点对应若干模式串长度集合，这里仅记是否结尾）。 */
  output: boolean;
  /** 优化：缺失转移的回填缓存，便于做 goto 自动机扫描。 */
  go: Map<string, number>;
}

export interface AcBuildHooks {
  onInsert?: (nodeId: number, ch: string) => void;
  onMarkEnd?: (nodeId: number) => void;
  /** BFS 中确定 node 的 fail。 */
  onFail?: (nodeId: number, fail: number) => void;
  /** 回填缺失转移 go[node][ch] = target。 */
  onGo?: (nodeId: number, ch: string, target: number) => void;
}

export class AcBuilder {
  nodes: AcBuildNode[] = [];

  constructor(hooks: AcBuildHooks = {}) {
    this.hooks = hooks;
    this.nodes.push({ id: 0, children: new Map(), fail: 0, output: false, go: new Map() });
  }

  private hooks: AcBuildHooks;

  insert(word: string): void {
    let cur = 0;
    for (const ch of word) {
      let nxt = this.nodes[cur]!.children.get(ch);
      if (nxt === undefined) {
        nxt = this.nodes.length;
        this.nodes.push({ id: nxt, children: new Map(), fail: 0, output: false, go: new Map() });
        this.nodes[cur]!.children.set(ch, nxt);
        this.hooks.onInsert?.(nxt, ch);
      }
      cur = nxt;
    }
    this.nodes[cur]!.output = true;
    this.hooks.onMarkEnd?.(cur);
  }

  /** BFS 构建 fail 指针并回填 go 转移。 */
  buildFail(): void {
    const queue: number[] = [];
    // 深度 1 节点 fail = 0
    for (const [, child] of this.nodes[0]!.children) {
      this.nodes[child]!.fail = 0;
      this.hooks.onFail?.(child, 0);
      queue.push(child);
    }
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      for (const [ch, v] of this.nodes[u]!.children) {
        // 求 v.fail：沿 u.fail 走
        let f = this.nodes[u]!.fail;
        while (f !== 0 && !this.nodes[f]!.children.has(ch)) f = this.nodes[f]!.fail;
        const fc = this.nodes[f]!.children.get(ch);
        this.nodes[v]!.fail = fc !== undefined && fc !== v ? fc : 0;
        this.hooks.onFail?.(v, this.nodes[v]!.fail);
        queue.push(v);
      }
    }
    // 回填 go（goto 自动机）
    this.buildGo();
  }

  /** 把 trie 规约为确定性 goto 自动机：go[u][ch] 缺失则沿 fail 回退。 */
  private buildGo(): void {
    const queue: number[] = [];
    // 根的直系子节点
    for (const [ch, v] of this.nodes[0]!.children) {
      this.nodes[0]!.go.set(ch, v);
      this.hooks.onGo?.(0, ch, v);
      queue.push(v);
    }
    let head = 0;
    while (head < queue.length) {
      const u = queue[head]!;
      head++;
      // 聚合本节点能走的所有字符：自己的 children + 父链回填
      const chars = new Set<string>(this.nodes[u]!.children.keys());
      for (const ch of chars) {
        const target = this.nodes[u]!.children.get(ch)!;
        this.nodes[u]!.go.set(ch, target);
        this.hooks.onGo?.(u, ch, target);
      }
      // 对 root 的子节点也加进队列的处理已做；子节点入队
      for (const [, v] of this.nodes[u]!.children) queue.push(v);
    }
  }
}

/** 便捷封装：传入模式串列表，返回构建好的 AC 自动机。 */
export function buildAcAutomaton(patterns: string[], hooks: AcBuildHooks = {}): AcBuilder {
  const ac = new AcBuilder(hooks);
  for (const p of patterns) ac.insert(p);
  ac.buildFail();
  return ac;
}
