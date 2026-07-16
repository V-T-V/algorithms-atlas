import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  peephole,
  instrStr,
  type Instr,
  type PeepholeHooks,
} from '../../src/algorithms/parsing/parse-peephole/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/parsing/parse-peephole/trace.ts';

const L = (dst: string, src1: string): Instr => ({ op: 'LOAD', dst, src1 });
const S = (dst: string, src1: string): Instr => ({ op: 'STORE', dst, src1 });
const BIN = (op: string, dst: string, src1: string, src2: string): Instr => ({
  op,
  dst,
  src1,
  src2,
});

test('parse-peephole 冗余 LOAD/STORE 消除', () => {
  const r = peephole([L('r1', 'x'), S('x', 'r1')]);
  assert.equal(r.instrs.length, 0);
  assert.ok(r.rewrites >= 1);
});

test('parse-peephole 重复 LOAD 去一条', () => {
  const r = peephole([L('r1', 'x'), L('r1', 'x')]);
  assert.equal(r.instrs.length, 1);
});

test('parse-peephole ADD r,0 删除', () => {
  const r = peephole([BIN('ADD', 'r1', 'r1', '0')]);
  assert.equal(r.instrs.length, 0);
});

test('parse-peephole SUB r,0 删除', () => {
  const r = peephole([BIN('SUB', 'r1', 'r1', '0')]);
  assert.equal(r.instrs.length, 0);
});

test('parse-peephole MUL r,1 删除', () => {
  const r = peephole([BIN('MUL', 'r1', 'r1', '1')]);
  assert.equal(r.instrs.length, 0);
});

test('parse-peephole MUL r,0 → MOV r,0', () => {
  const r = peephole([BIN('MUL', 'r1', 'r1', '0')]);
  assert.equal(r.instrs.length, 1);
  assert.equal(r.instrs[0]!.op, 'MOV');
  assert.equal(r.instrs[0]!.src1, '0');
});

test('parse-peephole MUL r,2 → SHL r,1（强度削减）', () => {
  const r = peephole([BIN('MUL', 'r1', 'r1', '2')]);
  assert.equal(r.instrs.length, 1);
  assert.equal(r.instrs[0]!.op, 'SHL');
  assert.equal(r.instrs[0]!.src2, '1');
});

test('parse-peephole STORE x,r; LOAD r,x → 仅保留 STORE', () => {
  const r = peephole([S('x', 'r1'), L('r1', 'x')]);
  assert.equal(r.instrs.length, 1);
  assert.equal(r.instrs[0]!.op, 'STORE');
});

test('parse-peephole 默认演示整体减少', () => {
  const r = peephole(DEFAULT_INPUT);
  assert.ok(r.instrs.length < DEFAULT_INPUT.length);
  assert.ok(r.rewrites >= 4);
});

test('parse-peephole 不动点收敛', () => {
  const r = peephole(DEFAULT_INPUT);
  assert.ok(r.passes >= 1);
});

test('parse-peephole 无可优化保持不变', () => {
  const input = [L('r1', 'x'), BIN('ADD', 'r2', 'r1', 'r1')];
  const r = peephole(input);
  assert.equal(r.rewrites, 0);
  assert.equal(r.instrs.length, input.length);
});

test('parse-peephole instrStr', () => {
  assert.equal(instrStr(L('r1', 'x')), 'LOAD r1 x');
});

test('parse-peephole 钩子', () => {
  let rewrites = 0;
  let passes = 0;
  let results = 0;
  const hooks: PeepholeHooks = {
    onRewrite: () => rewrites++,
    onPass: () => passes++,
    onResult: () => results++,
  };
  peephole(DEFAULT_INPUT, 20, hooks);
  assert.ok(rewrites >= 4);
  assert.ok(passes >= 1);
  assert.equal(results, 1);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
  const last = frames[frames.length - 1]!;
  const cur = last.aux!.find((e) => e.label === '现指令数');
  assert.ok(cur);
});
