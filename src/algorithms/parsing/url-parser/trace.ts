// URL 解析器 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parseUrl, type ParsedUrl, type UrlHooks } from './impl.ts';

export const DEFAULT_INPUT =
  'https://user:pass@example.com:8080/api/v1/search?q=hello&page=2#results';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const stages: Array<{ label: string; value: string }> = [];
  let result: ParsedUrl | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '输入', value: input, role: 'pivot' as BarRole },
    ];
    for (const s of stages)
      aux.push({ label: s.label, value: s.value, role: 'frontier' as BarRole });
    rec.begin(note).setAux(aux).commit();
  };

  snapshot({ zh: `解析 URL`, en: `Parse URL` });

  const hooks: UrlHooks = {
    onFragment: (f) => {
      stages.push({ label: 'fragment', value: f });
      snapshot({ zh: `fragment = ${f}`, en: `fragment = ${f}` });
    },
    onQuery: (q) => {
      stages.push({ label: 'query(原始)', value: q });
      snapshot({ zh: `query = ${q}`, en: `query = ${q}` });
    },
    onQueryParam: (k, v) => {
      stages.push({ label: `query.${k}`, value: v });
      snapshot({ zh: `query ${k}=${v}`, en: `query ${k}=${v}` });
    },
    onScheme: (sc) => {
      stages.push({ label: 'scheme', value: sc });
      snapshot({ zh: `scheme = ${sc}`, en: `scheme = ${sc}` });
    },
    onAuthority: (a) => {
      stages.push({ label: 'authority', value: a });
      snapshot({ zh: `authority = ${a}`, en: `authority = ${a}` });
    },
    onHostPort: (h, p) => {
      stages.push({ label: 'host', value: h });
      if (p !== undefined) stages.push({ label: 'port', value: String(p) });
      snapshot({ zh: `host=${h}, port=${p ?? '∅'}`, en: `host=${h}, port=${p ?? '∅'}` });
    },
  };

  result = parseUrl(input, hooks);
  const r = result;

  rec
    .begin({ zh: `解析完成`, en: `Parse complete` })
    .setMap([
      { key: 'scheme', value: r.scheme, role: 'final' as BarRole },
      ...(r.user ? [{ key: 'user', value: r.user, role: 'final' as BarRole }] : []),
      ...(r.host ? [{ key: 'host', value: r.host, role: 'final' as BarRole }] : []),
      ...(r.port ? [{ key: 'port', value: String(r.port), role: 'final' as BarRole }] : []),
      { key: 'path', value: r.path, role: 'final' as BarRole },
      { key: 'query', value: JSON.stringify(r.query), role: 'final' as BarRole },
      ...(r.fragment ? [{ key: 'fragment', value: r.fragment, role: 'final' as BarRole }] : []),
    ])
    .setAux([{ label: '组件数', value: String(stages.length), role: 'frontier' as BarRole }])
    .commit();

  return rec.build();
}
