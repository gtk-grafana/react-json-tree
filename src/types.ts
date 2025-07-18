import React from "react";

export type Key = string | number;

export interface JSONTreeProps extends Partial<CommonExternalProps> {
  data: unknown;
}

export type JSONTree = React.Component<JSONTreeProps>;
export type KeyPath = readonly (string | number)[];
// This only works for top level arrays and nested arrays that are already under the collection limit
// Only arrays are supported as we do not iterate through object keys until expanded if they are bigger then the collection limit
// If the array index is within a nested object that is over the collection limit this won't work either.
export type ScrollToPath = [number, ...KeyPath];

export type GetItemString = (
  nodeType: string,
  data: unknown,
  itemType: React.ReactNode,
  itemString: string,
  keyPath: KeyPath,
) => React.ReactNode;

export type LabelRenderer = (
  keyPath: KeyPath,
  nodeType: string,
  expanded: boolean,
  expandable: boolean,
) => React.ReactNode;

export type ValueRenderer = (
  valueAsString: unknown,
  value: unknown,
  ...keyPath: KeyPath
) => React.ReactNode;

export type ShouldExpandNodeInitially = (
  keyPath: KeyPath,
  data: unknown,
  level: number,
) => boolean;

export type ShouldExpandNode = (
  keyPath: KeyPath,
  data: unknown,
  level: number,
) => boolean | undefined;

export type PostprocessValue = (value: unknown) => unknown;

export type IsCustomNode = (value: unknown) => boolean;

export type SortObjectKeys = ((a: unknown, b: unknown) => number) | boolean;

export type CircularCache = unknown[];

export type OnExpandEvent =
  | React.MouseEvent<HTMLDivElement>
  | React.KeyboardEvent<HTMLDivElement>
  | React.MouseEvent<HTMLSpanElement>;

export interface CommonExternalProps {
  keyPath: KeyPath;
  labelRenderer: LabelRenderer;
  valueRenderer: ValueRenderer;
  // Sets expanded state on initial render, will not update expanded state on subsequent renders to prevent changing nodes user has interacted with already
  shouldExpandNodeInitially: ShouldExpandNodeInitially;
  hideRoot: boolean;
  hideRootExpand: boolean;
  getItemString: GetItemString;
  postprocessValue: PostprocessValue;
  isCustomNode: IsCustomNode;
  collectionLimit: number;
  sortObjectKeys: SortObjectKeys;
  valueWrap: string;
  scrollToPath?: ScrollToPath;
  onExpand?: (event: OnExpandEvent, keyPath: KeyPath, expand: boolean) => void;
}

export interface CommonInternalProps extends CommonExternalProps {
  circularCache?: CircularCache;
  level?: number;
  isCircular?: boolean;
}
