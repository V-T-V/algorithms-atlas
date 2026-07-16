import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Light,
  LightOnCommand,
  LightOffCommand,
  RemoteControl,
  MacroCommand,
} from '../../src/algorithms/design/design-command/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-command/trace.ts';

test('command 执行后灯亮', () => {
  const l = new Light();
  const r = new RemoteControl();
  r.execute(new LightOnCommand('on', l));
  assert.equal(l.on, true);
});
test('command undo 还原', () => {
  const l = new Light();
  const r = new RemoteControl();
  r.execute(new LightOnCommand('on', l));
  r.undo();
  assert.equal(l.on, false);
});
test('command 多步 undo', () => {
  const l = new Light();
  const r = new RemoteControl();
  r.execute(new LightOnCommand('on', l));
  r.execute(new LightOffCommand('off', l));
  r.undo(); // undo off → on
  assert.equal(l.on, true);
  r.undo(); // undo on → off
  assert.equal(l.on, false);
});
test('command 宏组合执行与撤销', () => {
  const l = new Light();
  const r = new RemoteControl();
  const m = new MacroCommand('macro', [new LightOnCommand('on', l), new LightOffCommand('off', l)]);
  r.execute(m);
  assert.equal(l.on, false); // on then off
  r.undo(); // 撤销宏：逆序 undo 各子命令，恢复到执行前（灯灭）
  assert.equal(l.on, false);
});
test('command 空栈 undo 返回 null', () => {
  const r = new RemoteControl();
  assert.equal(r.undo(), null);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
