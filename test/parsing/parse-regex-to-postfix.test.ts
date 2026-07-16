import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  regexToPostfix,
  insertConcat,
} from '../../src/algorithms/parsing/parse-regex-to-postfix/impl.ts';

test('regex-postfix 单字', () => assert.equal(regexToPostfix('a'), 'a'));
test('regex-postfix 连接', () => assert.equal(regexToPostfix('ab'), 'ab.'));
test('regex-postfix 或与星', () => assert.equal(regexToPostfix('(a|b)*'), 'ab|*'));
test('regex-postfix (a|b)*c', () => assert.equal(regexToPostfix('(a|b)*c'), 'ab|*c.'));
