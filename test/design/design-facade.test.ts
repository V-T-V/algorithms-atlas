import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ComputerFacade,
  CPU,
  Memory,
  HardDrive,
} from '../../src/algorithms/design/design-facade/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-facade/trace.ts';

test('facade boot 成功', () => {
  const f = new ComputerFacade();
  assert.equal(f.boot(), true);
});
test('facade shutdown 成功', () => {
  const f = new ComputerFacade();
  assert.equal(f.shutdown(), true);
});
test('facade 子系统可独立使用', () => {
  const cpu = new CPU();
  cpu.freeze();
  assert.equal(cpu.jump(100), 'CPU jump 100');
  const mem = new Memory();
  assert.ok(mem.load(0, 'x').includes('x'));
  const hd = new HardDrive();
  assert.ok(hd.read(5, 10).includes('10B'));
});
test('facade 触发所有子步骤', () => {
  const steps: string[] = [];
  const f = new ComputerFacade({ onSubStep: (sub) => steps.push(sub) });
  f.boot();
  // CPU/Memory/HD 都应被调用
  assert.ok(steps.includes('CPU'));
  assert.ok(steps.includes('Memory'));
  assert.ok(steps.includes('HD'));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
