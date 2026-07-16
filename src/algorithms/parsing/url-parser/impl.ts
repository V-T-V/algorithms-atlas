// URL 解析器 · 纯算法实现

export interface ParsedUrl {
  scheme: string;
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  path: string;
  query: Record<string, string>;
  fragment?: string;
}

/** 事件钩子。 */
export interface UrlHooks {
  /** 识别出 fragment。 */
  onFragment?: (frag: string) => void;
  /** 识别出 query（原始串）。 */
  onQuery?: (raw: string) => void;
  /** 解析出一个 query 键值对。 */
  onQueryParam?: (key: string, value: string) => void;
  /** 识别出 scheme。 */
  onScheme?: (scheme: string) => void;
  /** 识别出 authority。 */
  onAuthority?: (auth: string) => void;
  /** 识别出 host 与 port。 */
  onHostPort?: (host: string, port: number | undefined) => void;
  /** 完成。 */
  onResult?: (url: ParsedUrl) => void;
}

function decode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/**
 * 解析 URL 字符串。
 *
 * @param raw 原始 URL
 * @param hooks 可选事件钩子
 * @returns 结构化 URL
 */
export function parseUrl(raw: string, hooks: UrlHooks = {}): ParsedUrl {
  let s = raw;
  let fragment: string | undefined;
  const hashIdx = s.indexOf('#');
  if (hashIdx >= 0) {
    fragment = s.slice(hashIdx + 1);
    s = s.slice(0, hashIdx);
    hooks.onFragment?.(fragment);
  }

  let queryStr = '';
  const qIdx = s.indexOf('?');
  if (qIdx >= 0) {
    queryStr = s.slice(qIdx + 1);
    s = s.slice(0, qIdx);
    hooks.onQuery?.(queryStr);
  }
  const query: Record<string, string> = {};
  if (queryStr) {
    for (const pair of queryStr.split('&')) {
      if (pair === '') continue;
      const eq = pair.indexOf('=');
      const k = eq >= 0 ? pair.slice(0, eq) : pair;
      const v = eq >= 0 ? pair.slice(eq + 1) : '';
      query[decode(k)] = decode(v);
      hooks.onQueryParam?.(decode(k), decode(v));
    }
  }

  let scheme = '';
  let rest = s;
  const schemeMatch = /^([a-zA-Z][a-zA-Z0-9+.-]*):\/\/(.*)$/.exec(s);
  if (schemeMatch) {
    scheme = schemeMatch[1]!;
    rest = schemeMatch[2]!;
    hooks.onScheme?.(scheme);
  }

  // authority 在首个 / 之前
  let authority = '';
  let path = '';
  const slashIdx = rest.indexOf('/');
  if (slashIdx >= 0) {
    authority = rest.slice(0, slashIdx);
    path = rest.slice(slashIdx);
  } else {
    authority = rest;
    path = '';
  }
  if (authority) hooks.onAuthority?.(authority);

  let user: string | undefined;
  let password: string | undefined;
  let host: string | undefined;
  let port: number | undefined;
  if (authority) {
    let hostport = authority;
    const atIdx = authority.lastIndexOf('@');
    if (atIdx >= 0) {
      const userinfo = authority.slice(0, atIdx);
      hostport = authority.slice(atIdx + 1);
      const colon = userinfo.indexOf(':');
      if (colon >= 0) {
        user = decode(userinfo.slice(0, colon));
        password = decode(userinfo.slice(colon + 1));
      } else {
        user = decode(userinfo);
      }
    }
    // host:port（port 为末尾数字）
    const portMatch = /^(.*):( d+)$/.exec(hostport);
    if (portMatch) {
      host = portMatch[1]!;
      port = parseInt(portMatch[2]!, 10);
    } else {
      host = hostport;
    }
    hooks.onHostPort?.(host, port);
  }

  const result: ParsedUrl = {
    scheme,
    user,
    password,
    host,
    port,
    path: path || (authority ? '/' : ''),
    query,
    fragment,
  };
  hooks.onResult?.(result);
  return result;
}
