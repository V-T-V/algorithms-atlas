export interface ErleHooks {
  onRun?: (byte: number, count: number) => void;
  onLiteral?: (bytes: number) => void;
}
const ESC = 0xff;
export function rleEscapeEncode(data: number[], hooks: ErleHooks = {}): number[] {
  const out: number[] = [];
  let i = 0;
  while (i < data.length) {
    let run = 1;
    while (i + run < data.length && data[i + run] === data[i] && run < 255) run++;
    if (run >= 4) {
      out.push(ESC, run, data[i]!);
      hooks.onRun?.(data[i]!, run);
      i += run;
    } else {
      out.push(data[i]!);
      hooks.onLiteral?.(1);
      i++;
    }
  }
  return out;
}
export function rleEscapeDecode(enc: number[]): number[] {
  const out: number[] = [];
  let i = 0;
  while (i < enc.length) {
    if (enc[i] === ESC) {
      out.push(...Array(enc[i + 1]!).fill(enc[i + 2]!));
      i += 3;
    } else {
      out.push(enc[i]!);
      i++;
    }
  }
  return out;
}
