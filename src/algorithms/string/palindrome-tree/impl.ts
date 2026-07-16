// =============================================================================
// 回文树 Palindrome Tree (Eertree) · 纯算法实现
// 存储串中所有本质不同的回文子串；在线增量构建。零 DOM 依赖，可独立单测。
// =============================================================================

/** 回文树的节点。 */
export interface PalNode {
  id: number;
  /** 该节点代表的回文长度（奇根 -1，偶根 0）。 */
  len: number;
  /** 后缀链接 fail：指向本回文的最长回文真后缀。 */
  fail: number;
  /** 转移：字符 → 子节点 id（两侧各加一个字符得到更长回文）。 */
  next: Map<string, number>;
  /** 该回文在原串中的出现次数（最后做 fail 链传播时累计）。 */
  count: number;
}

/** 构建好的回文树。 */
export interface PalindromeTree {
  /** 节点数组。0 = 奇根(len=-1), 1 = 偶根(len=0)。 */
  nodes: PalNode[];
  /** 源串。 */
  s: string;
  /** 每个位置最后所在节点（用于可视化）。 */
  lastAt: number[];
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PalHooks {
  /** 新建一个回文节点（id, len），它作为某状态在 c 转移下的目标。 */
  onCreate?: (id: number, len: number, fail: number, c: string) => void;
  /** 设定新节点 fail 链。 */
  onFail?: (id: number, failTo: number) => void;
  /** 增加一条转移 next(from, c) = to（to 可能是新建或已存在节点）。 */
  onTrans?: (from: number, c: string, to: number) => void;
  /** 处理完位置 i，当前所在状态变为 last。 */
  onStep?: (i: number, last: number) => void;
  /** 统计阶段：把节点 i 的 count 累加到它的 fail 链上。 */
  onCount?: (node: number, count: number) => void;
  /** 全部完成，给出本质不同回文数与节点数。 */
  onDone?: (distinctCount: number, nodeCount: number) => void;
}

/**
 * 在线增量构建回文树（Eertree）。
 *
 * 预置两个虚根：奇根（id=0, len=-1, fail=0）、偶根（id=1, len=0, fail=0）。
 * 初始 `last = 1`（偶根）。逐字符处理位置 i 的字符 c：
 *
 * 1. 从 `last` 沿 fail 链回溯，找到最大的 `curr`，使得 `s[i-1-len(curr)] == c`
 *    （即在 curr 代表的回文两端各加 c 仍是回文）
 * 2. 若 curr 已有 c 转移 → 直接走过去，`last = next(curr,c)`
 * 3. 否则新建节点 `cur`，`len(cur) = len(curr)+2`：
 *    - 求 `fail(cur)`：从 `fail(curr)` 继续沿 fail 链回溯，找到第一个满足
 *      `s[i-1-len(t)]==c` 的 t；则 `fail(cur) = next(t, c)`
 *      （奇/偶根处理：回溯到奇根时 next(0,c)=1 偶根，作为长度 1 回文的 fail）
 *    - 设 `next(curr, c) = cur`
 * 4. `last = cur`，并把当前节点的 count++
 *
 * 统计阶段：按节点 id 倒序遍历，把每个节点的 count 累加到它的 fail 上
 * （保证每个出现回文都传播到它的所有回文后缀）。
 *
 * 时间 `O(|s|)`，空间 `O(|s|)`。
 *
 * @param s 源串
 * @param hooks 可选事件钩子
 */
export function buildPalindromeTree(s: string, hooks: PalHooks = {}): PalindromeTree {
  const nodes: PalNode[] = [];
  const make = (len: number, fail: number): number => {
    const id = nodes.length;
    nodes.push({ id, len, fail, next: new Map(), count: 0 });
    return id;
  };
  make(-1, 0); // id=0 奇根
  make(0, 0); // id=1 偶根
  let last = 1;
  const lastAt: number[] = [];

  // 已处理的前缀对应的字符数组，方便按位置读取
  // get(i)：返回 s[i]，i 越界时返回特殊字符（不会匹配任何输入字符）
  const get = (i: number): string => (i < 0 || i >= s.length ? '\u0000' : s[i]!);

  for (let i = 0; i < s.length; i++) {
    const c = s[i]!;
    // 找 curr：从 last 沿 fail 链回溯，直到 s[i-1-len(curr)]==c
    let curr = last;
    while (true) {
      const curLen = nodes[curr]!.len;
      const mirror = i - 1 - curLen;
      if (mirror >= 0 && get(mirror) === c) break;
      curr = nodes[curr]!.fail;
    }
    // curr 是否已有 c 转移？
    if (nodes[curr]!.next.has(c)) {
      last = nodes[curr]!.next.get(c)!;
      nodes[last]!.count++;
      hooks.onTrans?.(curr, c, last);
      hooks.onStep?.(i, last);
      lastAt.push(last);
      continue;
    }
    // 新建节点
    const cur = make(nodes[curr]!.len + 2, 1);
    nodes[cur]!.count++;
    hooks.onCreate?.(cur, nodes[cur]!.len, 1, c);

    // 求 fail(cur)
    if (nodes[cur]!.len === 1) {
      // 单字符回文的 fail = 偶根（len=0）
      nodes[cur]!.fail = 1;
    } else {
      let t = nodes[curr]!.fail;
      while (true) {
        const tLen = nodes[t]!.len;
        const mirror = i - 1 - tLen;
        if (mirror >= 0 && get(mirror) === c) break;
        t = nodes[t]!.fail;
      }
      nodes[cur]!.fail = nodes[t]!.next.get(c)!;
    }
    hooks.onFail?.(cur, nodes[cur]!.fail);
    nodes[curr]!.next.set(c, cur);
    hooks.onTrans?.(curr, c, cur);
    last = cur;
    hooks.onStep?.(i, last);
    lastAt.push(last);
  }

  // 统计：按 id 倒序传播 count
  for (let i = nodes.length - 1; i >= 2; i--) {
    nodes[nodes[i]!.fail]!.count += nodes[i]!.count;
    hooks.onCount?.(i, nodes[i]!.count);
  }
  // 节点 0/1 是虚根，不计入「本质不同回文」
  const distinct = nodes.length - 2;
  hooks.onDone?.(distinct, nodes.length);

  return { nodes, s, lastAt };
}

/**
 * 返回字符串 s 中**本质不同**回文子串的个数。
 */
export function countDistinctPalindromes(s: string): number {
  return buildPalindromeTree(s).nodes.length - 2;
}

/**
 * 返回字符串 s 的最长回文子串长度（回文树里所有节点 len 的最大值）。
 */
export function longestPalindromeLength(s: string): number {
  const tree = buildPalindromeTree(s);
  let max = 0;
  for (let i = 2; i < tree.nodes.length; i++) {
    if (tree.nodes[i]!.len > max) max = tree.nodes[i]!.len;
  }
  return max;
}
