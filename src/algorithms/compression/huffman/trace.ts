// =============================================================================
// 哈夫曼编码 · 录制帧序列
// 用 setTree 展示建树/合并过程，setMap 展示字符→编码表。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { huffman, type HuffmanHooks, type HuffmanNode } from './impl.ts';

export const DEFAULT_INPUT = 'ABRACADABRA';

/** 把 HuffmanNode 转成可视化 TreeNode（内部节点显示频次，叶子显示 字符(频次)）。 */
function toTreeNode(n: HuffmanNode): TreeNode {
  if (n.ch !== null) {
    return {
      id: String(n.id),
      value: `${n.ch}:${n.freq}`,
      role: 'final' as BarRole,
    };
  }
  return {
    id: String(n.id),
    value: String(n.freq),
    role: 'pivot' as BarRole,
    children: [n.left, n.right]
      .filter((c): c is HuffmanNode => c !== null)
      .map((c) => toTreeNode(c)),
  };
}

/** 为新建的合并节点单独标 role='compare'（其它为默认）。 */
function toTreeNodeHighlight(n: HuffmanNode, highlightId: number | null): TreeNode {
  if (n.ch !== null) {
    return {
      id: String(n.id),
      value: `${n.ch}:${n.freq}`,
      role: n.id === highlightId ? ('compare' as BarRole) : ('final' as BarRole),
    };
  }
  return {
    id: String(n.id),
    value: String(n.freq),
    role: n.id === highlightId ? ('compare' as BarRole) : ('pivot' as BarRole),
    children: [n.left, n.right]
      .filter((c): c is HuffmanNode => c !== null)
      .map((c) => toTreeNodeHighlight(c, highlightId)),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  // 频次表帧（setMap 展示频次）
  const freqEntries: Array<{ key: string; value: string; role?: BarRole }> = [];
  let currentRoot: HuffmanNode | null = null;
  let highlightId: number | null = null;

  const snapshotTree = (note: { zh: string; en: string }): void => {
    if (currentRoot) {
      rec.begin(note).setTree(toTreeNodeHighlight(currentRoot, highlightId)).commit();
    } else {
      rec.begin(note).commit();
    }
  };

  rec.begin({ zh: `输入「${input}」`, en: `Input "${input}"` }).commit();

  const hooks: HuffmanHooks = {
    onBuildFreq: (freq) => {
      freqEntries.length = 0;
      const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);
      for (const [ch, f] of sorted) {
        freqEntries.push({ key: ch, value: String(f), role: 'compare' as BarRole });
      }
      rec
        .begin({
          zh: `统计频次：共 ${freq.size} 种字符`,
          en: `Frequency: ${freq.size} distinct chars`,
        })
        .setMap(freqEntries)
        .commit();
    },
    onMerge: (a, b, merged) => {
      currentRoot = merged;
      highlightId = merged.id;
      snapshotTree({
        zh: `合并最小两项 ${a.freq} + ${b.freq} = ${merged.freq}`,
        en: `Merge two smallest ${a.freq} + ${b.freq} = ${merged.freq}`,
      });
      highlightId = null;
    },
    onAssignCode: () => {
      // 不每字符一帧（避免冗余），在 build 后统一展示
    },
  };

  const result = huffman(input, hooks);
  currentRoot = result.root;
  highlightId = null;

  // 终态：完整树
  if (currentRoot) {
    rec
      .begin({ zh: '哈夫曼树构建完成', en: 'Huffman tree built' })
      .setTree(toTreeNode(currentRoot))
      .commit();
  }

  // 码表 + 编码结果
  const codeEntries: Array<{ key: string; value: string; role?: BarRole }> = [];
  const sortedCodes = [...result.codes.entries()].sort(
    (a, b) => a[1].length - b[1].length || a[1].localeCompare(b[1]),
  );
  for (const [ch, code] of sortedCodes) {
    codeEntries.push({ key: ch, value: code, role: 'final' as BarRole });
  }

  rec
    .begin({
      zh: `编码完成：${result.encodedBits} 位（原始 ${result.originalBits} 位，压缩比 ${result.originalBits / Math.max(result.encodedBits, 1)}）`,
      en: `Encoded: ${result.encodedBits} bits (orig ${result.originalBits}, ratio ${result.originalBits / Math.max(result.encodedBits, 1)})`,
    })
    .setMap(codeEntries)
    .commit();

  return rec.build();
}
