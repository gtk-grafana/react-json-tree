import React, { useCallback, useState } from "react";
import JSONArrow from "./JSONArrow.js";
import {
  CircularCache,
  CommonInternalProps,
  KeyPath,
  OnExpandEvent,
  ScrollToPath,
} from "./types.js";
import styles from "./styles/itemRange.module.scss";
import { areKeyPathsEqual } from "./index.tsx";

interface Props extends CommonInternalProps {
  data: unknown;
  nodeType: string;
  from: number;
  to: number;
  renderChildNodes: (props: Props, from: number, to: number) => React.ReactNode;
  circularCache: CircularCache;
  level: number;
  scrollToPath?: ScrollToPath;
}

export default function ItemRange(props: Props) {
  const {
    from,
    to,
    renderChildNodes,
    nodeType,
    scrollToPath,
    keyPath,
    onExpand,
  } = props;
  let initialExpanded = false;
  if (scrollToPath) {
    const [index] = scrollToPath;
    if (
      areKeyPathsEqual(scrollToPath.slice(keyPath.length * -1), keyPath) &&
      index > from &&
      index <= to
    ) {
      initialExpanded = true;
    }
  }

  const [expanded, setExpanded] = useState<boolean>(initialExpanded);
  const handleClick = useCallback(
    (e: OnExpandEvent) => {
      setExpanded(!expanded);

      if (onExpand !== undefined) {
        onExpand(e, keyPath, expanded);
      }
    },
    [expanded],
  );

  return expanded ? (
    <div className={`${styles.itemRange}`}>
      {renderChildNodes(props, from, to)}
    </div>
  ) : (
    <div className={`${styles.itemRange}`}>
      <JSONArrow
        nodeType={nodeType}
        expanded={false}
        onNodeExpand={handleClick}
        arrowStyle="double"
      />
      {`${from} ... ${to}`}
    </div>
  );
}
