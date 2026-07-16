import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LegacyLogger,
  LoggerAdapter,
  NewToLegacyAdapter,
} from '../../src/algorithms/design/design-adapter/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-adapter/trace.ts';

test('adapter info 转换', () => {
  const a = new LoggerAdapter(new LegacyLogger());
  assert.equal(a.log('info', 'x'), '[INFO] x');
});
test('adapter warn/error 转换', () => {
  const a = new LoggerAdapter(new LegacyLogger());
  assert.equal(a.log('warn', 'y'), '[WARN] y');
  assert.equal(a.log('error', 'z'), '[ERROR] z');
});
test('adapter legacy 原始行为', () => {
  const l = new LegacyLogger();
  assert.equal(l.writeMsg(0, 'a'), '[INFO] a');
  assert.equal(l.writeMsg(2, 'b'), '[ERROR] b');
});
test('adapter 双向适配', () => {
  const a = new LoggerAdapter(new LegacyLogger());
  const back = new NewToLegacyAdapter(a);
  assert.equal(back.writeMsg(1, 'c'), '[WARN] c');
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
