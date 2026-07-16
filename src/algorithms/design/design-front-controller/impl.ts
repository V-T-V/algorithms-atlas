export type Handler = (req: string) => string;
export class FrontController {
  private handlers = new Map<string, Handler>();
  register(route: string, h: Handler): void {
    this.handlers.set(route, h);
  }
  dispatch(
    route: string,
    req: string,
    hooks: { onDispatch?: (r: string, resp: string) => void } = {},
  ): string {
    const h = this.handlers.get(route);
    const resp = h ? h(req) : '404';
    hooks.onDispatch?.(route, resp);
    return resp;
  }
}
