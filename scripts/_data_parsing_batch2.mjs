// parsing batch 2 — 30 new algorithms (70 -> 100)
export const algos = [
// 1. parse-antlr-style
{
  id: 'parse-antlr-style',
  titleZh: 'ANTLR 风格词法', titleEn: 'ANTLR-Style Lexer',
  summaryZh: '基于规则优先级的词法分析器，最长匹配 + 规则序号决胜。',
  summaryEn: 'Rule-priority lexer with longest-match then rule-index tie-breaking.',
  descZh: 'ANTLR 风格：对每个 token 类型定义正则，按声明顺序匹配，最长优先，平手时先声明的胜。',
  descEn: 'ANTLR-style: each token type has a regex; match by declaration order, longest wins, ties to earlier rule.',
  tags: ['parsing','lexer'],
  time: 'O(n·r)', space: 'O(r)',
  impl: `// ANTLR 风格词法 · 实现
export interface Token { type: string; value: string; }
export interface LexerHooks { onToken?: (t: Token, pos: number) => void; }
export function antlrStyleLexer(input: string, rules: Array<{ type: string; re: RegExp }>, hooks: LexerHooks = {}): Token[] {
  const tokens: Token[] = [];
  let pos = 0;
  while (pos < input.length) {
    if (/\s/.test(input[pos]!)) { pos++; continue; }
    let best: Token | null = null; let bestLen = 0;
    for (const rule of rules) {
      const m = input.slice(pos).match(rule.re);
      if (m && m.index === 0 && m[0]!.length > bestLen) {
        best = { type: rule.type, value: m[0]! };
        bestLen = m[0]!.length;
      }
    }
    if (!best) throw new Error(\`Unexpected char at \${pos}: '\${input[pos]}'\`);
    tokens.push(best);
    hooks.onToken?.(best, pos);
    pos += bestLen;
  }
  return tokens;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { antlrStyleLexer } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = '123 + abc';
  const codes = [...input].map((c) => c.charCodeAt(0));
  const rules = [{ type: 'NUM', re: /\d+/ }, { type: 'OP', re: /[+]/ }, { type: 'ID', re: /[a-z]+/ }];
  rec.begin({ zh: 'ANTLR 词法', en: 'ANTLR lexer' }).setArray(codes, codes.map(() => 'default' as BarRole)).commit();
  antlrStyleLexer(input, rules, {
    onToken: (t, p) => rec.begin({ zh: \`\${t.type}:'\${t.value}' @\${p}\`, en: \`\${t.type}:'\${t.value}' @\${p}\` })
      .setArray(codes, codes.map((_, i) => (i >= p && i < p + t.value.length ? 'swap' : 'default') as BarRole), [{ index: p, label: 'pos' }])
      .setAux([{ label: 'tok', value: \`\${t.type}:\${t.value}\`, role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { antlrStyleLexer } from '../../src/algorithms/parsing/parse-antlr-style/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-antlr-style/trace.ts';
test('词法分析', () => {
  const t = antlrStyleLexer('42 + x', [{ type: 'NUM', re: /\d+/ }, { type: 'OP', re: /[+]/ }, { type: 'ID', re: /[a-z]/ }]);
  assert.deepEqual(t.map((x) => x.type), ['NUM', 'OP', 'ID']);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 2. parse-bison-style
{
  id: 'parse-bison-style',
  titleZh: 'Bison 风格 LALR', titleEn: 'Bison-Style LALR',
  summaryZh: '声明式文法 + LALR(1) 表生成，冲突用优先级解决。',
  summaryEn: 'Declarative grammar + LALR(1) table; conflicts resolved by precedence.',
  descZh: 'Bison 风格：声明产生式与优先级，工具构造 LALR(1) 分析表，移进/归约冲突按优先级与结合性裁决。',
  descEn: 'Bison: declare productions and precedence; build LALR(1) table; resolve shift/reduce via precedence/associativity.',
  tags: ['parsing','lalr','parser-generator'],
  time: 'O(n)', space: 'O(|G|)',
  impl: `// Bison 风格 LALR (简化: 算术表达式归约) · 实现
export interface BisonHooks { onShift?: (tok: string) => void; onReduce?: (rule: string) => void; onAccept?: () => void; }
export function bisonStyleParse(tokens: readonly string[], hooks: BisonHooks = {}): boolean {
  const prec: Record<string, number> = { '+': 1, '*': 2 };
  const stack: string[] = [];
  let i = 0;
  const reduce = (): boolean => {
    // E -> E op E  (右结合优先级高者先归约)
    while (stack.length >= 3) {
      const n = stack.length;
      const a = stack[n - 3]!, op = stack[n - 2]!, b = stack[n - 1]!;
      if (a === 'E' && b === 'E' && op in prec) {
        const next = tokens[i];
        if (next !== undefined && next in prec && prec[next]! > prec[op]!) return false; // 让位
        stack.splice(n - 3, 3, 'E');
        hooks.onReduce?.(\`E -> E \${op} E\`);
      } else break;
    }
    return true;
  };
  while (i < tokens.length) {
    const t = tokens[i]!;
    if (/\d/.test(t)) { stack.push('E'); hooks.onShift?.(t); i++; }
    else if (t in prec) { stack.push(t); hooks.onShift?.(t); i++; reduce(); }
    else return false;
  }
  while (reduce()) { if (stack.length === 1) break; }
  if (stack.length === 1 && stack[0] === 'E') { hooks.onAccept?.(); return true; }
  return false;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bisonStyleParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const toks = ['2', '+', '3', '*', '4'];
  rec.begin({ zh: 'Bison LALR', en: 'Bison' }).setArray(toks.map((t) => t.charCodeAt(0)), toks.map(() => 'default' as BarRole)).commit();
  bisonStyleParse(toks, {
    onShift: (t) => rec.begin({ zh: \`shift \${t}\`, en: \`shift \${t}\` }).setAux([{ label: 'op', value: t, role: 'compare' as BarRole }]).commit(),
    onReduce: (r) => rec.begin({ zh: \`归约 \${r}\`, en: \`reduce \${r}\` }).setAux([{ label: 'rule', value: r, role: 'final' as BarRole }]).commit(),
    onAccept: () => rec.begin({ zh: '接受', en: 'accept' }).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bisonStyleParse } from '../../src/algorithms/parsing/parse-bison-style/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-bison-style/trace.ts';
test('Bison 风格解析算术', () => {
  assert.equal(bisonStyleParse(['2', '+', '3', '*', '4']), true);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 3. parse-stream-json
{
  id: 'parse-stream-json',
  titleZh: '流式 JSON', titleEn: 'Streaming JSON',
  summaryZh: '增量解析大 JSON，避免一次性加载到内存。',
  summaryEn: 'Incrementally parse large JSON without loading it all into memory.',
  descZh: '流式 JSON：维护状态机(对象/数组/键/值/字符串/数字)，每喂一块字符产出已完成的值。',
  descEn: 'Streaming JSON: state machine (obj/arr/key/val/str/num); emit completed values per chunk.',
  tags: ['parsing','json','streaming'],
  time: 'O(n)', space: 'O(d)',
  impl: `// 流式 JSON · 实现 (提取顶层数字/字符串数组元素)
export interface StreamJsonHooks { onValue?: (v: string | number) => void; }
export function streamJsonParse(chunks: readonly string[], hooks: StreamJsonHooks = {}): (string | number)[] {
  const out: (string | number)[] = [];
  let buf = '';
  let inStr = false, esc = false, depth = 0, valStart = -1;
  const flush = (end: number) => {
    if (valStart < 0) return;
    const raw = buf.slice(valStart, end).trim();
    valStart = -1;
    if (!raw) return;
    if (raw[0] === '"') out.push(JSON.parse(raw));
    else if (!isNaN(Number(raw))) out.push(Number(raw));
    else out.push(raw);
    hooks.onValue?.(out[out.length - 1]!);
  };
  for (const chunk of chunks) {
    for (let i = 0; i < chunk.length; i++) {
      const c = chunk[i]!;
      buf += c;
      if (inStr) {
        if (esc) esc = false;
        else if (c === '\\\\') esc = true;
        else if (c === '"') { inStr = false; if (depth > 0) flush(buf.length); }
        continue;
      }
      if (c === '"') { inStr = true; if (valStart < 0) valStart = buf.length - 1; }
      else if (c === '[' || c === '{') depth++;
      else if (c === ']' || c === '}') depth--;
      else if (c === ',' || c === ':' || c === ']' || c === '}') { if (valStart >= 0 && depth >= 0) flush(buf.length - 1); }
      else if (valStart < 0 && /[^\s,{}\[\]:]/.test(c)) valStart = buf.length - 1;
    }
  }
  if (valStart >= 0) flush(buf.length);
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { streamJsonParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '流式 JSON', en: 'Stream JSON' }).commit();
  const vals = streamJsonParse(['[1, "he', 'llo", 3', '.5, true]'], {
    onValue: (v) => rec.begin({ zh: \`值: \${typeof v === 'string' ? '"' + v + '"' : v}\`, en: \`value: \${v}\` })
      .setAux([{ label: 'val', value: String(v), role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`共 \${vals.length} 值\`, en: \`total \${vals.length}\` }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { streamJsonParse } from '../../src/algorithms/parsing/parse-stream-json/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-stream-json/trace.ts';
test('流式解析数组', () => {
  const v = streamJsonParse(['[1, "ab", 3]']);
  assert.deepEqual(v, [1, 'ab', 3]);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 4. parse-stream-xml
{
  id: 'parse-stream-xml',
  titleZh: '流式 XML (SAX)', titleEn: 'Streaming XML (SAX)',
  summaryZh: '事件驱动 XML 解析，遇标签/文本触发回调。',
  summaryEn: 'Event-driven XML parsing; callbacks fire on tags and text.',
  descZh: 'SAX：逐字符扫描，遇到开始标签、结束标签、文本分别触发 onStart/onText/onEnd，不建树。',
  descEn: 'SAX: scan char by char; fire onStart/onText/onEnd for tags and text; no tree built.',
  tags: ['parsing','xml','sax'],
  time: 'O(n)', space: 'O(d)',
  impl: `// 流式 XML (SAX) · 实现
export interface SaxHooks { onStart?: (tag: string, attrs: Record<string, string>) => void; onText?: (text: string) => void; onEnd?: (tag: string) => void; }
export function saxParse(xml: string, hooks: SaxHooks = {}): void {
  let i = 0;
  while (i < xml.length) {
    if (xml[i] === '<') {
      if (xml[i + 1] === '/') {
        const end = xml.indexOf('>', i);
        const tag = xml.slice(i + 2, end).trim();
        hooks.onEnd?.(tag);
        i = end + 1;
      } else {
        const end = xml.indexOf('>', i);
        const body = xml.slice(i + 1, end);
        const selfClose = body.endsWith('/');
        const clean = selfClose ? body.slice(0, -1) : body;
        const sp = clean.indexOf(' ');
        const tag = (sp < 0 ? clean : clean.slice(0, sp)).trim();
        const attrs: Record<string, string> = {};
        const attrRe = /(\w+)="([^"]*)"/g;
        let m: RegExpExecArray | null;
        while ((m = attrRe.exec(clean)) !== null) attrs[m[1]!] = m[2]!;
        hooks.onStart?.(tag, attrs);
        if (selfClose) hooks.onEnd?.(tag);
        i = end + 1;
      }
    } else {
      const next = xml.indexOf('<', i);
      const text = (next < 0 ? xml.slice(i) : xml.slice(i, next)).trim();
      if (text) hooks.onText?.(text);
      i = next < 0 ? xml.length : next;
    }
  }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { saxParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SAX XML', en: 'SAX XML' }).commit();
  saxParse('<a x="1"><b>hi</b></a>', {
    onStart: (t, a) => rec.begin({ zh: \`<\${t}>\`, en: \`<\${t}>\` })
      .setAux([{ label: 'tag', value: t, role: 'final' as BarRole }, { label: 'attrs', value: JSON.stringify(a), role: 'compare' as BarRole }]).commit(),
    onText: (txt) => rec.begin({ zh: \`text: \${txt}\`, en: \`text: \${txt}\` }).setAux([{ label: 'text', value: txt, role: 'pivot' as BarRole }]).commit(),
    onEnd: (t) => rec.begin({ zh: \`</\${t}>\`, en: \`</\${t}>\` }).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { saxParse } from '../../src/algorithms/parsing/parse-stream-xml/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-stream-xml/trace.ts';
test('SAX 解析 XML', () => {
  const events: string[] = [];
  saxParse('<a><b>x</b></a>', { onStart: (t) => events.push('S' + t), onEnd: (t) => events.push('E' + t), onText: (x) => events.push('T' + x) });
  assert.deepEqual(events, ['Sa', 'Sb', 'Tx', 'Eb', 'Ea']);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 5. parse-yaml
{
  id: 'parse-yaml',
  titleZh: 'YAML 解析', titleEn: 'YAML Parser',
  summaryZh: '按缩进构建嵌套映射/序列，支持基本标量。',
  summaryEn: 'Build nested maps/sequences by indentation; basic scalars supported.',
  descZh: 'YAML 子集解析：按缩进栈构造对象/数组，每行 "key: value" 或 "- item"。',
  descEn: 'YAML subset: build objects/arrays via indent stack; lines "key: value" or "- item".',
  tags: ['parsing','yaml'],
  time: 'O(n)', space: 'O(d)',
  impl: `// YAML 解析 (子集) · 实现
export function yamlParse(text: string): unknown {
  const lines = text.split('\n').map((l) => l.replace(/#.*$/, '')).filter((l) => l.trim());
  const root: unknown = Array.isArray(lines[0] && lines[0]!.trim().match(/^[\\- ]*\\-/)) ? [] : {};
  const stack: { indent: number; node: unknown }[] = [{ indent: -1, node: root }];
  for (const raw of lines) {
    const indent = raw.length - raw.trimStart().length;
    const line = raw.trim();
    while (stack.length > 1 && stack[stack.length - 1]!.indent >= indent) stack.pop();
    const parent = stack[stack.length - 1]!.node;
    const m = line.match(/^-\\s*(.*)$/);
    if (m) {
      const arr = parent as unknown[];
      if (m[1]!.includes(':')) {
        const obj: Record<string, unknown> = {}; arr.push(obj); stack.push({ indent, node: obj });
        const [k, ...rest] = m[1]!.split(':'); if (rest.join(':').trim()) obj[k.trim()] = rest.join(':').trim();
      } else arr.push(parseScalar(m[1]!));
    } else if (line.includes(':')) {
      const idx = line.indexOf(':');
      const k = line.slice(0, idx).trim();
      const v = line.slice(idx + 1).trim();
      const obj = parent as Record<string, unknown>;
      if (v === '') { const child: Record<string, unknown> = {}; obj[k] = child; stack.push({ indent, node: child }); }
      else obj[k] = parseScalar(v);
    }
  }
  return root;
}
function parseScalar(s: string): unknown {
  if (s === 'true') return true; if (s === 'false') return false; if (s === 'null') return null;
  const n = Number(s); return isNaN(n) || s === '' ? s.replace(/^["']|["']$/g, '') : n;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { yamlParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const yaml = 'name: test\\nage: 3\\nitems:\\n  - 1\\n  - 2';
  rec.begin({ zh: 'YAML 解析', en: 'YAML parse' }).setArray([...yaml].map((c) => c.charCodeAt(0)), [...yaml].map(() => 'default' as BarRole)).commit();
  const obj = yamlParse(yaml) as Record<string, unknown>;
  rec.begin({ zh: '结果', en: 'result' })
    .setAux(Object.entries(obj).map(([k, v]) => ({ label: k, value: JSON.stringify(v), role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { yamlParse } from '../../src/algorithms/parsing/parse-yaml/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-yaml/trace.ts';
test('YAML 解析标量', () => {
  const o = yamlParse('a: 1\\nb: hello') as Record<string, unknown>;
  assert.equal(o.a, 1);
  assert.equal(o.b, 'hello');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 6. parse-ini
{
  id: 'parse-ini',
  titleZh: 'INI 解析', titleEn: 'INI Parser',
  summaryZh: '解析 [section]/key=value 配置格式。',
  summaryEn: 'Parse [section]/key=value configuration format.',
  descZh: 'INI：行 [sec] 进入节，key=value 写入当前节；# ; 注释忽略。',
  descEn: 'INI: [sec] enters section, key=value writes into current section; # ; comments ignored.',
  tags: ['parsing','config'],
  time: 'O(n)', space: 'O(s)',
  impl: `// INI 解析 · 实现
export interface IniHooks { onSection?: (name: string) => void; onKey?: (section: string, key: string, value: string) => void; }
export function iniParse(text: string, hooks: IniHooks = {}): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};
  let section = '';
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || line.startsWith(';')) continue;
    const sec = line.match(/^\[(.+)\]$/);
    if (sec) { section = sec[1]!.trim(); result[section] = {}; hooks.onSection?.(section); continue; }
    const eq = line.indexOf('=');
    if (eq > 0) {
      const k = line.slice(0, eq).trim();
      const v = line.slice(eq + 1).trim();
      (result[section] ??= {})[k] = v;
      hooks.onKey?.(section, k, v);
    }
  }
  return result;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { iniParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ini = '[db]\\nhost = localhost\\nport = 5432';
  rec.begin({ zh: 'INI 解析', en: 'INI parse' }).commit();
  iniParse(ini, {
    onSection: (s) => rec.begin({ zh: \`[\${s}]\`, en: \`[\${s}]\` }).setAux([{ label: 'sec', value: s, role: 'final' as BarRole }]).commit(),
    onKey: (sec, k, v) => rec.begin({ zh: \`\${sec}.\${k} = \${v}\`, en: \`\${sec}.\${k} = \${v}\` })
      .setAux([{ label: k, value: v, role: 'compare' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iniParse } from '../../src/algorithms/parsing/parse-ini/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-ini/trace.ts';
test('INI 解析节与键', () => {
  const r = iniParse('[a]\\nx=1\\n# c\\ny=2');
  assert.equal(r.a!.x, '1');
  assert.equal(r.a!.y, '2');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 7. parse-csv-quoted
{
  id: 'parse-csv-quoted',
  titleZh: 'CSV 带引号', titleEn: 'CSV with Quoting',
  summaryZh: 'RFC 4180 风格：引号包裹字段，双引号转义。',
  summaryEn: 'RFC 4180 style: quoted fields with doubled-quote escaping.',
  descZh: 'CSV RFC4180：字段含逗号/换行/引号时用 "..." 包裹，内部 " 用 "" 转义。',
  descEn: 'RFC 4180 CSV: wrap fields with commas/newlines/quotes in "..."; escape inner " as "".',
  tags: ['parsing','csv'],
  time: 'O(n)', space: 'O(n)',
  impl: `// CSV 带引号 · 实现
export interface CsvHooks { onRow?: (fields: string[]) => void; }
export function csvQuotedParse(text: string, hooks: CsvHooks = {}): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(field); field = '';
        if (row.length > 1 || row[0] !== '') { rows.push(row); hooks.onRow?.(row); }
        row = [];
      } else field += c;
    }
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); hooks.onRow?.(row); }
  return rows;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { csvQuotedParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const csv = 'a,"b,c","d\\"e"\\n1,2,3';
  rec.begin({ zh: 'CSV 带引号', en: 'CSV quoted' }).commit();
  csvQuotedParse(csv, {
    onRow: (f) => rec.begin({ zh: \`[\${f.map((x) => '"' + x + '"').join(', ')}]\`, en: 'row' })
      .setBars(f.map((x) => ({ value: x.length + 1, role: 'final' as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { csvQuotedParse } from '../../src/algorithms/parsing/parse-csv-quoted/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-csv-quoted/trace.ts';
test('CSV 解析带引号字段', () => {
  const r = csvQuotedParse('a,"b,c","d""e"');
  assert.deepEqual(r[0], ['a', 'b,c', 'd"e']);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 8. parse-tsv
{
  id: 'parse-tsv',
  titleZh: 'TSV 解析', titleEn: 'TSV Parser',
  summaryZh: '制表符分隔的简单表格解析。',
  summaryEn: 'Simple tab-separated table parsing.',
  descZh: 'TSV：以 \\t 分列、\\n 分行，无引号转义，适合简单表格。',
  descEn: 'TSV: columns by \\t, rows by \\n, no quoting; suits simple tables.',
  tags: ['parsing','tsv'],
  time: 'O(n)', space: 'O(n)',
  impl: `// TSV 解析 · 实现
export function tsvParse(text: string): string[][] {
  return text.split('\n').filter((l) => l.trim() !== '').map((l) => l.split('\t').map((c) => c.trim()));
}
export function tsvStringify(rows: ReadonlyArray<readonly string[]>): string {
  return rows.map((r) => r.join('\t')).join('\n');
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tsvParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const tsv = 'a\\tb\\tc\\n1\\t2\\t3';
  const rows = tsvParse(tsv);
  rec.begin({ zh: 'TSV', en: 'TSV' }).setBars(rows[0]!.map((c) => ({ value: c.length + 1, role: 'final' as BarRole }))).commit();
  rec.begin({ zh: \`\${rows.length} 行 × \${rows[0]!.length} 列\`, en: \`\${rows.length}x\${rows[0]!.length}\` }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tsvParse, tsvStringify } from '../../src/algorithms/parsing/parse-tsv/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-tsv/trace.ts';
test('TSV 解析', () => {
  const r = tsvParse('a\\tb\\n1\\t2');
  assert.deepEqual(r, [['a', 'b'], ['1', '2']]);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 9. parse-env
{
  id: 'parse-env',
  titleZh: 'ENV 解析', titleEn: 'ENV Parser',
  summaryZh: '解析 KEY=value 环境变量，支持引号与 export。',
  summaryEn: 'Parse KEY=value env vars; supports quoting and export prefix.',
  descZh: '.env：每行 KEY=VALUE，可选 export 前缀，值可带引号，# 注释。',
  descEn: '.env: KEY=VALUE per line, optional export prefix, quoted values, # comments.',
  tags: ['parsing','config'],
  time: 'O(n)', space: 'O(k)',
  impl: `// ENV 解析 · 实现
export function envParse(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const raw of text.split('\n')) {
    let line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    line = line.replace(/^export\s+/, '');
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const k = line.slice(0, eq).trim();
    let v = line.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[k] = v;
  }
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { envParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const env = 'export PORT=8080\\nNAME="my app"\\n# comment\\nDEBUG=true';
  const o = envParse(env);
  rec.begin({ zh: 'ENV', en: 'ENV' })
    .setAux(Object.entries(o).map(([k, v]) => ({ label: k, value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { envParse } from '../../src/algorithms/parsing/parse-env/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-env/trace.ts';
test('ENV 解析', () => {
  const o = envParse('export A=1\\nB="x y"\\n# c\\nC=\\'z\\'');
  assert.equal(o.A, '1');
  assert.equal(o.B, 'x y');
  assert.equal(o.C, 'z');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 10. parse-logfmt
{
  id: 'parse-logfmt',
  titleZh: 'logfmt 解析', titleEn: 'logfmt Parser',
  summaryZh: '解析 key=value 空格分隔的日志格式。',
  summaryEn: 'Parse space-separated key=value log format.',
  descZh: 'logfmt：一行内多对 key=value，空格分隔，值可带引号。',
  descEn: 'logfmt: multiple key=value pairs per line, space-separated, values may be quoted.',
  tags: ['parsing','log'],
  time: 'O(n)', space: 'O(k)',
  impl: `// logfmt 解析 · 实现
export function logfmtParse(line: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /(\w+)=(?:"([^"]*)"|'([^']*)'|(\S+))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) out[m[1]!] = m[2] ?? m[3] ?? m[4] ?? '';
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { logfmtParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const line = 'level=info msg="started" port=8080 ok=true';
  const o = logfmtParse(line);
  rec.begin({ zh: 'logfmt', en: 'logfmt' })
    .setAux(Object.entries(o).map(([k, v]) => ({ label: k, value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { logfmtParse } from '../../src/algorithms/parsing/parse-logfmt/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-logfmt/trace.ts';
test('logfmt 解析', () => {
  const o = logfmtParse('a=1 b="x y" c=true');
  assert.equal(o.a, '1');
  assert.equal(o.b, 'x y');
  assert.equal(o.c, 'true');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 11. parse-hcl
{
  id: 'parse-hcl',
  titleZh: 'HCL 解析', titleEn: 'HCL Parser',
  summaryZh: '解析 HashiCorp 配置语言块结构子集。',
  summaryEn: 'Parse a subset of HashiCorp Configuration Language block structure.',
  descZh: 'HCL 子集：block "name" { key = value } 嵌套块结构，简化为对象树。',
  descEn: 'HCL subset: block "name" { key = value } nested blocks; simplified to an object tree.',
  tags: ['parsing','config'],
  time: 'O(n)', space: 'O(d)',
  impl: `// HCL 解析 (子集) · 实现
export interface HclHooks { onBlock?: (name: string, labels: string[], body: Record<string, unknown>) => void; }
export function hclParse(text: string, hooks: HclHooks = {}): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  const blockRe = /(\w+)\s+("([^"]*)"\s*)*{([^}]*)}/g;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(text)) !== null) {
    const name = m[1]!;
    const label = m[3] ?? '';
    const bodyText = m[4] ?? '';
    const body: Record<string, unknown> = {};
    const kvRe = /(\w+)\s*=\s*("([^"]*)"|(\S+))/g;
    let kv: RegExpExecArray | null;
    while ((kv = kvRe.exec(bodyText)) !== null) body[kv[1]!] = kv[3] ?? kv[4] ?? '';
    (root[name] as unknown[]) ??= []; (root[name] as unknown[]).push(label ? { label, body } : body);
    hooks.onBlock?.(name, label ? [label] : [], body);
  }
  return root;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hclParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const hcl = 'resource "aws" { name = "x" count = 2 }';
  rec.begin({ zh: 'HCL', en: 'HCL' }).commit();
  hclParse(hcl, {
    onBlock: (n, l, b) => rec.begin({ zh: \`\${n} \${l.join(' ')}\`, en: \`\${n}\` })
      .setAux(Object.entries(b).map(([k, v]) => ({ label: k, value: String(v), role: 'final' as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hclParse } from '../../src/algorithms/parsing/parse-hcl/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-hcl/trace.ts';
test('HCL 解析块', () => {
  const r = hclParse('resource "aws" { name = "x" count = 2 }');
  assert.ok(Array.isArray(r.resource));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 12. parse-front-matter
{
  id: 'parse-front-matter',
  titleZh: 'Front Matter', titleEn: 'Front Matter Parser',
  summaryZh: '解析 Markdown 文件顶部的 --- YAML 元数据块。',
  summaryEn: 'Parse the --- YAML metadata block at the top of Markdown files.',
  descZh: 'Front Matter：文档若以 --- 开始，到下一个 --- 之间为元数据，其余为正文。',
  descEn: 'Front Matter: if doc starts with ---, the section until the next --- is metadata, rest is body.',
  tags: ['parsing','markdown'],
  time: 'O(n)', space: 'O(n)',
  impl: `// Front Matter 解析 · 实现
export interface FrontMatter { data: Record<string, string>; body: string; }
export function frontMatterParse(text: string): FrontMatter {
  if (!text.startsWith('---')) return { data: {}, body: text };
  const end = text.indexOf('\n---', 3);
  if (end < 0) return { data: {}, body: text };
  const metaText = text.slice(4, end);
  const body = text.slice(end + 4).replace(/^\n/, '');
  const data: Record<string, string> = {};
  for (const line of metaText.split('\n')) {
    const idx = line.indexOf(':');
    if (idx > 0) data[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { data, body };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { frontMatterParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const doc = '---\\ntitle: Hi\\ndate: 2024\\n---\\n# Body';
  const fm = frontMatterParse(doc);
  rec.begin({ zh: 'Front Matter', en: 'Front Matter' })
    .setAux(Object.entries(fm.data).map(([k, v]) => ({ label: k, value: v, role: 'final' as BarRole }))).commit();
  rec.begin({ zh: \`body: \${fm.body}\`, en: fm.body }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { frontMatterParse } from '../../src/algorithms/parsing/parse-front-matter/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-front-matter/trace.ts';
test('Front Matter 解析', () => {
  const fm = frontMatterParse('---\\ntitle: Hi\\n---\\nbody');
  assert.equal(fm.data.title, 'Hi');
  assert.equal(fm.body, 'body');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 13. parse-phone
{
  id: 'parse-phone',
  titleZh: '电话号码解析', titleEn: 'Phone Number Parser',
  summaryZh: '识别国际/本地号码，分离国家码、区号、本地号。',
  summaryEn: 'Recognize international/local numbers; split country code, area, local.',
  descZh: '电话解析：去分隔符，若以 + 开头取国家码前缀，再分区号与本地号。',
  descEn: 'Phone parser: strip separators; if starts with +, take country prefix; split area and local.',
  tags: ['parsing','phone'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 电话号码解析 · 实现
export interface PhoneParts { country?: string; area: string; local: string; raw: string; }
export function phoneParse(input: string): PhoneParts {
  const raw = input;
  const digits = input.replace(/[^\d+]/g, '');
  let rest: string;
  let country: string | undefined;
  if (digits.startsWith('+')) {
    // 常见国家码 1-3 位
    const m = digits.match(/^\+(\d{1,3})(.*)$/);
    country = m?.[1]; rest = m?.[2] ?? digits.slice(1);
  } else rest = digits;
  const area = rest.slice(0, 3);
  const local = rest.slice(3);
  return { country, area, local, raw };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { phoneParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const p = phoneParse('+1 (415) 555-1234');
  rec.begin({ zh: '电话解析', en: 'Phone' })
    .setAux([
      { label: 'country', value: p.country ?? '-', role: 'final' as BarRole },
      { label: 'area', value: p.area, role: 'compare' as BarRole },
      { label: 'local', value: p.local, role: 'default' as BarRole },
    ]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { phoneParse } from '../../src/algorithms/parsing/parse-phone/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-phone/trace.ts';
test('电话解析国际号', () => {
  const p = phoneParse('+1 (415) 555-1234');
  assert.equal(p.country, '1');
  assert.equal(p.area, '415');
  assert.equal(p.local, '5551234');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 14. parse-date
{
  id: 'parse-date',
  titleZh: '日期解析', titleEn: 'Date Parser',
  summaryZh: '解析 ISO8601 与常见 YYYY-MM-DD 格式为 {y,m,d}。',
  summaryEn: 'Parse ISO8601 and common YYYY-MM-DD into {y,m,d}.',
  descZh: '日期解析：支持 YYYY-MM-DD、YYYY/MM/DD、可选时间部分；返回年月日。',
  descEn: 'Date parser: supports YYYY-MM-DD, YYYY/MM/DD, optional time; returns y/m/d.',
  tags: ['parsing','date'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 日期解析 · 实现
export interface DateParts { year: number; month: number; day: number; hour?: number; minute?: number; }
export function dateParse(input: string): DateParts | null {
  const m = input.match(/^(\\d{4})[-/](\\d{1,2})[-/](\\d{1,2})(?:[ T](\\d{1,2}):(\\d{1,2}))?/);
  if (!m) return null;
  const year = Number(m[1]!), month = Number(m[2]!), day = Number(m[3]!);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const out: DateParts = { year, month, day };
  if (m[4]) out.hour = Number(m[4]);
  if (m[5]) out.minute = Number(m[5]);
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dateParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const d = dateParse('2024-07-14 09:30');
  rec.begin({ zh: '日期解析', en: 'Date' })
    .setAux([
      { label: 'year', value: String(d!.year), role: 'final' as BarRole },
      { label: 'month', value: String(d!.month), role: 'compare' as BarRole },
      { label: 'day', value: String(d!.day), role: 'default' as BarRole },
      { label: 'time', value: \`\${d!.hour}:\${d!.minute}\`, role: 'pivot' as BarRole },
    ]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dateParse } from '../../src/algorithms/parsing/parse-date/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-date/trace.ts';
test('日期解析 ISO', () => {
  const d = dateParse('2024-07-14');
  assert.deepEqual(d, { year: 2024, month: 7, day: 14 });
});
test('非法日期返回 null', () => {
  assert.equal(dateParse('abc'), null);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 15. parse-color
{
  id: 'parse-color',
  titleZh: '颜色解析', titleEn: 'Color Parser',
  summaryZh: '解析 #hex / rgb() / rgba() 为 {r,g,b,a}。',
  summaryEn: 'Parse #hex / rgb() / rgba() into {r,g,b,a}.',
  descZh: '颜色解析：#RGB、#RRGGBB、rgb(r,g,b)、rgba(r,g,b,a) 统一转 {r,g,b,a}。',
  descEn: 'Color parser: #RGB, #RRGGBB, rgb(r,g,b), rgba(r,g,b,a) all map to {r,g,b,a}.',
  tags: ['parsing','color'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 颜色解析 · 实现
export interface RGBA { r: number; g: number; b: number; a: number; }
export function colorParse(input: string): RGBA | null {
  const s = input.trim();
  if (s.startsWith('#')) {
    const hex = s.slice(1);
    if (hex.length === 3) return { r: parseInt(hex[0]! + hex[0]!, 16), g: parseInt(hex[1]! + hex[1]!, 16), b: parseInt(hex[2]! + hex[2]!, 16), a: 1 };
    if (hex.length === 6) return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16), a: 1 };
    return null;
  }
  const m = s.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  if (m) return { r: Number(m[1]!), g: Number(m[2]!), b: Number(m[3]!), a: m[4] !== undefined ? Number(m[4]) : 1 };
  return null;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { colorParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const c = colorParse('rgba(10, 20, 30, 0.5)');
  rec.begin({ zh: '颜色解析', en: 'Color' })
    .setAux([
      { label: 'r', value: String(c!.r), role: 'final' as BarRole },
      { label: 'g', value: String(c!.g), role: 'compare' as BarRole },
      { label: 'b', value: String(c!.b), role: 'default' as BarRole },
      { label: 'a', value: String(c!.a), role: 'pivot' as BarRole },
    ]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { colorParse } from '../../src/algorithms/parsing/parse-color/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-color/trace.ts';
test('#hex 解析', () => {
  assert.deepEqual(colorParse('#abc'), { r: 170, g: 187, b: 204, a: 1 });
  assert.deepEqual(colorParse('#ff8800'), { r: 255, g: 136, b: 0, a: 1 });
});
test('rgba 解析', () => {
  assert.deepEqual(colorParse('rgba(1,2,3,0.5)'), { r: 1, g: 2, b: 3, a: 0.5 });
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 16. parse-mime
{
  id: 'parse-mime',
  titleZh: 'MIME 解析', titleEn: 'MIME Parser',
  summaryZh: '解析 Content-Type 及参数 (charset 等)。',
  summaryEn: 'Parse Content-Type header and its parameters (charset, etc.).',
  descZh: 'MIME：type/subtype; param=value; ... 拆分主类型与参数字典。',
  descEn: 'MIME: split type/subtype; param=value; ... into main type and param dict.',
  tags: ['parsing','mime'],
  time: 'O(n)', space: 'O(p)',
  impl: `// MIME 解析 · 实现
export interface MimeParts { type: string; params: Record<string, string>; }
export function mimeParse(header: string): MimeParts {
  const parts = header.split(';').map((p) => p.trim());
  const type = (parts[0] ?? '').toLowerCase();
  const params: Record<string, string> = {};
  for (let i = 1; i < parts.length; i++) {
    const eq = parts[i]!.indexOf('=');
    if (eq > 0) {
      const k = parts[i]!.slice(0, eq).trim().toLowerCase();
      const v = parts[i]!.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      params[k] = v;
    }
  }
  return { type, params };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mimeParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const m = mimeParse('text/html; charset=UTF-8; boundary="xyz"');
  rec.begin({ zh: 'MIME', en: 'MIME' })
    .setAux([{ label: 'type', value: m.type, role: 'final' as BarRole }, ...Object.entries(m.params).map(([k, v]) => ({ label: k, value: v, role: 'compare' as BarRole }))]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mimeParse } from '../../src/algorithms/parsing/parse-mime/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-mime/trace.ts';
test('MIME 解析', () => {
  const m = mimeParse('text/html; charset=UTF-8; boundary="x"');
  assert.equal(m.type, 'text/html');
  assert.equal(m.params.charset, 'UTF-8');
  assert.equal(m.params.boundary, 'x');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 17. parse-cookie
{
  id: 'parse-cookie',
  titleZh: 'Cookie 解析', titleEn: 'Cookie Parser',
  summaryZh: '解析 HTTP Cookie 头键值对。',
  summaryEn: 'Parse HTTP Cookie header key=value pairs.',
  descZh: 'Cookie：name=value; name2=value2; ... 拆为对象。',
  descEn: 'Cookie: name=value; name2=value2; ... to object.',
  tags: ['parsing','http'],
  time: 'O(n)', space: 'O(k)',
  impl: `// Cookie 解析 · 实现
export function cookieParse(header: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const pair of header.split(/;\\s*/)) {
    const eq = pair.indexOf('=');
    if (eq > 0) {
      const k = pair.slice(0, eq).trim();
      const v = pair.slice(eq + 1).trim();
      out[k] = decodeURIComponent(v);
    }
  }
  return out;
}
export function cookieStringify(pairs: Record<string, string>): string {
  return Object.entries(pairs).map(([k, v]) => \`\${k}=\${encodeURIComponent(v)}\`).join('; ');
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cookieParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const c = cookieParse('session=abc; user=hello%20world');
  rec.begin({ zh: 'Cookie', en: 'Cookie' })
    .setAux(Object.entries(c).map(([k, v]) => ({ label: k, value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cookieParse, cookieStringify } from '../../src/algorithms/parsing/parse-cookie/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-cookie/trace.ts';
test('Cookie 解析', () => {
  const c = cookieParse('a=1; b=hello%20world');
  assert.equal(c.a, '1');
  assert.equal(c.b, 'hello world');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 18. parse-range
{
  id: 'parse-range',
  titleZh: 'HTTP Range 解析', titleEn: 'HTTP Range Parser',
  summaryZh: '解析 Range 头字节区间 (单/多段)。',
  summaryEn: 'Parse Range header byte ranges (single or multi).',
  descZh: 'Range: bytes=0-499,1000- 解析为区间数组，支持开放式。',
  descEn: 'Range: bytes=0-499,1000- parsed into range list; supports open-ended.',
  tags: ['parsing','http'],
  time: 'O(n)', space: 'O(r)',
  impl: `// HTTP Range 解析 · 实现
export interface ByteRange { start: number | null; end: number | null; }
export function rangeParse(header: string, size?: number): ByteRange[] | null {
  const m = header.match(/^bytes=(.+)$/i);
  if (!m) return null;
  const ranges: ByteRange[] = [];
  for (const part of m[1]!.split(',')) {
    const r = part.trim().match(/^(\\d*)-(\\d*)$/);
    if (!r) return null;
    const start = r[1] === '' ? null : Number(r[1]);
    const end = r[2] === '' ? null : Number(r[2]);
    if (start === null && end !== null && size !== undefined) ranges.push({ start: size - end, end: size - 1 });
    else ranges.push({ start, end });
  }
  return ranges;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rangeParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const rs = rangeParse('bytes=0-99,500-', 1000);
  rec.begin({ zh: 'HTTP Range', en: 'Range' })
    .setAux(rs!.map((r, i) => ({ label: \`r\${i}\`, value: \`\${r.start ?? '?'}-\${r.end ?? '?'}\`, role: (i === 0 ? 'final' : 'compare') as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rangeParse } from '../../src/algorithms/parsing/parse-range/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-range/trace.ts';
test('Range 单段', () => {
  const r = rangeParse('bytes=0-99');
  assert.deepEqual(r, [{ start: 0, end: 99 }]);
});
test('Range 后缀', () => {
  const r = rangeParse('bytes=-100', 1000);
  assert.deepEqual(r, [{ start: 900, end: 999 }]);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 19. parse-cors
{
  id: 'parse-cors',
  titleZh: 'CORS 解析', titleEn: 'CORS Header Parser',
  summaryZh: '解析 CORS 相关响应头，判断是否允许来源。',
  summaryEn: 'Parse CORS-related response headers; determine if origin is allowed.',
  descZh: 'CORS：读 Allow-Origin/Methods/Headers，与请求源比较，输出是否放行。',
  descEn: 'CORS: read Allow-Origin/Methods/Headers; compare to request origin; output allow flag.',
  tags: ['parsing','http','cors'],
  time: 'O(n)', space: 'O(1)',
  impl: `// CORS 头解析 · 实现
export interface CorsResult { allowed: boolean; origin: string; methods: string[]; headers: string[]; credentials: boolean; }
export function corsParse(headers: Record<string, string>, requestOrigin: string): CorsResult {
  const origin = headers['access-control-allow-origin'] ?? '';
  const methods = (headers['access-control-allow-methods'] ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const hdrs = (headers['access-control-allow-headers'] ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const creds = (headers['access-control-allow-credentials'] ?? '').toLowerCase() === 'true';
  const allowed = origin === '*' || origin === requestOrigin;
  return { allowed, origin, methods, headers: hdrs, credentials: creds };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { corsParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const r = corsParse({ 'access-control-allow-origin': 'https://a.com', 'access-control-allow-methods': 'GET, POST', 'access-control-allow-credentials': 'true' }, 'https://a.com');
  rec.begin({ zh: 'CORS', en: 'CORS' })
    .setAux([
      { label: 'allowed', value: String(r.allowed), role: 'final' as BarRole },
      { label: 'methods', value: r.methods.join(','), role: 'compare' as BarRole },
      { label: 'creds', value: String(r.credentials), role: 'pivot' as BarRole },
    ]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { corsParse } from '../../src/algorithms/parsing/parse-cors/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-cors/trace.ts';
test('CORS 同源放行', () => {
  const r = corsParse({ 'access-control-allow-origin': 'https://a.com' }, 'https://a.com');
  assert.equal(r.allowed, true);
});
test('CORS 跨源拒绝', () => {
  const r = corsParse({ 'access-control-allow-origin': 'https://a.com' }, 'https://b.com');
  assert.equal(r.allowed, false);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 20. parse-jwt
{
  id: 'parse-jwt',
  titleZh: 'JWT 解析', titleEn: 'JWT Parser',
  summaryZh: '解码 JWT 三段 header.payload.signature。',
  summaryEn: 'Decode the three JWT parts header.payload.signature.',
  descZh: 'JWT：三段以 . 分隔的 base64url；解析前两段得到头部与载荷 JSON。',
  descEn: 'JWT: three dot-separated base64url parts; decode first two to header and payload JSON.',
  tags: ['parsing','jwt','auth'],
  time: 'O(n)', space: 'O(n)',
  impl: `// JWT 解析 · 实现
export interface JwtParts { header: Record<string, unknown>; payload: Record<string, unknown>; signature: string; }
function b64urlDecode(s: string): string {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return Buffer.from(b64, 'base64').toString('utf8');
}
export function jwtParse(token: string): JwtParts {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT');
  return {
    header: JSON.parse(b64urlDecode(parts[0]!)),
    payload: JSON.parse(b64urlDecode(parts[1]!)),
    signature: parts[2]!,
  };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jwtParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.sig';
  const j = jwtParse(token);
  rec.begin({ zh: 'JWT', en: 'JWT' })
    .setAux([
      { label: 'alg', value: String((j.header as { alg?: string }).alg), role: 'final' as BarRole },
      { label: 'sub', value: String((j.payload as { sub?: string }).sub), role: 'compare' as BarRole },
    ]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jwtParse } from '../../src/algorithms/parsing/parse-jwt/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-jwt/trace.ts';
test('JWT 解码', () => {
  const j = jwtParse('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.sig');
  assert.equal((j.header as { alg: string }).alg, 'HS256');
  assert.equal((j.payload as { sub: string }).sub, '1');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 21. parse-base64url
{
  id: 'parse-base64url',
  titleZh: 'Base64URL', titleEn: 'Base64URL Codec',
  summaryZh: 'URL 安全的 base64 变体：- 与 _ 替换 +/，去填充。',
  summaryEn: 'URL-safe base64 variant: - and _ replace +/; padding stripped.',
  descZh: 'Base64URL：把 + 换 -、/ 换 _、去掉 = 填充，适合 URL/查询串。',
  descEn: 'Base64URL: + -> -, / -> _, strip = padding; suits URL/query.',
  tags: ['parsing','base64','encoding'],
  time: 'O(n)', space: 'O(n)',
  impl: `// Base64URL 编解码 · 实现
export function base64urlEncode(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64').replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
}
export function base64urlDecode(input: string): string {
  const pad = '='.repeat((4 - (input.length % 4)) % 4);
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return Buffer.from(b64, 'base64').toString('utf8');
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { base64urlEncode, base64urlDecode } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const enc = base64urlEncode('Hello? World!');
  const dec = base64urlDecode(enc);
  rec.begin({ zh: 'Base64URL', en: 'Base64URL' })
    .setAux([{ label: 'encoded', value: enc, role: 'final' as BarRole }, { label: 'decoded', value: dec, role: 'compare' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { base64urlEncode, base64urlDecode } from '../../src/algorithms/parsing/parse-base64url/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-base64url/trace.ts';
test('Base64URL 往返', () => {
  const s = 'Hello? World!';
  assert.equal(base64urlDecode(base64urlEncode(s)), s);
});
test('无填充', () => {
  assert.ok(!base64urlEncode('abc').includes('='));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 22. parse-data-uri
{
  id: 'parse-data-uri',
  titleZh: 'Data URI 解析', titleEn: 'Data URI Parser',
  summaryZh: '解析 data:[mime];base64,<data> 内联资源。',
  summaryEn: 'Parse data:[mime];base64,<data> inline resources.',
  descZh: 'Data URI：拆出 MIME、是否 base64、原始数据；可解码 base64 还原字节。',
  descEn: 'Data URI: split MIME, base64 flag, raw data; optionally decode base64 back to bytes.',
  tags: ['parsing','uri'],
  time: 'O(n)', space: 'O(n)',
  impl: `// Data URI 解析 · 实现
export interface DataUri { mime: string; isBase64: boolean; data: string; }
export function dataUriParse(uri: string): DataUri {
  const m = uri.match(/^data:([^;,]*?)?(;base64)?,(.*)$/);
  if (!m) throw new Error('Invalid data URI');
  return { mime: m[1] ?? 'text/plain', isBase64: m[2] !== undefined, data: m[3] ?? '' };
}
export function dataUriDecode(uri: string): string {
  const p = dataUriParse(uri);
  return p.isBase64 ? Buffer.from(p.data, 'base64').toString('utf8') : decodeURIComponent(p.data);
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dataUriParse, dataUriDecode } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const uri = 'data:text/plain;base64,SGk=';
  const p = dataUriParse(uri);
  rec.begin({ zh: 'Data URI', en: 'Data URI' })
    .setAux([{ label: 'mime', value: p.mime, role: 'final' as BarRole }, { label: 'b64', value: String(p.isBase64), role: 'compare' as BarRole }, { label: 'decoded', value: dataUriDecode(uri), role: 'pivot' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dataUriParse, dataUriDecode } from '../../src/algorithms/parsing/parse-data-uri/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-data-uri/trace.ts';
test('Data URI base64 解码', () => {
  assert.equal(dataUriDecode('data:text/plain;base64,SGk='), 'Hi');
});
test('Data URI 百分号解码', () => {
  assert.equal(dataUriDecode('data:,hello%20world'), 'hello world');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 23. parse-multipart
{
  id: 'parse-multipart',
  titleZh: 'Multipart 解析', titleEn: 'Multipart Parser',
  summaryZh: '按边界拆分 multipart/form-data 各部分。',
  summaryEn: 'Split multipart/form-data parts by boundary.',
  descZh: 'Multipart：以 --boundary 分隔，每部分含 headers 与 body。',
  descEn: 'Multipart: separated by --boundary; each part has headers and body.',
  tags: ['parsing','http','multipart'],
  time: 'O(n)', space: 'O(n)',
  impl: `// Multipart 解析 · 实现
export interface MultipartPart { headers: Record<string, string>; body: string; }
export function multipartParse(body: string, boundary: string): MultipartPart[] {
  const delim = '--' + boundary;
  const parts: MultipartPart[] = [];
  const segments = body.split(delim).slice(1, -1);
  for (const seg of segments) {
    const s = seg.replace(/^\r\n/, '').replace(/\r\n$/, '');
    const headerEnd = s.indexOf('\r\n\r\n');
    const headerText = headerEnd >= 0 ? s.slice(0, headerEnd) : '';
    const content = headerEnd >= 0 ? s.slice(headerEnd + 4) : s;
    const headers: Record<string, string> = {};
    for (const line of headerText.split('\r\n')) {
      const idx = line.indexOf(':');
      if (idx > 0) headers[line.slice(0, idx).trim().toLowerCase()] = line.slice(idx + 1).trim();
    }
    parts.push({ headers, body: content });
  }
  return parts;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { multipartParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const body = '--b\r\nContent-Disposition: form-data; name="x"\r\n\r\nhello\r\n--b--';
  const ps = multipartParse(body, 'b');
  rec.begin({ zh: 'Multipart', en: 'Multipart' })
    .setAux(ps.map((p, i) => ({ label: \`part\${i}\`, value: p.body, role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { multipartParse } from '../../src/algorithms/parsing/parse-multipart/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-multipart/trace.ts';
test('Multipart 解析部分', () => {
  const body = '--b\r\nContent-Disposition: form-data; name="x"\r\n\r\nhello\r\n--b--';
  const ps = multipartParse(body, 'b');
  assert.equal(ps.length, 1);
  assert.equal(ps[0]!.body, 'hello');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 24. parse-accept-header
{
  id: 'parse-accept-header',
  titleZh: 'Accept 头解析', titleEn: 'Accept Header Parser',
  summaryZh: '解析 Accept 头并按 quality 排序。',
  summaryEn: 'Parse Accept header and sort by quality value.',
  descZh: 'Accept：type/subtype;q=x 多个用逗号分隔，按 q 降序排列。',
  descEn: 'Accept: type/subtype;q=x comma-separated, sort descending by q.',
  tags: ['parsing','http'],
  time: 'O(n log n)', space: 'O(m)',
  impl: `// Accept 头解析 · 实现
export interface AcceptEntry { type: string; q: number; }
export function acceptParse(header: string): AcceptEntry[] {
  const entries = header.split(',').map((part) => {
    const segs = part.trim().split(';').map((s) => s.trim());
    const type = (segs[0] ?? '*/*').toLowerCase();
    const qSeg = segs.find((s) => s.startsWith('q='));
    const q = qSeg ? Number(qSeg.slice(2)) : 1;
    return { type, q: isNaN(q) ? 1 : q };
  });
  entries.sort((a, b) => b.q - a.q);
  return entries;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { acceptParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const list = acceptParse('text/html;q=0.9, application/json;q=1, */*;q=0.1');
  rec.begin({ zh: 'Accept', en: 'Accept' })
    .setBars(list.map((e) => ({ value: e.q, role: 'final' as BarRole })))
    .setAux(list.map((e) => ({ label: e.type, value: String(e.q), role: 'compare' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acceptParse } from '../../src/algorithms/parsing/parse-accept-header/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-accept-header/trace.ts';
test('Accept 按 q 排序', () => {
  const l = acceptParse('a;q=0.5, b;q=0.9');
  assert.equal(l[0]!.type, 'b');
  assert.equal(l[0]!.q, 0.9);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 25. parse-content-disposition
{
  id: 'parse-content-disposition',
  titleZh: 'Content-Disposition 解析', titleEn: 'Content-Disposition Parser',
  summaryZh: '提取 disposition 类型与 filename 参数。',
  summaryEn: 'Extract disposition type and filename parameter.',
  descZh: 'Content-Disposition: attachment; filename="x.csv" 拆出类型与文件名。',
  descEn: 'Content-Disposition: attachment; filename="x.csv" -> type and filename.',
  tags: ['parsing','http'],
  time: 'O(n)', space: 'O(1)',
  impl: `// Content-Disposition 解析 · 实现
export interface Disposition { type: string; filename?: string; params: Record<string, string>; }
export function dispositionParse(header: string): Disposition {
  const parts = header.split(';').map((p) => p.trim());
  const type = (parts[0] ?? '').toLowerCase();
  const params: Record<string, string> = {};
  for (let i = 1; i < parts.length; i++) {
    const eq = parts[i]!.indexOf('=');
    if (eq > 0) {
      const k = parts[i]!.slice(0, eq).trim().toLowerCase();
      const v = parts[i]!.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      params[k] = v;
    }
  }
  return { type, filename: params.filename, params };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dispositionParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const d = dispositionParse('attachment; filename="report.csv"');
  rec.begin({ zh: 'Content-Disposition', en: 'Content-Disposition' })
    .setAux([{ label: 'type', value: d.type, role: 'final' as BarRole }, { label: 'filename', value: d.filename ?? '-', role: 'compare' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dispositionParse } from '../../src/algorithms/parsing/parse-content-disposition/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-content-disposition/trace.ts';
test('解析附件文件名', () => {
  const d = dispositionParse('attachment; filename="x.csv"');
  assert.equal(d.type, 'attachment');
  assert.equal(d.filename, 'x.csv');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 26. parse-user-agent
{
  id: 'parse-user-agent',
  titleZh: 'UA 解析', titleEn: 'User-Agent Parser',
  summaryZh: '从 UA 字符串识别浏览器/操作系统。',
  summaryEn: 'Identify browser and OS from a User-Agent string.',
  descZh: 'UA 解析：用正则匹配常见浏览器(Chrome/Firefox/Safari)与系统(Windows/Mac/Linux/Android/iOS)。',
  descEn: 'UA parser: regex match common browsers (Chrome/Firefox/Safari) and OS (Windows/Mac/Linux/Android/iOS).',
  tags: ['parsing','http'],
  time: 'O(n)', space: 'O(1)',
  impl: `// User-Agent 解析 · 实现
export interface UaInfo { browser: string; version: string; os: string; }
export function userAgentParse(ua: string): UaInfo {
  let browser = 'Unknown', version = '';
  if (/edg\/([\\d.]+)/i.test(ua)) { browser = 'Edge'; version = (ua.match(/edg\/([\\d.]+)/i) ?? [])[1] ?? ''; }
  else if (/chrome\/([\\d.]+)/i.test(ua)) { browser = 'Chrome'; version = (ua.match(/chrome\/([\\d.]+)/i) ?? [])[1] ?? ''; }
  else if (/firefox\/([\\d.]+)/i.test(ua)) { browser = 'Firefox'; version = (ua.match(/firefox\/([\\d.]+)/i) ?? [])[1] ?? ''; }
  else if (/version\/([\\d.]+).*safari/i.test(ua)) { browser = 'Safari'; version = (ua.match(/version\/([\\d.]+)/i) ?? [])[1] ?? ''; }
  let os = 'Unknown';
  if (/windows nt/i.test(ua)) os = 'Windows';
  else if (/mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ios/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  return { browser, version, os };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { userAgentParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ua = 'Mozilla/5.0 (Windows NT 10.0) Chrome/120.0.0.0';
  const info = userAgentParse(ua);
  rec.begin({ zh: 'User-Agent', en: 'UA' })
    .setAux([
      { label: 'browser', value: info.browser, role: 'final' as BarRole },
      { label: 'version', value: info.version, role: 'compare' as BarRole },
      { label: 'os', value: info.os, role: 'pivot' as BarRole },
    ]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { userAgentParse } from '../../src/algorithms/parsing/parse-user-agent/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-user-agent/trace.ts';
test('UA 识别 Chrome on Windows', () => {
  const i = userAgentParse('Mozilla/5.0 (Windows NT 10.0) Chrome/120.0.0.0');
  assert.equal(i.browser, 'Chrome');
  assert.equal(i.os, 'Windows');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 27. parse-href
{
  id: 'parse-href',
  titleZh: '超链接解析', titleEn: 'HREF/Anchor Parser',
  summaryZh: '从 Markdown/HTML 文本提取链接 (href)。',
  summaryEn: 'Extract link hrefs from Markdown/HTML text.',
  descZh: '解析 [text](url) 与 <a href="url"> 两种常见链接形式。',
  descEn: 'Parse both [text](url) Markdown and <a href="url"> HTML link forms.',
  tags: ['parsing','markdown','html'],
  time: 'O(n)', space: 'O(l)',
  impl: `// 超链接解析 · 实现
export interface Link { text: string; href: string; }
export function hrefParse(input: string): Link[] {
  const links: Link[] = [];
  const mdRe = /\[([^\]]*)\]\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = mdRe.exec(input)) !== null) links.push({ text: m[1]!, href: m[2]! });
  const htmlRe = /<a\s+[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi;
  while ((m = htmlRe.exec(input)) !== null) links.push({ text: m[2]!.replace(/<[^>]+>/g, ''), href: m[1]! });
  return links;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hrefParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const text = 'see [Google](https://google.com) and <a href="https://x.com">X</a>';
  const links = hrefParse(text);
  rec.begin({ zh: 'HREF 解析', en: 'HREF' })
    .setAux(links.map((l, i) => ({ label: \`l\${i}\`, value: l.href, role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hrefParse } from '../../src/algorithms/parsing/parse-href/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-href/trace.ts';
test('解析 Markdown 链接', () => {
  const l = hrefParse('[G](https://g.com)');
  assert.equal(l[0]!.href, 'https://g.com');
  assert.equal(l[0]!.text, 'G');
});
test('解析 HTML 链接', () => {
  const l = hrefParse('<a href="https://x.com">X</a>');
  assert.equal(l[0]!.href, 'https://x.com');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 28. parse-markdown-table
{
  id: 'parse-markdown-table',
  titleZh: 'Markdown 表格', titleEn: 'Markdown Table Parser',
  summaryZh: '解析 GFM 风格 | a | b | 表格为二维数组。',
  summaryEn: 'Parse GFM-style | a | b | tables into 2D arrays.',
  descZh: 'Markdown 表格：第一行表头，第二行 --- 分隔，之后数据行；按 | 切分并修剪。',
  descEn: 'Markdown table: first row header, second row --- separator, then data; split by | and trim.',
  tags: ['parsing','markdown','table'],
  time: 'O(n)', space: 'O(r·c)',
  impl: `// Markdown 表格解析 · 实现
export interface MdTable { header: string[]; rows: string[][]; }
export function markdownTableParse(text: string): MdTable | null {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('|'));
  if (lines.length < 2) return null;
  const split = (l: string) => l.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
  const header = split(lines[0]!);
  if (!/^[\s|:-]+$/.test(lines[1]!)) return null;
  const rows = lines.slice(2).map(split);
  return { header, rows };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { markdownTableParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const md = '| a | b |\\n|---|---|\\n| 1 | 2 |';
  const t = markdownTableParse(md);
  rec.begin({ zh: 'Markdown 表格', en: 'MD table' })
    .setAux((t?.header ?? []).map((h, i) => ({ label: h, value: t!.rows[0]?.[i] ?? '', role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { markdownTableParse } from '../../src/algorithms/parsing/parse-markdown-table/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-markdown-table/trace.ts';
test('解析 GFM 表格', () => {
  const t = markdownTableParse('| a | b |\\n|---|---|\\n| 1 | 2 |');
  assert.deepEqual(t!.header, ['a', 'b']);
  assert.deepEqual(t!.rows, [['1', '2']]);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 29. parse-sql-select
{
  id: 'parse-sql-select',
  titleZh: 'SQL SELECT 解析', titleEn: 'SQL SELECT Parser',
  summaryZh: '解析 SELECT/FROM/WHERE 子句为结构化对象。',
  summaryEn: 'Parse SELECT/FROM/WHERE clauses into a structured object.',
  descZh: 'SQL SELECT 子集解析：提取列、表、条件，支持简单 WHERE。',
  descEn: 'SQL SELECT subset parser: extract columns, table, conditions; simple WHERE.',
  tags: ['parsing','sql'],
  time: 'O(n)', space: 'O(1)',
  impl: `// SQL SELECT 解析 (子集) · 实现
export interface SelectStmt { columns: string[]; table: string; where: string | null; limit: number | null; }
export function sqlSelectParse(sql: string): SelectStmt | null {
  const m = sql.match(/select\\s+(.+?)\\s+from\\s+(\\w+)(?:\\s+where\\s+(.+?))?(?:\\s+limit\\s+(\\d+))?\\s*$/i);
  if (!m) return null;
  const columns = m[1]!.split(',').map((c) => c.trim());
  return { columns, table: m[2]!, where: m[3] ? m[3].trim() : null, limit: m[4] ? Number(m[4]) : null };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sqlSelectParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = sqlSelectParse('SELECT id, name FROM users WHERE age > 18 LIMIT 10');
  rec.begin({ zh: 'SQL SELECT', en: 'SQL' })
    .setAux([
      { label: 'cols', value: s!.columns.join(','), role: 'final' as BarRole },
      { label: 'table', value: s!.table, role: 'compare' as BarRole },
      { label: 'where', value: s!.where ?? '-', role: 'pivot' as BarRole },
      { label: 'limit', value: String(s!.limit), role: 'default' as BarRole },
    ]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sqlSelectParse } from '../../src/algorithms/parsing/parse-sql-select/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-sql-select/trace.ts';
test('解析 SELECT', () => {
  const s = sqlSelectParse('SELECT id, name FROM users WHERE x=1 LIMIT 5');
  assert.deepEqual(s!.columns, ['id', 'name']);
  assert.equal(s!.table, 'users');
  assert.equal(s!.limit, 5);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 30. parse-cron
{
  id: 'parse-cron',
  titleZh: 'Cron 解析', titleEn: 'Cron Parser',
  summaryZh: '解析五段 cron 表达式为字段范围。',
  summaryEn: 'Parse a five-field cron expression into field ranges.',
  descZh: 'Cron：分 时 日 月 周 五段；支持 * 、逗号、- 区间、/ 步长。',
  descEn: 'Cron: minute hour day month weekday; supports * , lists, - ranges, / steps.',
  tags: ['parsing','cron','schedule'],
  time: 'O(n)', space: 'O(1)',
  impl: `// Cron 解析 · 实现
export interface CronFields { minute: number[]; hour: number[]; day: number[]; month: number[]; weekday: number[]; }
const RANGES: Record<string, [number, number]> = { minute: [0, 59], hour: [0, 23], day: [1, 31], month: [1, 12], weekday: [0, 6] };
function parseField(field: string, key: string): number[] {
  const [lo, hi] = RANGES[key]!;
  const out = new Set<number>();
  for (const part of field.split(',')) {
    const m = part.match(/^(\\*|\\d+(?:-\\d+)?)(?:\\/(\\d+))?$/);
    if (!m) continue;
    let start: number, end: number;
    if (m[1] === '*') { start = lo; end = hi; }
    else if (m[1]!.includes('-')) { const [a, b] = m[1]!.split('-'); start = Number(a); end = Number(b); }
    else { start = Number(m[1]); end = m[2] ? start : start; }
    const step = m[2] ? Number(m[2]) : 1;
    for (let v = start; v <= end; v += step) if (v >= lo && v <= hi) out.add(v);
  }
  return [...out].sort((a, b) => a - b);
}
export function cronParse(expr: string): CronFields {
  const [m, h, d, mon, w] = expr.trim().split(/\s+/);
  return { minute: parseField(m ?? '*', 'minute'), hour: parseField(h ?? '*', 'hour'), day: parseField(d ?? '*', 'day'), month: parseField(mon ?? '*', 'month'), weekday: parseField(w ?? '*', 'weekday') };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cronParse } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const c = cronParse('*/15 9-17 * * 1-5');
  rec.begin({ zh: 'Cron */15 9-17 * * 1-5', en: 'Cron' })
    .setAux([
      { label: 'min', value: c.minute.join(','), role: 'final' as BarRole },
      { label: 'hour', value: c.hour.join(','), role: 'compare' as BarRole },
      { label: 'weekday', value: c.weekday.join(','), role: 'pivot' as BarRole },
    ]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cronParse } from '../../src/algorithms/parsing/parse-cron/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-cron/trace.ts';
test('Cron 步长与区间', () => {
  const c = cronParse('*/15 9-17 * * 1-5');
  assert.deepEqual(c.minute, [0, 15, 30, 45]);
  assert.deepEqual(c.hour, [9, 10, 11, 12, 13, 14, 15, 16, 17]);
  assert.deepEqual(c.weekday, [1, 2, 3, 4, 5]);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
];
