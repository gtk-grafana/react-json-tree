import { ReactNode } from "react";
export { JSONTree } from "./index.tsx";

export type Key = string | number;

export type KeyPath = readonly (string | number)[];

export type GetItemString = (
  nodeType: string,
  data: unknown,
  itemType: ReactNode,
  itemString: string,
  keyPath: KeyPath,
) => ReactNode;

export type LabelRenderer = (
  keyPath: KeyPath,
  nodeType: string,
  expanded: boolean,
  expandable: boolean,
) => ReactNode;

export type ValueRenderer = (
  valueAsString: unknown,
  value: unknown,
  ...keyPath: KeyPath
) => ReactNode;

export type ShouldExpandNodeInitially = (
  keyPath: KeyPath,
  data: unknown,
  level: number,
) => boolean;

export type PostprocessValue = (value: unknown) => unknown;

export type IsCustomNode = (value: unknown) => boolean;

export type SortObjectKeys = ((a: unknown, b: unknown) => number) | boolean;

export type CircularCache = unknown[];

export interface CommonExternalProps {
  keyPath: KeyPath;
  labelRenderer: LabelRenderer;
  valueRenderer: ValueRenderer;
  shouldExpandNodeInitially: ShouldExpandNodeInitially;
  hideRoot: boolean;
  getItemString: GetItemString;
  postprocessValue: PostprocessValue;
  isCustomNode: IsCustomNode;
  collectionLimit: number;
  sortObjectKeys: SortObjectKeys;
}

export interface CommonInternalProps extends CommonExternalProps {
  circularCache?: CircularCache;
  level?: number;
  isCircular?: boolean;
}
