// RLE v3 · 实现
export interface RleToken {
  kind: 'run' | 'lit';
  len: number;
  char?: number;
  lits?: number[];
}
export interface RleHooks {
  onToken?: (t: RleToken) => void;
}
export function rleEncode(data: number[], minRun = 3, hooks: RleHooks = {}): RleToken[] {
  const out: RleToken[] = [];
  let i = 0;
  while (i < data.length) {
    let run = 1;
    while (i + run < data.length && data[i + run] === data[i] && run < 255) run++;
    if (run >= minRun) {
      const t: RleToken = { kind: 'run', len: run, char: data[i] };
      out.push(t);
      hooks.onToken?.(t);
      i += run;
    } else {
      // 累积字面
      const lits: number[] = [];
      while (i < data.length) {
        let r = 1;
        while (i + r < data.length && data[i + r] === data[i]) r++;
        if (r >= minRun) break;
        lits.push(data[i]!);
        i++;
        if (lits.length >= 128) break;
      }
      const t: RleToken = { kind: 'lit', len: lits.length, lits };
      out.push(t);
      hooks.onToken?.(t);
    }
  }
  return out;
}
export function rleDecode(tokens: RleToken[]): number[] {
  const out: number[] = [];
  for (const t of tokens) {
    if (t.kind === 'run') for (let k = 0; k < t.len; k++) out.push(t.char!);
    else out.push(...(t.lits ?? []));
  }
  return out;
}
