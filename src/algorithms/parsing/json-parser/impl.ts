// =============================================================================
// 手写 JSON 解析器（递归下降）· 纯算法实现
// 不依赖 JSON.parse。支持 null/true/false/number/string/array/object。
// 支持 \\" \\\\ \/ \\b \\f \\n \\r \\t \\uXXXX 转义。
// 错误时抛出带位置信息的异常。
// 零 DOM 依赖，可独立单测。
// =============================================================================

import type { TreeNode } from '../../../types.ts';

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

/** 算法执行过程中的事件钩子。任一可选。 */
export interface JsonParserHooks {
  /** 解析出一个值（type 标识种类）。 */
  onValue?: (
    type: 'null' | 'boolean' | 'number' | 'string' | 'array' | 'object',
    value: unknown,
  ) => void;
  /** 解析数组的一个元素。 */
  onArrayElement?: (index: number, value: JsonValue) => void;
  /** 解析对象的一对键值。 */
  onObjectMember?: (key: string, value: JsonValue) => void;
  /** 解析完成。 */
  onResult?: (value: JsonValue) => void;
}

/** 解析错误（带位置）。 */
export class JsonParseError extends Error {
  readonly position: number;
  constructor(message: string, position: number) {
    super(`JSON 解析错误 @${position}: ${message}`);
    this.name = 'JsonParseError';
    this.position = position;
  }
}

/**
 * 解析 JSON 字符串为 JavaScript 值。
 *
 * @param s JSON 文本
 * @param hooks 可选事件钩子
 * @returns 解析得到的值
 * @throws JsonParseError 解析失败
 */
export function parseJson(s: string, hooks: JsonParserHooks = {}): JsonValue {
  let pos = 0;
  const len = s.length;

  const err = (msg: string): never => {
    throw new JsonParseError(msg, pos);
  };
  const eof = (): boolean => pos >= len;

  /** 跳过空白：空格、制表、换行、回车。 */
  const skipWs = (): void => {
    while (pos < len) {
      const c = s[pos]!;
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') pos++;
      else break;
    }
  };

  /** 期望当前字符为 ch，否则报错；消费之。 */
  const expect = (ch: string): void => {
    if (s[pos] !== ch) err(`期望 "${ch}"，实际 "${s[pos] ?? '<EOF>'}"`);
    pos++;
  };

  // —— value → null | true | false | number | string | array | object ——
  const parseValue = (): JsonValue => {
    skipWs();
    if (eof()) err('意外的输入结束');
    const c = s[pos]!;
    switch (c) {
      case 'n':
        return parseLiteral('null', null, 'null', hooks);
      case 't':
        return parseLiteral('true', true, 'boolean', hooks);
      case 'f':
        return parseLiteral('false', false, 'boolean', hooks);
      case '"':
        return parseString(hooks);
      case '[':
        return parseArray(hooks);
      case '{':
        return parseObject(hooks);
      default:
        if (c === '-' || (c >= '0' && c <= '9')) return parseNumber(hooks);
        return err(`意外字符 "${c}"`);
    }
  };

  const parseLiteral = (
    word: string,
    value: null | boolean,
    type: 'null' | 'boolean',
    h: JsonParserHooks,
  ): JsonValue => {
    if (s.slice(pos, pos + word.length) !== word) err(`期望 ${word}`);
    pos += word.length;
    h.onValue?.(type, value);
    return value;
  };

  const parseNumber = (h: JsonParserHooks): number => {
    const start = pos;
    if (s[pos] === '-') pos++;
    // 整数部分
    if (s[pos] === '0') {
      pos++;
    } else if (s[pos]! >= '1' && s[pos]! <= '9') {
      while (pos < len && s[pos]! >= '0' && s[pos]! <= '9') pos++;
    } else {
      err('数字格式错误：缺少整数部分');
    }
    // 小数部分
    if (s[pos] === '.') {
      pos++;
      if (!(s[pos]! >= '0' && s[pos]! <= '9')) err('小数点后需至少 1 位数字');
      while (pos < len && s[pos]! >= '0' && s[pos]! <= '9') pos++;
    }
    // 指数部分
    if (s[pos] === 'e' || s[pos] === 'E') {
      pos++;
      if (s[pos] === '+' || s[pos] === '-') pos++;
      if (!(s[pos]! >= '0' && s[pos]! <= '9')) err('指数需至少 1 位数字');
      while (pos < len && s[pos]! >= '0' && s[pos]! <= '9') pos++;
    }
    const num = parseFloat(s.slice(start, pos));
    h.onValue?.('number', num);
    return num;
  };

  const parseString = (h: JsonParserHooks): string => {
    expect('"');
    let result = '';
    while (pos < len) {
      const c = s[pos]!;
      if (c === '"') {
        pos++;
        h.onValue?.('string', result);
        return result;
      }
      if (c === '\\') {
        pos++;
        if (eof()) err('字符串转义意外结束');
        const esc = s[pos]!;
        switch (esc) {
          case '"':
            result += '"';
            break;
          case '\\':
            result += '\\';
            break;
          case '/':
            result += '/';
            break;
          case 'b':
            result += '\b';
            break;
          case 'f':
            result += '\f';
            break;
          case 'n':
            result += '\n';
            break;
          case 'r':
            result += '\r';
            break;
          case 't':
            result += '\t';
            break;
          case 'u': {
            const hex = s.slice(pos + 1, pos + 5);
            if (!/^[0-9a-fA-F]{4}$/.test(hex)) err('非法 \\u 转义');
            result += String.fromCharCode(parseInt(hex, 16));
            pos += 4;
            break;
          }
          default:
            err(`非法转义 \\${esc}`);
        }
        pos++;
      } else {
        // 普通字符（含 UTF-8 多字节按原样拼接）
        result += c;
        pos++;
      }
    }
    return err('字符串未闭合');
  };

  const parseArray = (h: JsonParserHooks): JsonValue[] => {
    expect('[');
    const arr: JsonValue[] = [];
    skipWs();
    if (s[pos] === ']') {
      pos++;
      h.onValue?.('array', arr);
      return arr;
    }
    for (;;) {
      const v = parseValue();
      arr.push(v);
      h.onArrayElement?.(arr.length - 1, v);
      skipWs();
      if (s[pos] === ',') {
        pos++;
        skipWs();
        // 检测尾逗号
        if (s[pos] === ']') err('数组尾逗号非法');
        continue;
      }
      if (s[pos] === ']') {
        pos++;
        break;
      }
      err(`数组中期望 "," 或 "]"，实际 "${s[pos] ?? '<EOF>'}"`);
    }
    h.onValue?.('array', arr);
    return arr;
  };

  const parseObject = (h: JsonParserHooks): { [key: string]: JsonValue } => {
    expect('{');
    const obj: { [key: string]: JsonValue } = {};
    skipWs();
    if (s[pos] === '}') {
      pos++;
      h.onValue?.('object', obj);
      return obj;
    }
    for (;;) {
      skipWs();
      if (s[pos] !== '"') err('对象键必须是字符串');
      const key = parseStringNoHook();
      skipWs();
      expect(':');
      const v = parseValue();
      obj[key] = v;
      h.onObjectMember?.(key, v);
      skipWs();
      if (s[pos] === ',') {
        pos++;
        skipWs();
        if (s[pos] === '}') err('对象尾逗号非法');
        continue;
      }
      if (s[pos] === '}') {
        pos++;
        break;
      }
      err(`对象中期望 "," 或 "}"，实际 "${s[pos] ?? '<EOF>'}"`);
    }
    h.onValue?.('object', obj);
    return obj;
  };

  /** 解析字符串但不触发 onValue（对象键用，避免污染）。 */
  const parseStringNoHook = (): string => {
    expect('"');
    let result = '';
    while (pos < len) {
      const c = s[pos]!;
      if (c === '"') {
        pos++;
        return result;
      }
      if (c === '\\') {
        pos++;
        const esc = s[pos]!;
        switch (esc) {
          case '"':
            result += '"';
            break;
          case '\\':
            result += '\\';
            break;
          case '/':
            result += '/';
            break;
          case 'b':
            result += '\b';
            break;
          case 'f':
            result += '\f';
            break;
          case 'n':
            result += '\n';
            break;
          case 'r':
            result += '\r';
            break;
          case 't':
            result += '\t';
            break;
          case 'u': {
            const hex = s.slice(pos + 1, pos + 5);
            if (!/^[0-9a-fA-F]{4}$/.test(hex)) err('非法 \\u 转义');
            result += String.fromCharCode(parseInt(hex, 16));
            pos += 4;
            break;
          }
          default:
            err(`非法转义 \\${esc}`);
        }
        pos++;
      } else {
        result += c;
        pos++;
      }
    }
    return err('字符串未闭合');
  };

  // —— 入口 ——
  const value = parseValue();
  skipWs();
  if (pos !== len) {
    err(`解析后存在多余字符 @${pos}："${s.slice(pos, pos + 20)}"`);
  }
  hooks.onResult?.(value);
  return value;
}

// ---------------------------------------------------------------------------
// 辅助：把 JSON 值渲染成 TreeNode（可视化用，可选）
// ---------------------------------------------------------------------------

let nodeIdCounter = 0;
function nextId(): string {
  return `n${nodeIdCounter++}`;
}

/** 重置节点 id 计数器。 */
export function resetNodeId(): void {
  nodeIdCounter = 0;
}

/**
 * 把 JSON 值转换为 TreeNode（用于树形可视化）。
 * - 对象节点：value='{n}'，children=每个键值对（中间节点 key，叶子或子树）
 * - 数组节点：value='[n]'，children=各元素
 * - 基本值：叶子
 */
export function toJsonTree(value: JsonValue, label?: string): TreeNode {
  const node: TreeNode = { id: nextId(), value: '', role: 'default' };
  if (label !== undefined) node.edgeLabel = label;
  if (value === null) {
    node.value = 'null';
    node.role = 'warn';
  } else if (typeof value === 'boolean') {
    node.value = String(value);
  } else if (typeof value === 'number') {
    node.value = String(value);
  } else if (typeof value === 'string') {
    node.value = `"${value}"`;
  } else if (Array.isArray(value)) {
    node.value = `[${value.length}]`;
    node.role = 'pivot';
    node.children = value.map((v, i) => toJsonTree(v, String(i)));
  } else {
    const entries = Object.entries(value);
    node.value = `{${entries.length}}`;
    node.role = 'pivot';
    node.children = entries.map(([k, v]) => toJsonTree(v, k));
  }
  return node;
}
