// =============================================================================
// 弦图判定（Chordal Graph）· 纯算法实现
// 算法：1) 最大基数搜索 (MCS) 得到消元序；2) 验证该序是否为完美消除序列 (PEO)。
//   PEO 验证：对每个 v，设其后继邻居中下标最小者为 parent(v)，
//   则 parent(v) 之外的「更后继邻居」必须都是 parent(v) 的邻居。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface ChordalHooks {
  onPick?: (v: string) => void;
  onCheck?: (v: string, ok: boolean) => void;
  onResult?: (chordal: boolean, peo: string[]) => void;
}

export interface ChordalResult {
  chordal: boolean;
  peo: string[];
}

export function chordalGraph(input: GraphInput, hooks: ChordalHooks = {}): ChordalResult {
  const { nodes, edges } = input;
  const n = nodes.length;
  const adj = new Map<string, Set<string>>();
  for (const v of nodes) adj.set(v, new Set());
  for (const e of edges) {
    if (!adj.has(e.from) || !adj.has(e.to)) continue;
    adj.get(e.from)!.add(e.to);
    adj.get(e.to)!.add(e.from);
  }

  // —— MCS：每次选「已选邻居数最多」的未选点 ——
  const weight = new Map<string, number>();
  for (const v of nodes) weight.set(v, 0);
  const chosen = new Set<string>();
  const peo: string[] = [];
  for (let i = 0; i < n; i++) {
    let best: string | null = null;
    let bestW = -1;
    for (const v of nodes) {
      if (chosen.has(v)) continue;
      const w = weight.get(v) ?? 0;
      if (w > bestW || (w === bestW && (best === null || v < best))) {
        best = v;
        bestW = w;
      }
    }
    if (best === null) break;
    chosen.add(best);
    peo.push(best);
    hooks.onPick?.(best);
    for (const nb of adj.get(best) ?? []) {
      if (!chosen.has(nb)) weight.set(nb, (weight.get(nb) ?? 0) + 1);
    }
  }

  // —— PEO 验证 ——
  const pos = new Map<string, number>();
  peo.forEach((v, i) => pos.set(v, i));

  let chordal = true;
  for (let i = 0; i < n; i++) {
    const v = peo[i]!;
    // v 在 PEO 中的后继邻居（位置 > i）
    const later = [...(adj.get(v) ?? [])]
      .filter((u) => (pos.get(u) ?? 0) > i)
      .sort((a, b) => pos.get(a)! - pos.get(b)!);
    if (later.length <= 1) {
      hooks.onCheck?.(v, true);
      continue;
    }
    const parent = later[0]!; // 下标最小的后继邻居
    // later[1..] 都应是 parent 的邻居
    let ok = true;
    for (let k = 1; k < later.length; k++) {
      if (!adj.get(parent)!.has(later[k]!)) {
        ok = false;
        break;
      }
    }
    hooks.onCheck?.(v, ok);
    if (!ok) {
      chordal = false;
    }
  }

  hooks.onResult?.(chordal, peo);
  return { chordal, peo };
}
