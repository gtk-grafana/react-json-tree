import JSONNestedNode from "./JSONNestedNode.js";
import type { CommonInternalProps } from "./types.js";

// Returns the "n Items" string for this node,
// generating and caching it if it hasn't been created yet.
function createItemString(data: any, limit: number) {
  let count = 0;
  let hasMore = false;
  if (Number.isSafeInteger(data.size)) {
    count = data.size;
  } else {
    for (const entry of data) {
      if (limit && count + 1 > limit) {
        hasMore = true;
        break;
      }
      count += 1;
    }
  }
  return `${hasMore ? ">" : ""}${count} ${count !== 1 ? "entries" : "entry"}`;
}

interface Props extends CommonInternalProps {
  data: unknown;
  nodeType: string;
}

// Configures <JSONNestedNode> to render an iterable
export default function JSONIterableNode(props: Props) {
  return (
    <JSONNestedNode
      {...props}
      nodeType="Iterable"
      nodeTypeIndicator="()"
      createItemString={createItemString}
      expandable
    />
  );
}
