export abstract class PageController {
  abstract handle(req: string): string;
}
export class HomePage extends PageController {
  handle(_req: string): string {
    return 'home render';
  }
}
export class AboutPage extends PageController {
  handle(req: string): string {
    return 'about ' + req;
  }
}
export interface PcHooks {
  onRender?: (page: string, html: string) => void;
}
export function render(pc: PageController, name: string, req: string, hooks: PcHooks = {}): string {
  const html = pc.handle(req);
  hooks.onRender?.(name, html);
  return html;
}
