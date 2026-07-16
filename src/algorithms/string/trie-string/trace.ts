// =============================================================================
// 字符串 Trie · 录制帧序列
// 用 setAux 展示 Trie 节点列表（id / 字符 / isEnd / count），随插入过程动态增长。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trieString, type TrieStringHooks } from './impl.ts';

export const DEFAULT_INPUT: string[] = ['app', 'apple', 'apply', 'april', 'banana'];

/** 录制演示帧序列。 */
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const words = input;

  // 节点快照：随插入累积
  const rows: Array<{ id: number; ch: string; end: boolean; parent: number }> = [];
  const isNew: Record<number, BarRole> = {};

  const render = (note: { zh: string; en: string }): void => {
    const entries: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'words', value: words.join(', ') },
      { label: 'nodes', value: String(rows.length) },
    ];
    for (const r of rows) {
      entries.push({
        label: `#${r.id}`,
        value: `'${r.ch}' p=${r.parent}${r.end ? ' [END]' : ''}`,
        role: isNew[r.id] ?? 'default',
      });
    }
    rec.begin(note).setAux(entries).commit();
    for (const k of Object.keys(isNew)) delete isNew[Number(k)];
  };

  render({ zh: `构造 Trie：${words.join(', ')}`, en: `Build trie: ${words.join(', ')}` });

  const hooks: TrieStringHooks = {
    onCreateEdge: (parent, child, ch) => {
      rows.push({ id: child, ch, end: false, parent });
      isNew[child] = 'frontier';
    },
    onWalkEdge: (parent, child) => {
      isNew[child] = 'compare';
    },
    onMarkEnd: (node) => {
      const r = rows.find((x) => x.id === node);
      if (r) r.end = true;
      isNew[node] = 'final';
    },
    onVisit: () => {},
  };

  trieString(words, hooks);

  // 终态：列出所有完整单词（前缀枚举）
  rec
    .begin({
      zh: `完成：${rows.filter((r) => r.end).length} 个单词`,
      en: `Done: ${rows.filter((r) => r.end).length} words`,
    })
    .setAux([
      { label: 'words', value: words.join(', '), role: 'final' },
      { label: 'totalNodes', value: String(rows.length) },
    ])
    .commit();

  return rec.build();
}
