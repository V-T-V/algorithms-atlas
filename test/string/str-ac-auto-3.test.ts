import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ACAutomaton3 } from '../../src/algorithms/string/str-ac-auto-3/impl.ts';

test('ac 自动机多模式', () => {
  const ac = new ACAutomaton3();
  ac.insert('he');
  ac.insert('she');
  ac.insert('his');
  ac.insert('hers');
  ac.build();
  const matches = ac.match('ushers');
  // 命中：he (pos 3), she (pos 2), hers (pos 4)
  const patterns = matches.map((m) => ac.getPattern(m.patternId)).sort();
  assert.ok(patterns.includes('he'));
  assert.ok(patterns.includes('she'));
  assert.ok(patterns.includes('hers'));
});

test('ac 自动机无匹配', () => {
  const ac = new ACAutomaton3();
  ac.insert('abc');
  ac.build();
  assert.equal(ac.match('xyz').length, 0);
});
