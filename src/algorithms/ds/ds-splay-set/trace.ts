// =============================================================================
// 伸展树 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SplaySet, type SplayHooks } from './impl.ts';

export const DEFAULT_INPUT: { inserts: number[]; queries: number[] } = {
  inserts: [5, 2, 8, 1, 9, 3, 7, 4, 6],
  queries: [3, 1, 9],
};

export function buildTrace(
  input: { inserts: number[]; queries: number[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { inserts, queries } = input;

  rec
    .begin({ zh: `Splay 插入 [${inserts.join(',')}]`, en: `Splay insert [${inserts.join(',')}]` })
    .commit();

  const hooks: SplayHooks = {
    onInsert: (key) => {
      rec
        .begin({ zh: `插入 ${key}`, en: `Insert ${key}` })
        .setAux([{ label: '插入', value: String(key), role: 'compare' }])
        .commit();
    },
    onSplay: (key) => {
      rec
        .begin({ zh: `splay：把含 ${key} 的节点旋转到根`, en: `Splay ${key} to root` })
        .setAux([{ label: 'splay', value: String(key), role: 'frontier' }])
        .commit();
    },
  };

  const sp = new SplaySet(hooks);
  for (const v of inserts) sp.insert(v);
  rec
    .begin({ zh: `中序：[${sp.inorder().join(',')}]`, en: `Inorder: [${sp.inorder().join(',')}]` })
    .setAux([{ label: '有序', value: `[${sp.inorder().join(',')}]`, role: 'final' }])
    .commit();
  for (const q of queries) {
    const found = sp.search(q);
    rec
      .begin({
        zh: `search(${q}) = ${found}（已 splay 到根）`,
        en: `search(${q}) = ${found} (splayed to root)`,
      })
      .setAux([{ label: String(q), value: String(found), role: found ? 'final' : 'warn' }])
      .commit();
  }

  return rec.build();
}
