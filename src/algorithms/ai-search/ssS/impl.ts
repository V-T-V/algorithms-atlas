// =============================================================================
// SSS*（解状态空间搜索）· 纯算法实现
// 用优先队列（OPEN 表）以最佳优先方式遍历博弈树状态空间。
// 节点类型：MAX（取最大）/ MIN（取最小）。叶子带 utility。
// 每个状态 = (nodePath, index, g, status)，其中 nodePath 是从根到该节点的路径。
// =============================================================================

export type SssNodeType = 'max' | 'min';

export interface SssNode {
  id: string;
  type: SssNodeType;
  /** 叶子效用（站根玩家 MAX 规角）。 */
  utility?: number;
  children?: SssNode[];
  /** 搜索后填充的值。 */
  value?: number;
}

export interface SssHooks {
  onPop?: (info: { nodeId: string; g: number; status: 'live' | 'solved' }) => void;
  onPurge?: (purgedCount: number) => void;
  onLeaf?: (node: SssNode, utility: number, g: number) => void;
  onSolved?: (nodeId: string, value: number) => void;
  /** 某节点生成了若干子状态。 */
  onGenerate?: (parentId: string, childIds: string[]) => void;
}

export interface SssConfig {
  /** 初始上界（应足够大）。 */
  initBound: number;
}

export const DEFAULT_SSS_CONFIG: SssConfig = {
  initBound: Infinity,
};

/** OPEN 表中的状态。 */
interface State {
  /** 从根到本节点的路径（含根），便于回溯父节点。 */
  path: SssNode[];
  /** 在父节点 children 中的索引（根为 0）。 */
  index: number;
  /** 当前上界。 */
  g: number;
  /** 'live' 或 'solved'。 */
  status: 'live' | 'solved';
}

/** 比较：solved 优先于 live；同 status 时 g 大者优先。 */
function statePriority(s: State): number {
  // solved 用大数 + g，保证 solved 先出
  return (s.status === 'solved' ? 1e18 : 0) + s.g;
}

/**
 * SSS* 主函数（站根 MAX 视角，返回 minimax 值）。
 */
export function sssStar(
  root: SssNode,
  config: SssConfig = DEFAULT_SSS_CONFIG,
  hooks: SssHooks = {},
): number {
  const open: State[] = [];
  // 初始：根节点的活状态
  open.push({ path: [root], index: 0, g: config.initBound, status: 'live' });

  let guard = 0;
  const limit = 200000;

  while (open.length > 0 && guard++ < limit) {
    // 取优先级最高的状态
    let pickIdx = 0;
    let bestPri = -Infinity;
    for (let i = 0; i < open.length; i++) {
      const p = statePriority(open[i]!);
      if (p > bestPri) {
        bestPri = p;
        pickIdx = i;
      }
    }
    const state = open.splice(pickIdx, 1)[0]!;
    const node = state.path[state.path.length - 1]!;
    hooks.onPop?.({ nodeId: node.id, g: state.g, status: state.status });

    if (state.status === 'solved') {
      // 已解决状态
      node.value = state.g;
      hooks.onSolved?.(node.id, state.g);

      if (state.path.length === 1) {
        // 根被解决 → 完成
        root.value = state.g;
        return state.g;
      }

      // 找父节点
      const parentPath = state.path.slice(0, -1);
      const parent = parentPath[parentPath.length - 1]!;

      if (parent.type === 'min') {
        // MIN 父：用此 solved 值作为父节点的值（取最小，但 SSS* 取第一个 solved 的）
        // SSS* 中 MIN 节点的第一个子被 solved 后，父节点立即 solved（g 不变）
        // 但需 purge：移除 OPEN 中所有属于 parent 子树的状态（g > state.g）
        const before = open.length;
        for (let i = open.length - 1; i >= 0; i--) {
          const s = open[i]!;
          if (s.path.length >= parentPath.length && s.path[parentPath.length - 1] === parent) {
            open.splice(i, 1);
          }
        }
        hooks.onPurge?.(before - open.length);
        open.push({
          path: parentPath,
          index: parentPath.length >= 2 ? state.path.length - 1 : 0,
          g: state.g,
          status: 'solved',
        });
      } else {
        // MAX 父：推进到下一个未生成子节点
        // 所有子都被 solved 时父才 solved；否则生成下一个子的活状态
        const childIndex = state.index;
        if (parent.children && childIndex + 1 < parent.children.length) {
          const nextChild = parent.children[childIndex + 1]!;
          open.push({
            path: [...parentPath, nextChild],
            index: childIndex + 1,
            g: state.g,
            status: 'live',
          });
          hooks.onGenerate?.(parent.id, [nextChild.id]);
        } else {
          // 所有子都 solved：父 solved，值取子节点的最大值（即最大 g）
          // 但因为 state.g 已是当前 solved 的最大，直接回传
          open.push({
            path: parentPath,
            index: state.path.length - 1,
            g: state.g,
            status: 'solved',
          });
        }
      }
      continue;
    }

    // status === 'live'
    const isLeaf = node.children === undefined || node.children.length === 0;
    if (isLeaf) {
      const u = node.utility ?? 0;
      const newG = Math.min(state.g, u);
      hooks.onLeaf?.(node, u, newG);
      // 转为 solved
      open.push({ path: state.path, index: state.index, g: newG, status: 'solved' });
    } else if (node.type === 'max') {
      // MAX 活状态：展开为所有子节点的活状态
      const childIds: string[] = [];
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i]!;
          open.push({
            path: [...state.path, child],
            index: i,
            g: state.g,
            status: 'live',
          });
          childIds.push(child.id);
        }
      }
      hooks.onGenerate?.(node.id, childIds);
    } else {
      // MIN 活状态：只展开第一个子节点
      if (node.children && node.children.length > 0) {
        const firstChild = node.children[0]!;
        open.push({
          path: [...state.path, firstChild],
          index: 0,
          g: state.g,
          status: 'live',
        });
        hooks.onGenerate?.(node.id, [firstChild.id]);
      }
    }
  }

  // 回退
  return minimaxRef(root);
}

/** 参考 minimax（站根 MAX 视角）。 */
export function minimaxRef(node: SssNode): number {
  if (node.children === undefined || node.children.length === 0) {
    return node.utility ?? 0;
  }
  const vals = node.children.map(minimaxRef);
  return node.type === 'max' ? Math.max(...vals) : Math.min(...vals);
}

// —— 构建示例博弈树 ——

export function buildTree(utilities: number[], branching: number): SssNode {
  let idx = 0;
  let counter = 0;
  const make = (depth: number, isMax: boolean): SssNode => {
    const id = `s${counter++}`;
    if (depth === 0) {
      const u = utilities[idx];
      idx += 1;
      return { id, type: isMax ? 'max' : 'min', utility: u };
    }
    const children: SssNode[] = [];
    for (let k = 0; k < branching; k++) children.push(make(depth - 1, !isMax));
    return { id, type: isMax ? 'max' : 'min', children };
  };
  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  return make(depth, true);
}
