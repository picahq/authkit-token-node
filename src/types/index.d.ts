export interface Author {
  _id: string;
  name?: string;
  avatar?: string;
  [x: string]: unknown;
}
export interface Ownership {
  buildableId: string;
  clientId?: string;
  projectId?: string;
  organizationId?: string;
  author?: Author;
  userId?: string;
}

export interface EventLink {
  _id?: string;
  version: string;
  ownership: Ownership;
  identity?: string;
  identityType?: 'user' | 'team' | 'organization' | 'project';
  group?: string;
  label?: string;
  token: string;
  createdAt: number;
  createdDate: Date;
  updatedAt?: number;
  expiresAt: number;
  environment?: string;
  usageSource?: string;
  _type: string;
}

export type CreateEventLinkPayload = {
  identity?: string;
  identityType?: 'user' | 'team' | 'organization' | 'project';
  group?: string;
  label?: string;
};

export interface ConnectionDefinition {
  authMethod: object | null; // You can specify the correct data type for authMethod if needed
  _id: string;
  platformVersion: string;
  platform: string;
  type: string;
  name: string;
  authSecrets: any[]; // You can specify the correct data type for authSecrets if needed
  frontend: {
    spec: {
      title: string;
      description: string;
      platform: string;
      category: string;
      image: string;
      tags: string[];
    };
    connectionForm: {
      name: string;
      description: string;
      formData: any[]; // You can specify the correct data type for formData if needed
    };
  };
  paths: {
    id: any; // You can specify the correct data type for id if needed
    event: any; // You can specify the correct data type for event if needed
    payload: any; // You can specify the correct data type for payload if needed
    timestamp: string;
    secret: string;
    signature: any; // You can specify the correct data type for signature if needed
    cursor: any; // You can specify the correct data type for cursor if needed
  };
  settings: {
    parseWebhookBody: boolean;
    showSecret: boolean;
    allowCustomEvents: boolean;
    oauth: boolean;
  };
  hidden: boolean;
  testConnection: any; // You can specify the correct data type for testConnection if needed
  createdAt: number;
  updatedAt: number;
  updated: boolean;
  version: string;
  lastModifiedBy: string;
  deleted: boolean;
  changeLog: Record<string, any>; // Assuming changeLog is a dictionary
  tags: string[]; // You can specify the correct data type for tags if needed
  active: boolean;
  deprecated: boolean;
}

export interface ConnectionDefinitions {
  rows: ConnectionDefinition[];
  limit: number;
  skip: number;
  total: number;
}

export interface Platform {
  type: string;
  title: string;
  connectionDefinitionId: string;
  active?: boolean;
  image: string;
  activatedAt?: number;
  secretsServiceId?: string;
  secret?: {
    clientId: string;
    clientSecretDisplay: string;
  };
  environment?: 'test' | 'live';
}

export interface Feature {
  key: string;
  value: 'enabled' | 'disabled';
  updatedAt: number;
}

export interface ConnectionRecord {
  _id: string;
  platformVersion: string;
  connectionDefinitionId: string;
  name: string;
  key: string;
  environment: string;
  platform: string;
  secretsServiceId: string;
  settings: {
    parseWebhookBody: boolean;
    showSecret: boolean;
    allowCustomEvents: boolean;
    oauth: boolean;
  };
  throughput: {
    key: string;
    limit: number;
  };
  createdAt: number;
  updatedAt: number;
  updated: boolean;
  version: string;
  lastModifiedBy: string;
  deleted: boolean;
  changeLog: Record<string, any>; // You can replace 'any' with a more specific type if needed
  tags: string[];
  active: boolean;
  deprecated: boolean;
}


export interface EmbedTokenRecord {
  linkSettings: {
    connectedPlatforms: Platform[];
    eventIncToken: string;
  };
  group?: string;
  label?: string;
  identity?: string;
  identityType?: 'user' | 'team' | 'organization' | 'project';
  createdAt: number;
  createdDate: Date;
  updatedAt?: number;
  expiresAt?: number;
  environment: string;
  features?: Feature[];
  sessionId: string;
  _id?: string;
  formData?: object;
  response?: {
    isConnected: boolean;
    message?: string;
    connection?: ConnectionRecord;
  }
}

export interface LinkSettings {
  _id?: string;
  ownership: Ownership;
  connectedPlatforms: Platform[];
  createdAt: number;
  updatedAt: number;
  createdDate: Date;
  updatedDate: Date;
  features?: Feature[];
}

export interface AuthkitConnection {
  id: number;
  connectionDefId: number;
  type: string;
  title: string;
  image: string;
  activatedAt: string;
  secretId?: string | null;
  clientSecretDisplay?: string | null;
  clientIdDisplay?: string | null;
  scopes?: string | null;
  environment: string;
  guide?: string | null;
  createdAt: string;
  tags: string[];
  active: boolean;
}

export interface AuthkitResponse {
  rows: AuthkitConnection[];
  total: number;
  pages: number;
  page: number;
  requestId: number;
  isWhiteList: boolean;
}

export interface ConnectorPaginationOptions {
  limit?: number;
  maxConcurrentRequests?: number;
  maxRetries?: number;
}

export interface UserFlags {
  accessList: string[];
  authkitWhitelist: boolean;
  earlyAccess: string[];
  completedQuickstart: boolean;
}


