// BST 前驱 · 录制帧序列

import type { Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildBST, predecessor, BstNode } from './impl.ts';

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
    .begin({ zh: `找 ${key} 的前驱`, en: `Predecessor of ${key}` })
    .setTree(toViz(root) ?? { id: 'empty', value: '', children: [] })
    .setAux([{ label: '键', value: String(key), role: 'frontier' }])
    .commit();

  const pred = predecessor(root, key, {
    onStep: (current, _key, candidate, goRight) => {
      path.push(current);
      rec
        .begin({
          zh: `访问 ${current} → ${goRight ? '右（更新候选 ' + candidate + '）' : '左'}`,
          en: `Visit ${current} → ${goRight ? 'right (candidate ' + candidate + ')' : 'left'}`,
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
      zh: pred ? `前驱 = ${pred.value}` : `无前驱`,
      en: pred ? `predecessor = ${pred.value}` : `no predecessor`,
    })
    .setTree(toViz(root, path, pred?.value) ?? { id: 'empty', value: '', children: [] })
    .setAux([{ label: '前驱', value: pred ? String(pred.value) : '无', role: 'final' }])
    .commit();

  return rec.build();
}
