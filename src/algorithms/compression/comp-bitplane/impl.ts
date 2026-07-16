export interface Bp2Hooks {
  onPlane?: (bit: number, plane: number[]) => void;
}
export function bitplaneSeparate(pixels: number[], bits: number, hooks: Bp2Hooks = {}): number[][] {
  const planes: number[][] = Array.from({ length: bits }, () => []);
  for (const p of pixels) for (let b = 0; b < bits; b++) planes[b]!.push((p >> b) & 1);
  planes.forEach((pl, b) => hooks.onPlane?.(b, pl));
  return planes;
}
