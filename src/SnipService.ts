import * as vscode from "vscode";
import { request, logger } from './utils';
import builtin from './builtin';

class SnipService {

  private cache = new Map<string, string>();

  private async getData(target: string): Promise<string> {
    if (this.cache.has(target)) {
      logger.log(`attach cache: ${target}`);
      return this.cache.get(target);
    }
    const originData = await request(target);
    this.cache.set(target, originData);
    return originData;
  }

  public getResourceUrl = (postfix: string): URL => {
    const isCustomSnip = Object.keys(this.customSnip).includes(postfix);
    return isCustomSnip ? new URL(this.customSnip[postfix]) : new URL(`https://raw.githubusercontent.com/howel52/snipper-vsix/master/snip/${postfix}`);
  }

  public async getSnip (resourceUrl: URL): Promise<string> {
    return this.getData(resourceUrl.href);
  }

  private get customSnip (): { [snipName: string]: string } {
    const config = vscode.workspace.getConfiguration('snipper');
    const customSnip = config.get('customSnip') || {};
    return customSnip as { [snipName: string]: string };
  }

  public get selection () {
    const custom = Object.keys(this.customSnip);
    return [
      ...builtin,
      ...custom,
    ]
  }

  /**
   * clear snips cache in memory
   */
  public clearCache () {
    this.cache.clear();
  }

  // public updateBuiltinSnip () {
  //   
  // }
}

export default SnipService;
