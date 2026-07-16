// =============================================================================
// AC 自动机 Aho-Corasick · 纯算法实现
// 多模式串匹配。在 trie 上构建 fail 指针（KMP 思想的推广），扫描文本一遍即可
// 报告所有模式串的出现位置。零 DOM 依赖，可独立单测。
// =============================================================================

/** Trie 节点。 */
export interface AcNode {
  id: number;
  /** 子节点：字符 → 子节点 id。 */
  children: Map<string, number>;
  /** fail 指针：指向「当前节点代表的串的最长真后缀」所在节点。 */
  fail: number;
  /**
   * output：本节点为结尾的模式在 patterns 数组中的下标集合。
   * 经 fail 链压缩后，本字段包含沿 fail 链可到达的所有模式（即「字典后缀链接」）。
   */
  output: number[];
  /** 父节点（便于构造可视化，根为 -1）。 */
  parent: number;
  /** 父节点到本节点的边上的字符（根为 ''）。 */
  charFromParent: string;
  /** 深度（根为 0）。 */
  depth: number;
}

/** 构建好的 AC 自动机。 */
export interface AcAutomaton {
  nodes: AcNode[];
  patterns: string[];
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AcHooks {
  /** 在 trie 中插入模式串 patterns[i] 的某个字符（沿边 parent→child）。 */
  onInsertEdge?: (patternIdx: number, parent: number, child: number, ch: string) => void;
  /** 模式串 patterns[i] 插入完毕，记在 node 上为输出。 */
  onInsertOutput?: (patternIdx: number, node: number) => void;
  /** BFS 构建 fail：确定 node 的 fail 指针指向 failTo。 */
  onFail?: (node: number, failTo: number) => void;
  /** 匹配阶段：在文本下标 t 处，状态从 state 沿字符 ch 转移到 nextState。 */
  onTransfer?: (t: number, state: number, nextState: number, ch: string) => void;
  /** 在文本下标 t 处匹配到模式 patterns[i]（t 是结束下标，含）。 */
  onFound?: (t: number, patternIdx: number) => void;
}

/**
 * 用一组模式串构建 AC 自动机。
 *
 * 两步：\n
 * 1. 把所有模式串插入 trie，每个完整模式所在节点记为输出。\n
 * 2. BFS 构建 fail 指针：对根的直接子节点 fail=0；对其余节点 u（设父为 p、边字符为 c）：\n
 *    `fail(u) = children(fail(p), c)`，若不存在则继续沿 fail(p) 链回溯，直至根。\n
 *    同时把 fail 目标节点的 output 合并进 u（字典后缀链接，避免匹配时反复跳 fail）。\n
 *
 * 时间 `O(Σ|patterns|)`，空间同阶。
 */
export function buildAcAutomaton(patterns: string[], hooks: AcHooks = {}): AcAutomaton {
  const nodes: AcNode[] = [];
  const make = (parent: number, charFromParent: string, depth: number): number => {
    const id = nodes.length;
    nodes.push({
      id,
      children: new Map(),
      fail: 0,
      output: [],
      parent,
      charFromParent,
      depth,
    });
    return id;
  };
  make(-1, '', 0); // 根 id=0

  // 1) 插入
  for (let pi = 0; pi < patterns.length; pi++) {
    const pat = patterns[pi]!;
    let cur = 0;
    for (let k = 0; k < pat.length; k++) {
      const ch = pat[k]!;
      let nx = nodes[cur]!.children.get(ch);
      if (nx === undefined) {
        nx = make(cur, ch, nodes[cur]!.depth + 1);
        nodes[cur]!.children.set(ch, nx);
        hooks.onInsertEdge?.(pi, cur, nx, ch);
      }
      cur = nx;
    }
    nodes[cur]!.output.push(pi);
    hooks.onInsertOutput?.(pi, cur);
  }

  // 2) BFS 构建 fail
  const queue: number[] = [];
  // 根的子节点 fail = 0，入队
  for (const childId of nodes[0]!.children.values()) {
    nodes[childId]!.fail = 0;
    queue.push(childId);
  }
  let head = 0;
  while (head < queue.length) {
    const u = queue[head]!;
    head++;
    for (const [ch, v] of nodes[u]!.children) {
      // 求 fail(v)：沿 u.fail 链找 children(f, ch)
      let f = nodes[u]!.fail;
      while (f !== 0 && !nodes[f]!.children.has(ch)) {
        f = nodes[f]!.fail;
      }
      const fc = nodes[f]!.children.get(ch);
      nodes[v]!.fail = fc !== undefined && fc !== v ? fc : 0;
      hooks.onFail?.(v, nodes[v]!.fail);
      // 合并字典后缀链接（fail 目标的 output）
      nodes[v]!.output.push(...nodes[nodes[v]!.fail]!.output);
      queue.push(v);
    }
  }

  return { nodes, patterns };
}

/**
 * 用 AC 自动机扫描文本，返回所有匹配（文本结束下标 → 模式下标）。
 *
 * 扫描时状态转移：在状态 s 读字符 ch 时，若 `nodes[s].children.has(ch)` 直接走；
 * 否则沿 fail 链回退直到能走（或回到根）。由于已合并 output，到达某节点即可一次性
 * 列出所有在该位置结束的模式。
 *
 * 复杂度 `O(|text| + 命中数)`。
 */
export function acSearch(
  text: string,
  ac: AcAutomaton,
  hooks: AcHooks = {},
): Array<{ end: number; patternIdx: number }> {
  const results: Array<{ end: number; patternIdx: number }> = [];
  let state = 0;
  for (let t = 0; t < text.length; t++) {
    const ch = text[t]!;
    while (state !== 0 && !ac.nodes[state]!.children.has(ch)) {
      state = ac.nodes[state]!.fail;
    }
    const nx = ac.nodes[state]!.children.get(ch);
    state = nx !== undefined ? nx : 0;
    hooks.onTransfer?.(t, state, state, ch);
    for (const pi of ac.nodes[state]!.output) {
      results.push({ end: t, patternIdx: pi });
      hooks.onFound?.(t, pi);
    }
  }
  return results;
}

/**
 * 便捷：一步完成「构建 + 搜索」，返回 { end, pattern, patternIdx } 列表。
 */
export function ahoCorasick(
  text: string,
  patterns: string[],
  hooks: AcHooks = {},
): Array<{ end: number; pattern: string; patternIdx: number; start: number }> {
  const ac = buildAcAutomaton(patterns, hooks);
  const raw = acSearch(text, ac, hooks);
  return raw.map(({ end, patternIdx }) => {
    const pat = patterns[patternIdx]!;
    return { end, pattern: pat, patternIdx, start: end - pat.length + 1 };
  });
}
