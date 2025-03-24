export class ConfigService {
  private static _instance: ConfigService;
  private _pdfMakerBaseUrl: string = "";

  private constructor() {}

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public initialize(config: { pdfMakerBaseUrl: string }) {
    this._pdfMakerBaseUrl = config.pdfMakerBaseUrl;
  }

  public get pdfMakerBaseUrl(): string {
    return this._pdfMakerBaseUrl;
  }
}
