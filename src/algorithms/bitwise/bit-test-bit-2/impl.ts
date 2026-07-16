export interface TestBitHooks {
  onResult?: (v: boolean) => void;
}
export function testBit(x: number, i: number, hooks: TestBitHooks = {}): boolean {
  const r = ((x >>> i) & 1) === 1;
  hooks.onResult?.(r);
  return r;
}
