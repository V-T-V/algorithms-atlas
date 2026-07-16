// =============================================================================
// Gabow 强连通分量 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 算法：单遍 DFS，维护 id(=dfn)、两个栈（path 栈 S、边界栈 B）。
//   回溯时若 id[v]==B 顶，则弹 B 一次，并将 S 弹到 v（含）即得一个 SCC。
// =============================================================================

/** 图输入（有向图）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface GabowHooks {
  onDiscover?: (v: string, id: number) => void;
  onExamine?: (u: string, v: string, kind: 'tree' | 'back' | 'cross') => void;
  onComponent?: (component: string[]) => void;
}

export interface GabowResult {
  components: string[][];
}

export function sccGabow(input: GraphInput, hooks: GabowHooks = {}): GabowResult {
  const { nodes, edges } = input;
  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) if (adj.has(e.from)) adj.get(e.from)!.push(e.to);
  for (const list of adj.values()) list.sort();

  const idMap = new Map<string, number>(); // dfn
  const onStack = new Set<string>(); // 在 path 栈中
  const S: string[] = []; // path 栈
  const B: number[] = []; // boundary 栈（存 id）
  const components: string[][] = [];
  let timer = 0;

  const kindOf = (v: string): 'tree' | 'back' | 'cross' => {
    if (!idMap.has(v)) return 'tree';
    if (onStack.has(v)) return 'back';
    return 'cross';
  };

  for (const root of nodes) {
    if (idMap.has(root)) continue;
    const st: Array<{ v: string; ei: number }> = [{ v: root, ei: 0 }];
    timer++;
    idMap.set(root, timer);
    onStack.add(root);
    S.push(root);
    B.push(timer);
    hooks.onDiscover?.(root, timer);

    while (st.length > 0) {
      const f = st[st.length - 1]!;
      const u = f.v;
      const nbrs = adj.get(u) ?? [];
      if (f.ei < nbrs.length) {
        const v = nbrs[f.ei]!;
        f.ei++;
        const kind = kindOf(v);
        hooks.onExamine?.(u, v, kind);
        if (kind === 'tree') {
          timer++;
          idMap.set(v, timer);
          onStack.add(v);
          S.push(v);
          B.push(timer);
          hooks.onDiscover?.(v, timer);
          st.push({ v, ei: 0 });
        } else if (kind === 'back') {
          // 弹 B 到 ≤ id[v]
          const vid = idMap.get(v)!;
          while (B.length > 0 && B[B.length - 1]! > vid) B.pop();
        }
      } else {
        // 回溯
        st.pop();
        const uid = idMap.get(u)!;
        if (B.length > 0 && B[B.length - 1] === uid) {
          B.pop();
          const comp: string[] = [];
          let w: string;
          do {
            w = S.pop()!;
            onStack.delete(w);
            comp.push(w);
          } while (w !== u);
          components.push(comp);
          hooks.onComponent?.(comp);
        }
      }
    }
  }

  return { components };
}
