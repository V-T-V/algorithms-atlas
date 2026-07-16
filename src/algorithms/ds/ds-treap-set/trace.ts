// =============================================================================
// Treap · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { TreapSet, type TreapHooks } from './impl.ts';

export const DEFAULT_INPUT: { inserts: number[]; deletes: number[] } = {
  inserts: [5, 2, 8, 1, 9, 3, 7, 4, 6],
  deletes: [5, 2],
};

export function buildTrace(
  input: { inserts: number[]; deletes: number[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { inserts, deletes } = input;

  rec
    .begin({ zh: `Treap 插入 [${inserts.join(',')}]`, en: `Treap insert [${inserts.join(',')}]` })
    .commit();

  const hooks: TreapHooks = {
    onInsert: (key, prio) => {
      rec
        .begin({ zh: `插入 ${key}（优先级 ${prio}）`, en: `Insert ${key} (prio ${prio})` })
        .setAux([{ label: '插入', value: `${key}/${prio}`, role: 'compare' }])
        .commit();
    },
    onRotate: (dir, key) => {
      rec
        .begin({
          zh: `${dir === 'left' ? '左' : '右'}旋转（围绕含 ${key} 的子树）`,
          en: `${dir} rotation (around subtree with ${key})`,
        })
        .setAux([{ label: '旋转', value: dir, role: 'frontier' }])
        .commit();
    },
    onDelete: (key) => {
      rec
        .begin({ zh: `删除 ${key}`, en: `Delete ${key}` })
        .setAux([{ label: '删除', value: String(key), role: 'warn' }])
        .commit();
    },
  };

  const tp = new TreapSet(hooks);
  for (const v of inserts) tp.insert(v);
  rec
    .begin({ zh: `中序：[${tp.inorder().join(',')}]`, en: `Inorder: [${tp.inorder().join(',')}]` })
    .setAux([{ label: '有序', value: `[${tp.inorder().join(',')}]`, role: 'final' }])
    .commit();
  for (const v of deletes) tp.delete(v);
  rec
    .begin({
      zh: `删除后中序：[${tp.inorder().join(',')}]`,
      en: `After deletes inorder: [${tp.inorder().join(',')}]`,
    })
    .setAux([{ label: '最终', value: `[${tp.inorder().join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
