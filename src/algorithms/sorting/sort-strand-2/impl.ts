// 缕排序 · 纯算法实现
export interface Strand2Hooks {
  onStrand?: (strand: number[], result: number[]) => void;
}

function mergeInto(a: number[], b: number[]): number[] {
  const out: number[] = [];
  let i = 0,
    j = 0;
  while (i < a.length && j < b.length) {
    if (a[i]! <= b[j]!) out.push(a[i++]!);
    else out.push(b[j++]!);
  }
  while (i < a.length) out.push(a[i++]!);
  while (j < b.length) out.push(b[j++]!);
  return out;
}

export function strandSort2(arr: readonly number[], hooks: Strand2Hooks = {}): number[] {
  const remaining = [...arr];
  let result: number[] = [];
  while (remaining.length > 0) {
    const strand: number[] = [remaining.shift()!];
    for (let i = 0; i < remaining.length; ) {
      if (remaining[i]! >= strand[strand.length - 1]!) {
        strand.push(remaining.splice(i, 1)[0]!);
      } else i++;
    }
    result = mergeInto(result, strand);
    hooks.onStrand?.(strand, result);
  }
  return result;
}
