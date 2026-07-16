// JSONPath 查询 · 纯算法实现
export interface PathSeg {
  kind: 'key' | 'index' | 'wildcard';
  value?: string | number;
}

export function parsePath(path: string): PathSeg[] {
  const out: PathSeg[] = [];
  const re = /\.(\w+)|\[( d+|\*)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(path)) !== null) {
    if (m[1] !== undefined) out.push({ kind: 'key', value: m[1] });
    else if (m[2] === '*') out.push({ kind: 'wildcard' });
    else if (m[2] !== undefined) out.push({ kind: 'index', value: Number(m[2]) });
  }
  return out;
}

export function queryPath(root: unknown, path: string): unknown[] {
  const segs = parsePath(path);
  let cur: unknown[] = [root];
  for (const seg of segs) {
    const next: unknown[] = [];
    for (const v of cur) {
      if (seg.kind === 'key' && v !== null && typeof v === 'object' && !Array.isArray(v)) {
        const k = (v as Record<string, unknown>)[seg.value as string];
        if (k !== undefined) next.push(k);
      } else if (seg.kind === 'index' && Array.isArray(v)) {
        const i = seg.value as number;
        if (i >= 0 && i < v.length) next.push(v[i]!);
      } else if (seg.kind === 'wildcard') {
        if (Array.isArray(v)) next.push(...v);
        else if (v !== null && typeof v === 'object')
          next.push(...Object.values(v as Record<string, unknown>));
      }
    }
    cur = next;
  }
  return cur;
}
