// =============================================================================
// Trie · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Trie2 } from './impl.ts';

export const DEFAULT_INPUT = ['apple', 'app', 'apply', 'banana', 'band'];

export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const trie = new Trie2();

  for (const w of input) {
    trie.insert(w);
    rec
      .begin({
        zh: `插入 '${w}'，节点数=${trie.nodeCount}`,
        en: `Insert '${w}', nodes=${trie.nodeCount}`,
      })
      .setBars(w.split('').map((ch) => ({ value: ch.charCodeAt(0), role: 'frontier' })))
      .setAux([{ label: 'nodes', value: String(trie.nodeCount), role: 'pivot' }])
      .commit();
  }

  for (const p of ['app', 'ban', 'xyz']) {
    const c = trie.prefixCount(p);
    rec
      .begin({ zh: `前缀 '${p}' 出现 ${c} 次`, en: `Prefix '${p}' appears ${c} times` })
      .setBars(p.split('').map((ch) => ({ value: ch.charCodeAt(0), role: 'compare' })))
      .setAux([{ label: `prefix('${p}')`, value: String(c), role: 'final' }])
      .commit();
  }

  return rec.build();
}
