import React, { useCallback, useEffect, useState } from "react";
import JSONArrow from "./JSONArrow.js";
import getCollectionEntries from "./getCollectionEntries.js";
import JSONNode from "./JSONNode.js";
import ItemRange from "./ItemRange.js";
import {
  CircularCache,
  CommonInternalProps,
  KeyPath,
  OnExpandEvent,
  ShouldExpandNode,
} from "./types.js";
import styles from "./styles/JSONNestedNode.module.scss";
import { NodeListItem } from "./components/NodeListItem.tsx";

/**
 * Renders nested values (eg. objects, arrays, lists, etc.)
 */

export interface RenderChildNodesProps extends CommonInternalProps {
  data: unknown;
  nodeType: string;
  circularCache: CircularCache;
  level: number;
}

interface Range {
  from: number;
  to: number;
}

interface Entry {
  key: string | number;
  value: unknown;
}

function isRange(rangeOrEntry: Range | Entry): rangeOrEntry is Range {
  return (rangeOrEntry as Range).to !== undefined;
}

function renderChildNodes(
  props: RenderChildNodesProps,
  from?: number,
  to?: number,
) {
  const {
    nodeType,
    data,
    collectionLimit,
    circularCache,
    keyPath,
    postprocessValue,
    sortObjectKeys,
    scrollToPath,
  } = props;
  const childNodes: React.ReactNode[] = [];

  getCollectionEntries(
    nodeType,
    data,
    sortObjectKeys,
    collectionLimit,
    from,
    to,
  ).forEach((entry) => {
    if (isRange(entry)) {
      childNodes.push(
        <ItemRange
          {...props}
          key={`ItemRange--${entry.from}-${entry.to}`}
          from={entry.from}
          to={entry.to}
          renderChildNodes={renderChildNodes}
          scrollToPath={scrollToPath}
        />,
      );
    } else {
      const { key, value } = entry;
      const isCircular = circularCache.includes(value);

      childNodes.push(
        <JSONNode
          {...props}
          {...{ postprocessValue, collectionLimit }}
          key={`Node--${key}`}
          keyPath={[key, ...keyPath]}
          value={postprocessValue(value)}
          circularCache={[...circularCache, value]}
          isCircular={isCircular}
          hideRoot={false}
        />,
      );
    }
  });

  return childNodes;
}

interface Props extends CommonInternalProps {
  data: unknown;
  nodeType: string;
  nodeTypeIndicator: string;
  createItemString: (data: unknown, collectionLimit: number) => string;
  expandable: boolean;
}

export default function JSONNestedNode(props: Props) {
  const {
    circularCache = [],
    collectionLimit,
    createItemString,
    data,
    expandable,
    getItemString,
    hideRoot,
    hideRootExpand,
    isCircular,
    keyPath,
    labelRenderer,
    level = 0,
    nodeType,
    nodeTypeIndicator,
    shouldExpandNodeInitially,
    scrollToPath,
    onExpand,
  } = props;

  const isRoot = keyPath[0] === "root";
  const showExpand = hideRootExpand
    ? expandable && !isRoot && hideRootExpand
    : expandable;
  const isNodeExpandable = expandable && showExpand;

  const [expanded, setExpanded] = useState<boolean>(
    // calculate individual node expansion if necessary
    isCircular ? false : shouldExpandNodeInitially(keyPath, data, level),
  );

  const onNodeExpand = useCallback(
    (e: OnExpandEvent) => {
      if (isNodeExpandable) {
        if (onExpand) {
          onExpand(e, keyPath, !expanded);
        }
        setExpanded(!expanded);
      }
    },
    [isNodeExpandable, expanded],
  );

  const renderedChildren =
    expanded || (hideRoot && level === 0)
      ? renderChildNodes({ ...props, circularCache, level: level + 1 })
      : null;

  const itemType = (
    <span
      className={`${styles.nestedNodeItemType} ${expanded ? styles.nestedNodeItemTypeExpanded : ""}`}
    >
      {nodeTypeIndicator}
    </span>
  );
  const renderedItemString = getItemString(
    nodeType,
    data,
    itemType,
    createItemString(data, collectionLimit),
    keyPath,
  );
  const stylingArgs = [keyPath, nodeType, expanded, isNodeExpandable] as const;

  return hideRoot ? (
    <NodeListItem
      scrollToPath={scrollToPath}
      expandable={isNodeExpandable}
      expanded={expanded}
      nodeType={nodeType}
      keyPath={keyPath}
      className={`${styles.rootNode} ${expanded ? styles.rootNodeExpanded : ""} ${expandable ? styles.rootNodeExpandable : ""}`}
    >
      <ul className={`${styles.rootNodeChildren}`}>{renderedChildren}</ul>
    </NodeListItem>
  ) : (
    <NodeListItem
      scrollToPath={scrollToPath}
      expandable={isNodeExpandable}
      expanded={expanded}
      nodeType={nodeType}
      keyPath={keyPath}
      className={`${styles.nestedNode}  ${expanded ? styles.nestedNodeExpanded : ""} ${isNodeExpandable ? styles.nestedNodeExpandable : ""}`}
    >
      <span className={styles.nestedNodeLabelWrap}>
        {showExpand && (
          <JSONArrow
            nodeType={nodeType}
            expanded={expanded}
            onNodeExpand={onNodeExpand}
          />
        )}
        <span
          data-nodetype={nodeType}
          data-keypath={keyPath[0]}
          className={`${styles.nestedNodeLabel} ${expanded ? styles.nestedNodeLabelExpanded : ""} ${isNodeExpandable ? styles.nestedNodeLabelExpandable : ""}`}
          onClick={onNodeExpand}
        >
          {labelRenderer(...stylingArgs)}
        </span>
        <span className={styles.nestedNodeItemString} onClick={onNodeExpand}>
          {renderedItemString}
        </span>
      </span>
      {renderedChildren && (
        <ul className={styles.nestedNodeChildren}>{renderedChildren}</ul>
      )}
    </NodeListItem>
  );
}
