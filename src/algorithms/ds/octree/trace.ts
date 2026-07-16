// =============================================================================
// 八叉树 · 录制帧序列
// 用 setTree 展示八叉树划分结构（节点值 = 深度:点数），setAux 展示各体素统计。
// 插入点标 'compare'，分裂节点标 'swap'，查询命中标 'final'。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Octree, type Box, type OctreeHooks, type Point3D } from './impl.ts';

export const DEFAULT_INPUT = {
  bounds: { x1: 0, y1: 0, z1: 0, x2: 8, y2: 8, z2: 8 } as Box,
  capacity: 2,
  points: [
    { x: 1, y: 1, z: 1 },
    { x: 1, y: 2, z: 1 },
    { x: 6, y: 1, z: 1 },
    { x: 6, y: 6, z: 6 },
    { x: 7, y: 7, z: 7 },
    { x: 3, y: 3, z: 3 },
    { x: 4, y: 4, z: 4 },
    { x: 2, y: 6, z: 2 },
  ] as Point3D[],
  queries: [{ x1: 5, y1: 5, z1: 5, x2: 8, y2: 8, z2: 8 } as Box],
};

interface VizNode {
  bounds: Box;
  depth: number;
  points: Point3D[];
  children: VizNode[];
  id: string;
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    bounds: Box;
    capacity?: number;
    points: readonly Point3D[];
    queries?: readonly Box[];
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const pts = input.points;

  const vizRoot: VizNode = { bounds: input.bounds, depth: 0, points: [], children: [], id: 'r' };
  let counter = 1;
  const findLeaf = (bounds: Box, depth: number): VizNode => {
    const walk = (n: VizNode): VizNode => {
      if (n.children.length === 0 && n.depth === depth) {
        if (
          n.bounds.x1 === bounds.x1 &&
          n.bounds.y1 === bounds.y1 &&
          n.bounds.z1 === bounds.z1 &&
          n.bounds.x2 === bounds.x2 &&
          n.bounds.y2 === bounds.y2 &&
          n.bounds.z2 === bounds.z2
        )
          return n;
      }
      for (const c of n.children) {
        const r = walk(c);
        if (r && r !== vizRoot) return r;
      }
      return n;
    };
    return walk(vizRoot);
  };

  let hotPoint = -1;
  let splitDepth = -1;
  let hitCount = -1;

  const toTreeNode = (vn: VizNode): TreeNode => {
    let role: BarRole | undefined;
    if (vn.depth === splitDepth && vn.children.length === 8) role = 'swap';
    return {
      id: vn.id,
      value: `d${vn.depth}:${vn.points.length}`,
      children: vn.children.length ? vn.children.map(toTreeNode) : undefined,
      role,
    };
  };

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setTree(toTreeNode(vizRoot))
      .setAux([
        {
          label: '插入点',
          value: hotPoint >= 0 ? `#${hotPoint}` : '-',
          role: (hotPoint >= 0 ? 'compare' : 'default') as BarRole,
        },
        {
          label: '查询命中',
          value: hitCount >= 0 ? `${hitCount}` : '-',
          role: (hitCount > 0 ? 'final' : 'default') as BarRole,
        },
      ])
      .commit();
  };

  render({
    zh: `3D 点集 ${pts.length} 个，立方体 ${input.bounds.x2}³`,
    en: `${pts.length} 3D points, cube ${input.bounds.x2}^3`,
  });

  const ot = new Octree(input.bounds, input.capacity ?? 4);

  const insertHooks: OctreeHooks = {
    onInsert: (p, depth) => {
      const leaf = findLeaf(ot.root.bounds, depth);
      void leaf;
      void p;
    },
    onSplit: (bounds, depth) => {
      const leaf = findLeaf(bounds, depth);
      splitDepth = depth;
      const { x1, y1, z1, x2, y2, z2 } = bounds;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const mz = (z1 + z2) / 2;
      const voxels: VizNode[] = [];
      for (const [lx, hx] of [
        [x1, mx],
        [mx, x2],
      ]) {
        for (const [ly, hy] of [
          [y1, my],
          [my, y2],
        ]) {
          for (const [lz, hz] of [
            [z1, mz],
            [mz, z2],
          ]) {
            voxels.push({
              bounds: { x1: lx!, y1: ly!, z1: lz!, x2: hx!, y2: hy!, z2: hz! },
              depth: depth + 1,
              points: [],
              children: [],
              id: `n${counter++}`,
            });
          }
        }
      }
      for (const p of leaf.points) {
        for (const v of voxels) {
          if (pointIn(p, v.bounds)) {
            v.points.push(p);
            break;
          }
        }
      }
      leaf.points = [];
      leaf.children = voxels;
      render({ zh: `节点超容量，分裂为 8 体素`, en: `Node over capacity, split into 8 voxels` });
    },
  };

  const pointIn = (p: Point3D, b: Box): boolean =>
    p.x >= b.x1 && p.x <= b.x2 && p.y >= b.y1 && p.y <= b.y2 && p.z >= b.z1 && p.z <= b.z2;

  for (let i = 0; i < pts.length; i++) {
    hotPoint = i;
    splitDepth = -1;
    ot.insert(pts[i]!, insertHooks);
    render({
      zh: `插入点 ${i} (${pts[i]!.x},${pts[i]!.y},${pts[i]!.z})`,
      en: `Insert point ${i} (${pts[i]!.x},${pts[i]!.y},${pts[i]!.z})`,
    });
  }

  for (const q of input.queries ?? []) {
    hitCount = -1;
    render({ zh: `3D 区域查询 [${q.x1}-${q.x2}]³`, en: `3D range query [${q.x1}-${q.x2}]^3` });
    const result = ot.queryRange(q);
    hitCount = result.length;
    render({ zh: `命中 ${result.length} 个点`, en: `${result.length} points hit` });
  }

  hotPoint = -1;
  splitDepth = -1;
  rec.begin({ zh: `完成`, en: `Done` }).setTree(toTreeNode(vizRoot)).commit();

  return rec.build();
}
