import qs from "qs";
import { EPDQ } from "../epdq";
import { ShaCalculator } from "./sha_calculator";

export class Response {
  private rawParameters: Record<string, string> = {};
  private shasign: string | null = null;

  constructor(queryString: string) {
    const rawParameters = qs.parse(queryString) as Record<string, string>;
    this.shasign = rawParameters["SHASIGN"];

    for (const [key, value] of Object.entries(rawParameters)) {
      if (key !== "SHASIGN") {
        this.rawParameters[key] = value;
      }
    }
  }

  private calculatedShaOut(): string {
    if (EPDQ.config.shaOut === null) {
      throw new Error("shaOut configuration is missing");
    }
    return new ShaCalculator(
      this.rawParameters,
      EPDQ.config.shaOut,
      EPDQ.config.shaType
    ).shaSignature();
  }

  public isValidShasign(): boolean {
    if (!this.shasign || !this.shasign.length) {
      throw new Error("Missing or empty SHASIGN parameter");
    }
    return this.calculatedShaOut() === this.shasign;
  }

  public parameters(): Record<string, string> {
    const parameters: Record<string, string> = {};
    for (const [key, value] of Object.entries(this.rawParameters)) {
      parameters[key.toLowerCase()] = value;
    }
    return parameters;
  }
}
