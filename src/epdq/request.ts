import EPDQ from "../epdq.js";
import { ShaCalculator } from "./sha_calculator.js";

interface RequestParameters {
  [key: string]: string | number | undefined;
}

export class Request {
  private config = EPDQ.config;
  private parameters: RequestParameters;

  static TEST_URL =
    "https://mdepayments.epdq.co.uk/ncol/test/orderstandard.asp";
  static LIVE_URL = "https://payments.epdq.co.uk/ncol/prod/orderstandard.asp";

  constructor(parameters: RequestParameters) {
    this.parameters = parameters;
  }

  private getFullParameters(): RequestParameters {
    const fullParams: RequestParameters = { ...this.parameters };

    if (this.config.pspId === null) {
      throw new Error("Missing PSPID configuration");
    }

    fullParams["pspid"] = this.config.pspId;
    return fullParams;
  }

  private shaSign(): string {
    const fullParams = this.getFullParameters();

    // Convert all values to strings before passing to ShaCalculator
    const stringifiedParams = Object.entries(fullParams).reduce(
      (acc, [key, value]) => {
        acc[key] = value !== undefined ? value.toString() : undefined;
        return acc;
      },
      {} as Record<string, string | undefined>
    );

    const shaCalculator = new ShaCalculator(
      stringifiedParams,
      this.config.shaIn!,
      this.config.shaType!
    );
    return shaCalculator.shaSignature();
  }

  public formAttributes(): Record<string, string> {
    const fullAttrs = this.getFullParameters();
    const formAttrs: Record<string, string> = {};

    for (const [key, value] of Object.entries(fullAttrs)) {
      if (value !== undefined) {
        formAttrs[key.toUpperCase()] = value.toString();
      }
    }

    formAttrs["SHASIGN"] = this.shaSign();
    return formAttrs;
  }

  public requestUrl(): string {
    return this.config.testMode ? Request.TEST_URL : Request.LIVE_URL;
  }
}
