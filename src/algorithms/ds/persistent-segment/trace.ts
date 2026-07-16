// =============================================================================
// 可持久化线段树 · 录制帧序列
// 用 setTree 展示当前版本快照；用 setAux 展示版本号 / 版本数 / 该版总和。
// 每次更新产生新版本，仅克隆 O(log n) 路径节点，旧版本子树共享。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { persistentSegment } from './impl.ts';

export const DEFAULT_INPUT = {
  values: [2, 1, 5, 3, 4],
  updates: [
    { pos: 2, val: 8 }, // 版本1：5 -> 8
    { pos: 0, val: 10 }, // 版本2：2 -> 10
  ],
  queries: [
    { version: 0, ql: 0, qr: 4 }, // 历史版本查询
    { version: 2, ql: 0, qr: 4 }, // 最新版本
  ],
};

interface PSN {
  sum: number;
  left: PSN | null;
  right: PSN | null;
}

let nodeSeq = 0;

/** 把节点子树渲染为 viz TreeNode。hotLeaf 高亮某叶子下标路径。 */
function toViz(node: PSN | null, lo: number, hi: number, hotLeaf: number | null): TreeNode | null {
  if (!node) return null;
  const mid = (lo + hi) >> 1;
  const children: TreeNode[] = [];
  if (lo < hi) {
    const l = toViz(node.left, lo, mid, hotLeaf);
    const r = toViz(node.right, mid + 1, hi, hotLeaf);
    if (l) children.push(l);
    if (r) children.push(r);
  }
  const onPath = hotLeaf !== null && lo <= hotLeaf && hotLeaf <= hi;
  const role: BarRole | undefined =
    lo === hi && lo === hotLeaf ? 'pivot' : onPath ? 'compare' : undefined;
  return {
    id: `ps-${nodeSeq++}`,
    value: `${node.sum}[${lo}-${hi}]`,
    role,
    children: children.length ? children : undefined,
  };
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    values: readonly number[];
    updates?: Array<{ pos: number; val: number }>;
    queries?: Array<{ version: number; ql: number; qr: number }>;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const n = input.values.length;
  if (n === 0) {
    rec.begin({ zh: '空数组', en: 'Empty array' }).commit();
    return rec.build();
  }

  const tree = persistentSegment(input.values);

  const snapshot = (
    version: number,
    note: { zh: string; en: string },
    hotLeaf: number | null,
    extraAux: Array<{ label: string; value: string; role?: BarRole }> = [],
  ): void => {
    nodeSeq = 0;
    const root = tree.versions[version]!;
    rec.begin(note);
    rec.setTree(toViz(root as unknown as PSN, 0, n - 1, hotLeaf) ?? { id: 'empty', value: '∅' });
    rec.setAux([
      { label: '版本', value: String(version), role: 'default' },
      { label: '版本数', value: String(tree.versionCount), role: 'final' },
      { label: '该版总和', value: String(tree.query(version, 0, n - 1)), role: 'compare' },
      ...extraAux,
    ]);
    rec.commit();
  };

  snapshot(
    0,
    {
      zh: `版本 0：建树 [${input.values.join(', ')}]`,
      en: `Version 0: built from [${input.values.join(', ')}]`,
    },
    null,
  );

  // —— 更新阶段：每次克隆路径产生新版本 ——
  let curVersion = 0;
  for (const u of input.updates ?? []) {
    const old = tree.query(curVersion, u.pos, u.pos);
    const newVer = tree.update(curVersion, u.pos, u.val);
    snapshot(
      newVer,
      {
        zh: `更新下标 ${u.pos}：${old} → ${u.val}（克隆根→叶路径，产生版本 ${newVer}）`,
        en: `Update idx ${u.pos}: ${old} → ${u.val} (clone root→leaf path, version ${newVer})`,
      },
      u.pos,
    );
    curVersion = newVer;
  }

  // —— 历史版本查询阶段 ——
  for (const q of input.queries ?? []) {
    const arr = tree.toArray(q.version);
    const sum = tree.query(q.version, q.ql, q.qr);
    snapshot(
      q.version,
      {
        zh: `版本 ${q.version} 查询 [${q.ql}, ${q.qr}] = ${sum}（数组 [${arr.join(', ')}]）`,
        en: `Version ${q.version} query [${q.ql}, ${q.qr}] = ${sum} (array [${arr.join(', ')}])`,
      },
      null,
    );
  }

  // 终态：最新版本全标 final
  nodeSeq = 0;
  const markFinal = (node: PSN | null, lo: number, hi: number): TreeNode | null => {
    if (!node) return null;
    const mid = (lo + hi) >> 1;
    const children: TreeNode[] = [];
    if (lo < hi) {
      const l = markFinal(node.left, lo, mid);
      const r = markFinal(node.right, mid + 1, hi);
      if (l) children.push(l);
      if (r) children.push(r);
    }
    return {
      id: `f-${nodeSeq++}`,
      value: `${node.sum}[${lo}-${hi}]`,
      role: 'final',
      children: children.length ? children : undefined,
    };
  };
  rec
    .begin({
      zh: `完成；共 ${tree.versionCount} 个版本（旧版本子树共享，仅克隆更新路径）`,
      en: `Done; ${tree.versionCount} versions (old subtrees shared, only update path cloned)`,
    })
    .setTree(
      markFinal(tree.versions[curVersion] as unknown as PSN, 0, n - 1) ?? {
        id: 'empty',
        value: '∅',
      },
    )
    .commit();

  return rec.build();
}
