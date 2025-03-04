import React, { useCallback, useState } from 'react';
import JSONArrow from './JSONArrow';
import type { CircularCache, CommonInternalProps } from './types';

interface Props extends CommonInternalProps {
  data: unknown;
  nodeType: string;
  from: number;
  to: number;
  renderChildNodes: (props: Props, from: number, to: number) => React.ReactNode;
  circularCache: CircularCache;
  level: number;
}

export default function ItemRange(props: Props) {
  const { from, to, renderChildNodes, nodeType } = props;

  const [expanded, setExpanded] = useState<boolean>(false);
  const handleClick = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  return expanded ? (
    <div className={`itemRange itemRange--${expanded}`}>
      {renderChildNodes(props, from, to)}
    </div>
  ) : (
    <div className={`itemRange itemRange--${expanded}`} onClick={handleClick}>
      <JSONArrow
        nodeType={nodeType}
        expanded={false}
        onClick={handleClick}
        arrowStyle="double"
      />
      {`${from} ... ${to}`}
    </div>
  );
}
