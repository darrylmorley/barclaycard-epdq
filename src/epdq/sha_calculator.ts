import crypto from "crypto";

interface ShaCalculatorParameters {
  [key: string]: string | undefined;
}

export class ShaCalculator {
  private shasum: crypto.Hash;
  private sha: string;
  private parameters: ShaCalculatorParameters;

  constructor(
    parameters: ShaCalculatorParameters,
    sha: string,
    shaType: string
  ) {
    this.shasum = crypto.createHash(shaType);
    this.sha = sha;
    this.parameters = {};

    for (const [key, value] of Object.entries(parameters)) {
      if (value !== undefined && value.length) {
        this.parameters[key.toUpperCase()] = value;
      }
    }
  }

  public shaSignature(): string {
    if (!this.sha || !this.sha.length) {
      throw new Error("Missing or empty sha parameter");
    }

    let buffer = "";
    const sortedKeys = Object.keys(this.parameters).sort();

    for (const key of sortedKeys) {
      buffer += `${key}=${this.parameters[key]}${this.sha}`;
    }

    this.shasum.update(buffer);
    return this.shasum.digest("hex").toUpperCase();
  }
}
