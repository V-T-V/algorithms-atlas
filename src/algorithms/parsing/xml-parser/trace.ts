// 简单 XML/SAX 解析 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parseXml, type XmlHooks, type XmlStart } from './impl.ts';

export const DEFAULT_INPUT =
  '<?xml version="1.0"?><book title="Atlas"><author id="1">Alice</author><chapter/><note>Hi &amp; bye</note></book>';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const events: Array<{ label: string; value: string }> = [];
  let depth = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '事件数', value: String(events.length), role: 'pivot' as BarRole },
      { label: '嵌套深度', value: String(depth), role: 'frontier' as BarRole },
    ];
    for (const e of events.slice(-4))
      aux.push({ label: e.label, value: e.value, role: 'compare' as BarRole });
    rec.begin(note).setAux(aux).commit();
  };

  snapshot({ zh: `SAX 解析 XML：${input.length} 字符`, en: `SAX parse: ${input.length} chars` });

  const hooks: XmlHooks = {
    onStart: (tag: XmlStart) => {
      depth++;
      events.push({ label: 'start', value: `<${tag.name}${tag.selfClosing ? '/' : ''}>` });
      snapshot({ zh: `开始 ${tag.name}`, en: `Start ${tag.name}` });
      if (tag.selfClosing) depth--;
    },
    onText: (t) => {
      events.push({ label: 'text', value: `"${t}"` });
      snapshot({ zh: `文本 "${t}"`, en: `Text "${t}"` });
    },
    onEnd: (name) => {
      depth = Math.max(0, depth - 1);
      events.push({ label: 'end', value: `</${name}>` });
      snapshot({ zh: `结束 ${name}`, en: `End ${name}` });
    },
  };

  parseXml(input, hooks);

  rec
    .begin({ zh: `解析完成`, en: `Parse complete` })
    .setAux([{ label: '事件总数', value: String(events.length), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
