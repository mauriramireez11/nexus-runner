export type PipelineType = 'newman' | 'mobile';
export type PipelineStatus = 'idle' | 'running' | 'success' | 'failed' | 'cancelled';
export type UserRole = 'admin' | 'tester';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  type: PipelineType;
  config: NewmanConfig | MobileConfig;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  status?: PipelineStatus;
}

export interface NewmanConfig {
  collection: string;
  environment?: string;
  variables?: Record<string, string>;
  iterations?: number;
  folder?: string;
  timeout?: number;
}

export interface MobileConfig {
  apkPath: string;
  testSuite: string;
  device: string;
  platform: 'android' | 'ios';
  timeout?: number;
}

export interface Execution {
  id: string;
  pipelineId: string;
  pipelineName: string;
  status: PipelineStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  logs?: string[];
  result?: ExecutionResult;
  triggeredBy: string;
}

export interface ExecutionResult {
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  errors?: string[];
  assertions?: AssertionResult[];
}

export interface AssertionResult {
  name: string;
  passed: boolean;
  error?: string;
}

export interface SlackConfig {
  webhookUrl: string;
  channelId: string;
  enabled: boolean;
  notifyOn: ('success' | 'failure' | 'all')[];
}