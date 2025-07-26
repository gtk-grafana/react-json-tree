// ES6 + inline style port of JSONViewer https://bitbucket.org/davevedder/react-json-viewer/
// all credits and original code to the author
// Dave Vedder <veddermatic@gmail.com> http://www.eskimospy.com/
// port by Daniele Zannotti http://www.github.com/dzannotti <dzannotti@me.com>
import JSONNode from "./JSONNode.js";
import type {
  GetItemString,
  IsCustomNode,
  JSONTreeProps,
  LabelRenderer,
  ShouldExpandNodeInitially,
  KeyPath,
} from "./types.js";

import styles from "./styles/tree.module.scss";

const identity = (value: any) => value;
const expandRootNode: ShouldExpandNodeInitially = (keyPath, data, level) =>
  level === 0;
const defaultItemString: GetItemString = (
  type,
  data,
  itemType,
  itemString,
  keyPath,
) => (
  <span className={styles.defaultItemString}>
    {itemType} {itemString}
  </span>
);
const defaultLabelRenderer: LabelRenderer = (
  [label],
  nodeType,
  expanded,
  expandable,
) => (
  <span
    className={`${styles.defaultLabelWrap} ${expandable ? styles.defaultLabelWrapExpandable : ""}`}
  >
    {label}:
  </span>
);
const noCustomNode: IsCustomNode = () => false;

export function JSONTree({
  data: value,
  keyPath = ["root"],
  labelRenderer = defaultLabelRenderer,
  valueRenderer = identity,
  shouldExpandNodeInitially = expandRootNode,
  hideRoot = false,
  hideRootExpand = false,
  getItemString = defaultItemString,
  postprocessValue = identity,
  isCustomNode = noCustomNode,
  collectionLimit = 50,
  sortObjectKeys = false,
  scrollToPath,
  valueWrap = '"',
  onExpand = undefined,
}: JSONTreeProps) {
  return (
    <ul
      role="tree"
      aria-multiselectable
      aria-readonly="true"
      className={styles.tree}
    >
      <JSONNode
        scrollToPath={scrollToPath}
        hideRootExpand={hideRootExpand}
        keyPath={hideRoot ? [] : keyPath}
        value={postprocessValue(value)}
        isCustomNode={isCustomNode}
        labelRenderer={labelRenderer}
        valueRenderer={valueRenderer}
        shouldExpandNodeInitially={shouldExpandNodeInitially}
        hideRoot={hideRoot}
        getItemString={getItemString}
        postprocessValue={postprocessValue}
        collectionLimit={collectionLimit}
        sortObjectKeys={sortObjectKeys}
        valueWrap={valueWrap}
        onExpand={onExpand}
      />
    </ul>
  );
}

export const areKeyPathsEqual = (a: KeyPath, b: KeyPath) => {
  if (!a.length || a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

/**
 * Returns true if source is a child node of target
 * Remember child nodes have a longer key path
 */
export const doesNodeContainNode = (
  parent: KeyPath,
  child: KeyPath,
): boolean => {
  for (let i = parent.length - 1; i >= 0; i--) {
    if (parent[parent.length - i] !== child[child.length - i]) {
      return false;
    }
  }
  return true;
};

export type {
  Key,
  KeyPath,
  GetItemString,
  LabelRenderer,
  ValueRenderer,
  ShouldExpandNodeInitially,
  PostprocessValue,
  IsCustomNode,
  SortObjectKeys,
  CommonExternalProps,
  ScrollToPath,
} from "./types.js";
