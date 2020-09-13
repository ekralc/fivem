export type ApiEventCallback<T extends any> = (data: T, type?: string) => void;
export type ApiEventCallbackDisposer = () => void;

export interface ApiClient {
  emit<T>(eventType: string, data?: T): void,
  emitSid<T>(sid: string, eventType: string, data?: T): void,
  on<T>(eventType: string, cb: ApiEventCallback<T>): ApiEventCallbackDisposer,
  onAny<T>(cb: ApiEventCallback<T>): ApiEventCallbackDisposer,
  log(...args: any[]): void,
}

export enum States {
  booting,
  preparing,
  ready,
}

export enum ServerStates {
  down,
  up,
  booting,
}

export enum ServerDataStates {
  checking,
  updating,
  ready,
}

export interface FilesystemEntryMeta {
  isFxdkProject?: boolean,
  isResource?: boolean,
  assetMeta?: AssetMeta | null,
}

export interface FilesystemEntry {
  path: string,
  name: string,
  meta: FilesystemEntryMeta,
  isFile: boolean,
  isDirectory: boolean,
  isSymbolicLink: boolean,
  children?: FilesystemEntry[],
}

export type ExplorerChildsMap = {
  [path: string]: FilesystemEntry[],
}

export const assetStatus = {
  ready: 'ready',
  updating: 'updating',
  error: 'error',
};

export interface ProjectResource {
  path: string,
  name: string,
  enabled: boolean,
  running: boolean,
}

export type ProjectResources = {
  [path: string]: ProjectResource,
};

export interface ProjectManifestResource {
  name: string,
  enabled: boolean,
  restartOnChange: boolean,
}

export interface ProjectManifest {
  name: string,
  createdAt: string,
  resources: {
    [name: string]: ProjectManifestResource,
  },
}

export type FilesystemEntryMap = {
  [key: string]: FilesystemEntry[],
};
export interface ProjectFsTree {
  entries: FilesystemEntry[],
  pathsMap: FilesystemEntryMap,
}
export interface Project {
  path: string,
  manifest: ProjectManifest,
  fsTree: ProjectFsTree,
}

export interface RecentProject {
  name: string,
  path: string,
}


export interface DownloadState {
  total: number,
  downloaded: number,
}


export const assetManagerTypes = {
  none: 'none',
  git: 'git',
};
export type AssetManagerType = (typeof assetManagerTypes)[keyof typeof assetManagerTypes];
export interface AssetManager {
  type: AssetManagerType,
  data?: any,
}

export interface AssetMetaFlags {
  readOnly?: boolean,
}

interface BaseAssetMeta {
  flags: AssetMetaFlags,
  manager?: AssetManager,
}

export const assetKinds = {
  resource: 'resource',
  pack: 'pack',
};

export type AssetKind = (typeof assetKinds)[keyof typeof assetKinds];
export interface AssetMetaResource extends BaseAssetMeta {
  kind: typeof assetKinds.resource,
}
export interface AssetMetaPack extends BaseAssetMeta {
  kind: typeof assetKinds.pack,
}

export type AssetMeta =
  | AssetMetaResource
  | AssetMetaPack;

export interface AssetCreateRequest {
  assetPath: string,
  assetName: string,
  assetKind?: AssetKind,
  managerType?: AssetManagerType,
  managerData?: any,
  readOnly?: boolean,
  data?: any,
  callback?: Function,
}

export interface AssetDeleteRequest {
  assetPath: string,
}

export interface AssetRenameRequest {
  assetPath: string,
  newAssetName: string,
}

export interface RelinkResourcesRequest {
  projectPath: string,
  resourcesPaths: string[],
  restartResourcesWithPath?: string,
}

export interface ServerStartRequest {
  projectPath: string,
  enabledResourcesPaths: string[],
}

export interface ServerRefreshResourcesRequest {
  projectPath: string,
  enabledResourcesPaths: string[],
}
