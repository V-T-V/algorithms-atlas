import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Aho3 } from '../../src/algorithms/string/str-aho-3/impl.ts';

test('aho DFA 多模式', () => {
  const aho = new Aho3();
  aho.insert('he');
  aho.insert('she');
  aho.insert('his');
  aho.insert('hers');
  aho.build();
  const matches = aho.match('shers');
  const patterns = matches.map((m) => aho.getPattern(m.patternId)).sort();
  assert.ok(patterns.includes('he'));
  assert.ok(patterns.includes('she'));
  assert.ok(patterns.includes('hers'));
});

test('aho DFA 无匹配', () => {
  const aho = new Aho3();
  aho.insert('abc');
  aho.build();
  assert.equal(aho.match('xyz').length, 0);
});
