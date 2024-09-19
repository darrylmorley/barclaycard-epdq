export const EPDQ = {
  config: {
    testMode: false,
    shaType: "sha256",
    shaIn: null as string | null,
    shaOut: null as string | null,
    pspId: null as string | null,
  },
};

export { Request } from "./epdq/request";
export { Response } from "./epdq/response";
