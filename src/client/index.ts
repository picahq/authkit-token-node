import { getHeaders } from '../logic/getHeaders';
import { createEventLinkTokenApi } from '../apis';

interface ClientConfig {
  baseUrl?: string;
}

export class AuthKitToken {
  private secret: string;
  private configs: ClientConfig;

  constructor(secret: string, configs: ClientConfig = {}) {
    this.secret = secret;
    this.configs = configs;
  }

  /**
   * Not for use outside the SDK lib
   */
  get _clientInfo() {
    return {
      secret: this.secret,
      configs: this.configs,
    };
  }

  get _url() {
    if (this.configs.baseUrl) {
      return this.configs.baseUrl;
    }

    return 'https://api.picaos.com';
  }

  async create(payload?: {
    /**
     * Unique identifier for the token.
     * @remarks It is recommended to avoid using spaces and colons in this field as it may lead to unexpected behavior in some systems.
     */
    identity?: string;
    identityType?: "user" | "team" | "organization" | "project";
    /** @deprecated Use 'identity' instead */
    group?: string;
    /** @deprecated */
    label?: string;
  }) {
    const secret = this._clientInfo.secret;
    const url = this._url;
    const headers = getHeaders(secret);

    const result = await createEventLinkTokenApi(headers, url, payload);
    return result;
  }
}
