// BST 后继 · 录制帧序列

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, successor, BstNode } from './impl.ts';

export const DEFAULT_INPUT = { keys: [50, 30, 70, 20, 40, 60, 80], key: 50 };

function toViz(node: BstNode | null, path: number[] = [], result?: number): TreeNode | undefined {
  if (node === null) return undefined;
  const onPath = path.includes(node.value);
  return {
    id: String(node.value),
    value: node.value,
    role: result === node.value ? 'final' : onPath ? 'pivot' : 'default',
    children: [node.left, node.right]
      .filter((c): c is BstNode => c !== null)
      .map((c) => toViz(c, path, result)!),
  };
}

export function buildTrace(input: { keys: number[]; key: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { keys, key } = input;
  const root = buildBST(keys);
  const path: number[] = [];

  rec
    .begin({ zh: `找 ${key} 的后继`, en: `Successor of ${key}` })
    .setTree(toViz(root) ?? { id: 'empty', value: '', children: [] })
    .setAux([{ label: '键', value: String(key), role: 'frontier' }])
    .commit();

  const succ = successor(root, key, {
    onStep: (current, _key, candidate, goLeft) => {
      path.push(current);
      rec
        .begin({
          zh: `访问 ${current} → ${goLeft ? '左（更新候选 ' + candidate + '）' : '右'}`,
          en: `Visit ${current} → ${goLeft ? 'left (candidate ' + candidate + ')' : 'right'}`,
        })
        .setTree(toViz(root, path) ?? { id: 'empty', value: '', children: [] })
        .setAux([
          { label: '当前', value: String(current), role: 'pivot' },
          {
            label: '候选',
            value: candidate === null ? 'null' : String(candidate),
            role: 'compare',
          },
        ])
        .commit();
    },
  });

  rec
    .begin({
      zh: succ ? `后继 = ${succ.value}` : `无后继`,
      en: succ ? `successor = ${succ.value}` : `no successor`,
    })
    .setTree(toViz(root, path, succ?.value) ?? { id: 'empty', value: '', children: [] })
    .setAux([{ label: '后继', value: succ ? String(succ.value) : '无', role: 'final' }])
    .commit();

  return rec.build();
}
