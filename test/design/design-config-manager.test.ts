import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ConfigManager } from '../../src/algorithms/design/design-config-manager/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-config-manager/trace.ts';

test('config 默认值', () => {
  const cm = new ConfigManager({ port: 80 });
  assert.equal(cm.get('port'), 80);
  assert.equal(cm.get('missing', 99), 99);
});
test('config set + onChange', () => {
  const cm = new ConfigManager({});
  const events: number[] = [];
  cm.onChange('x', (v) => events.push(v as number));
  cm.set('x', 1);
  cm.set('x', 2);
  assert.deepEqual(events, [1, 2]);
});
test('config trace 非空', () => assert.ok(buildTrace().length > 0));
