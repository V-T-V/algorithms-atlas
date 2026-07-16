// =============================================================================
// 字典树 · 录制帧序列
// 通过 Trie 的钩子，把执行过程录成 Frame[]。用 setTree 渲染前缀树。
// 当前比较路径上的节点标 'compare'，新插入的单词结尾标 'final'，
// 命中查找的终点标 'pivot'。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Trie, trie, type TrieHooks } from './impl.ts';

/** 演示：插入一组单词，再做命中 / 未命中查找。 */
export const DEFAULT_INPUT = {
  insert: ['cat', 'car', 'card', 'care', 'dog', 'do'],
  search: ['car', 'can', 'dog'],
};

/** 把内部 Trie 重新构造成可视化树；hot 记录要高亮的 (depth, char)。 */
function buildViz(
  t: Trie,
  opts: {
    hotDepth?: Set<number>;
    hotChar?: string | null;
    endHits?: Set<string>;
    matchedKey?: string | null;
  },
): TreeNode {
  type Acc = {
    id: string;
    value: string;
    children: Acc[];
    isEnd: boolean;
    key: string;
    depth: number;
  };

  let counter = 0;
  const build = (prefix: string, depth: number, isEnd: boolean): Acc => {
    const id = `n${counter++}`;
    return {
      id,
      value: depth === 0 ? 'ε' : prefix.slice(-1),
      children: [],
      isEnd,
      key: prefix,
      depth,
    };
  };

  // BFS/DFS 构造：先沿 root 遍历
  const rootAcc = build('', 0, t.root.isEnd);
  const stack: Array<{ node: typeof t.root; acc: Acc; prefix: string }> = [
    { node: t.root, acc: rootAcc, prefix: '' },
  ];
  while (stack.length) {
    const { node, acc, prefix } = stack.pop()!;
    const sorted = [...node.children.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
    for (const [ch, child] of sorted) {
      const childPrefix = prefix + ch;
      const childAcc = build(childPrefix, acc.depth + 1, child.isEnd);
      acc.children.push(childAcc);
      stack.push({ node: child, acc: childAcc, prefix: childPrefix });
    }
  }

  // 转成 TreeNode 并打角色
  const toNode = (acc: Acc): TreeNode => {
    let role: BarRole | undefined;
    if (opts.matchedKey && acc.key === opts.matchedKey && acc.isEnd) role = 'pivot';
    else if (opts.endHits?.has(acc.key)) role = 'final';
    else if (opts.hotDepth?.has(acc.depth) && (opts.hotChar === null || opts.hotChar === acc.value))
      role = 'compare';
    return {
      id: acc.id,
      value: acc.isEnd && acc.depth > 0 ? `${acc.value}*` : acc.value,
      children: acc.children.length ? acc.children.map(toNode) : undefined,
      role,
    };
  };
  return toNode(rootAcc);
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: { insert: readonly string[]; search?: readonly string[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const t = trie([]); // 空 Trie

  let hotDepth = new Set<number>();
  let hotChar: string | null = null;
  let endHits = new Set<string>();
  let matchedKey: string | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const tree = buildViz(t, {
      hotDepth,
      hotChar,
      endHits,
      matchedKey,
    });
    rec
      .begin(note)
      .setTree(tree)
      .setAux([{ label: '键数', value: String(t.size), role: 'final' }])
      .commit();
  };

  render({ zh: '空 Trie，开始插入', en: 'Empty trie, start inserting' });

  // —— 插入阶段 ——
  const insertHooks: TrieHooks = {
    onCompare: () => {},
    onStep: (depth, ch, _existed) => {
      hotDepth = new Set([depth]);
      hotChar = ch;
    },
    onCreate: (depth, ch) => {
      hotDepth = new Set([depth]);
      hotChar = ch;
      render({
        zh: `新建节点：字符 '${ch}'（深度 ${depth}）`,
        en: `Create node: char '${ch}' (depth ${depth})`,
      });
    },
    onMarkEnd: (depth, redundant) => {
      hotDepth = new Set();
      hotChar = null;
      render(
        redundant
          ? { zh: `键已存在（重复插入，不计入）`, en: `Key already exists (duplicate, ignored)` }
          : { zh: `标记单词结尾（isEnd = true）`, en: `Mark word end (isEnd = true)` },
      );
    },
  };

  for (const w of input.insert) {
    // 逐步插入，让每个 onStep 都能展示一次「走向」
    matchedKey = null;
    endHits = new Set<string>();
    hotDepth = new Set<number>();
    render({ zh: `插入 "${w}"`, en: `Insert "${w}"` });
    t.insert(w, insertHooks);
    endHits = new Set<string>([w]);
    render({ zh: `完成插入 "${w}"`, en: `Inserted "${w}"` });
  }

  // —— 查找阶段 ——
  const searchHooks: TrieHooks = {
    onStep: () => {},
    onCreate: () => {},
    onMarkEnd: () => {},
    onCompare: (depth, ch, hit) => {
      hotDepth = new Set([depth]);
      hotChar = ch;
      render(
        hit
          ? {
              zh: `比较字符 '${ch}'（深度 ${depth}）：命中 ✓`,
              en: `Compare '${ch}' (depth ${depth}): hit ✓`,
            }
          : {
              zh: `比较字符 '${ch}'（深度 ${depth}）：缺失 ✗`,
              en: `Compare '${ch}' (depth ${depth}): miss ✗`,
            },
      );
    },
    onResult: (kind, key, ok) => {
      hotDepth = new Set<number>();
      hotChar = null;
      matchedKey = ok && kind === 'search' ? key : null;
      render(
        ok
          ? kind === 'search'
            ? { zh: `找到 "${key}" ✓`, en: `Found "${key}" ✓` }
            : { zh: `存在前缀 "${key}" ✓`, en: `Has prefix "${key}" ✓` }
          : kind === 'search'
            ? { zh: `未找到 "${key}" ✗`, en: `"${key}" not found ✗` }
            : { zh: `无此前缀 "${key}" ✗`, en: `No such prefix "${key}" ✗` },
      );
      matchedKey = null;
    },
  };

  for (const w of input.search ?? []) {
    endHits = new Set<string>();
    t.search(w, searchHooks);
  }

  // 终态
  hotDepth = new Set<number>();
  matchedKey = null;
  endHits = new Set<string>();
  rec
    .begin({
      zh: `完成，Trie 共 ${t.size} 个键`,
      en: `Done, ${t.size} keys in the trie`,
    })
    .setTree(buildViz(t, { endHits }))
    .commit();

  return rec.build();
}
