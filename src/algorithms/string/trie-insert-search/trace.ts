// =============================================================================
// Trie 插入与查找 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTrie, type SimpleTrieHooks } from './impl.ts';

export const DEFAULT_INPUT: { words: string[]; queries: string[] } = {
  words: ['apple', 'app', 'apt', 'bat'],
  queries: ['app', 'apple', 'ap', 'bat', 'cat'],
};

export function buildTrace(input: { words: string[]; queries: string[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { words, queries } = input;

  rec
    .begin({ zh: `建 Trie：${JSON.stringify(words)}`, en: `Build trie: ${JSON.stringify(words)}` })
    .setAux([{ label: '词数', value: String(words.length), role: 'frontier' }])
    .commit();

  const hooks: SimpleTrieHooks = {
    onCreate: (parent, ch, newNode) => {
      rec
        .begin({
          zh: `建节点 #${newNode}（父 #${parent}，字符 '${ch}'）`,
          en: `Create node #${newNode} (parent #${parent}, char '${ch}')`,
        })
        .setAux([{ label: '新建', value: `#${newNode} '${ch}'`, role: 'compare' }])
        .commit();
    },
    onMarkEnd: (id) => {
      rec
        .begin({ zh: `标记 #${id} 为词尾`, en: `Mark #${id} as word end` })
        .setAux([{ label: '词尾', value: `#${id}`, role: 'final' }])
        .commit();
    },
  };

  const trie = buildTrie(words, hooks);

  // 查询演示
  for (const q of queries) {
    const found = trie.search(q);
    const pref = trie.startsWith(q);
    rec
      .begin({
        zh: `search("${q}") = ${found}, startsWith = ${pref}`,
        en: `search("${q}") = ${found}, startsWith = ${pref}`,
      })
      .setAux([
        { label: '查询', value: q, role: 'compare' },
        { label: 'search', value: String(found), role: found ? 'final' : 'warn' },
        { label: 'prefix', value: String(pref), role: pref ? 'frontier' : 'warn' },
      ])
      .commit();
  }

  return rec.build();
}
