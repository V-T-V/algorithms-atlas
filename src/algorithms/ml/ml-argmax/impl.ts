// Argmax · 实现
export function argmax(values: number[]): number {
  if (values.length === 0) throw new RangeError('数组为空');
  let bi = 0;
  for (let i = 1; i < values.length; i++) if (values[i]! > values[bi]!) bi = i;
  return bi;
}
export function argmin(values: number[]): number {
  if (values.length === 0) throw new RangeError('数组为空');
  let bi = 0;
  for (let i = 1; i < values.length; i++) if (values[i]! < values[bi]!) bi = i;
  return bi;
}
