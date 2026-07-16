// BST 查找 · 录制帧序列

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, search, BstNode } from './impl.ts';

export const DEFAULT_INPUT = { keys: [50, 30, 70, 20, 40, 60, 80], target: 60 };

function toViz(node: BstNode | null, path: number[] = [], found?: number): TreeNode | undefined {
  if (node === null) return undefined;
  const onPath = path.includes(node.value);
  return {
    id: String(node.value),
    value: node.value,
    role: found === node.value ? 'final' : onPath ? 'pivot' : 'default',
    children: [node.left, node.right]
      .filter((c): c is BstNode => c !== null)
      .map((c) => toViz(c, path, found)!),
  };
}

export function buildTrace(input: { keys: number[]; target: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { keys, target } = input;
  const root = buildBST(keys);

  const path: number[] = [];
  rec
    .begin({ zh: `BST 查找 ${target}`, en: `BST search ${target}` })
    .setTree(toViz(root) ?? { id: 'empty', value: '', children: [] })
    .setAux([{ label: '目标', value: String(target), role: 'frontier' }])
    .commit();

  const found = search(root, target, {
    onCompare: (current, _key, dir) => {
      if (!Number.isNaN(current)) path.push(current);
      rec
        .begin({
          zh: Number.isNaN(current)
            ? `未命中`
            : `比较 ${current} → ${dir === 'equal' ? '命中' : dir === 'left' ? '向左' : '向右'}`,
          en: Number.isNaN(current) ? `miss` : `compare ${current} → ${dir}`,
        })
        .setTree(toViz(root, path) ?? { id: 'empty', value: '', children: [] })
        .setAux([
          {
            label: '当前',
            value: Number.isNaN(current) ? 'null' : String(current),
            role: 'compare',
          },
        ])
        .commit();
    },
  });

  rec
    .begin({
      zh: found ? `找到 ${target}` : `未找到 ${target}`,
      en: found ? `found ${target}` : `${target} not found`,
    })
    .setTree(toViz(root, path, found?.value) ?? { id: 'empty', value: '', children: [] })
    .setAux([{ label: '结果', value: found ? `命中 ${target}` : '未找到', role: 'final' }])
    .commit();

  return rec.build();
}
