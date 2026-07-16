// TOML 子集解析器 · 录制帧序列
// 用 setAux 展示当前节、键值流，用 setMap 展示最终结果。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parseToml, type TomlHooks, type TomlTable } from './impl.ts';

export const DEFAULT_INPUT = `# config
title = "demo"
count = 42
enabled = true

[server]
host = "localhost"
port = 8080
tags = ["api", "web"]
`;

function flatEntries(t: TomlTable, prefix: string): Array<{ key: string; value: string }> {
  const out: Array<{ key: string; value: string }> = [];
  for (const [k, v] of Object.entries(t)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && !Array.isArray(v) && v !== null) {
      out.push(...flatEntries(v as TomlTable, path));
    } else {
      out.push({ key: path, value: JSON.stringify(v) });
    }
  }
  return out;
}

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let curSection = '(root)';
  const kvStream: Array<{ key: string; value: string }> = [];
  let lineNo = 0;
  let result: TomlTable = {};

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: '行', value: String(lineNo), role: 'compare' as BarRole },
        { label: '当前节', value: curSection, role: 'pivot' as BarRole },
        {
          label: '已解析键值',
          value: kvStream.map((x) => `${x.key}=${x.value}`).join(', ') || '∅',
          role: 'frontier' as BarRole,
        },
      ])
      .commit();
  };

  snapshot({ zh: `解析 TOML：${input.length} 字符`, en: `Parse TOML: ${input.length} chars` });

  const hooks: TomlHooks = {
    onLine: (l) => {
      lineNo = l.lineNo;
    },
    onSection: (sec) => {
      curSection = sec;
      snapshot({ zh: `进入节 [${sec}]`, en: `Enter section [${sec}]` });
    },
    onKeyValue: (key, value) => {
      kvStream.push({ key, value: JSON.stringify(value) });
      snapshot({
        zh: `${key} = ${JSON.stringify(value)}`,
        en: `${key} = ${JSON.stringify(value)}`,
      });
    },
  };

  result = parseToml(input, hooks);

  const entries = flatEntries(result, '').map((e) => ({
    key: e.key,
    value: e.value,
    role: 'final' as BarRole,
  }));

  rec
    .begin({ zh: `解析完成`, en: `Parse complete` })
    .setMap(entries)
    .setAux([{ label: '键值总数', value: String(entries.length), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
