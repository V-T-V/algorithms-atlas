import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { TextEditor } from './impl.ts';

export const DEFAULT_INPUT = ['h', 'e', 'l', 'l', 'o', 'undo', 'undo'];

type Op = string;

export function buildTrace(input: readonly Op[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const editor = new TextEditor({
    onSave: (snapshot, depth) =>
      rec
        .begin({
          zh: `保存快照 "${snapshot}"（栈深 ${depth}）`,
          en: `Save snapshot "${snapshot}" (depth ${depth})`,
        })
        .setAux([
          { label: '当前文本', value: editor.getText(), role: 'final' as BarRole },
          { label: '快照栈', value: String(depth), role: 'pivot' as BarRole },
        ])
        .commit(),
    onRestore: (snapshot, depth) =>
      rec
        .begin({
          zh: `恢复到 "${snapshot}"（栈深 ${depth}）`,
          en: `Restore to "${snapshot}" (depth ${depth})`,
        })
        .setAux([
          { label: '当前文本', value: editor.getText(), role: 'final' as BarRole },
          { label: '快照栈', value: String(depth), role: 'compare' as BarRole },
        ])
        .commit(),
    onChange: (text) =>
      rec
        .begin({ zh: `输入后文本 = "${text}"`, en: `After typing text = "${text}"` })
        .setAux([{ label: '当前文本', value: text, role: 'frontier' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '初始空编辑器', en: 'Initial empty editor' })
    .setAux([{ label: '当前文本', value: '', role: 'default' as BarRole }])
    .commit();
  for (const op of input) {
    if (op === 'undo') editor.undo();
    else if (op === 'save') editor.save();
    else editor.type(op);
  }
  rec
    .begin({ zh: `最终文本 = "${editor.getText()}"`, en: `Final text = "${editor.getText()}"` })
    .setAux([{ label: '当前文本', value: editor.getText(), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
