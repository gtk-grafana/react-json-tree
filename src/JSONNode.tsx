import objType from "./objType.js";
import JSONObjectNode from "./JSONObjectNode.js";
import JSONArrayNode from "./JSONArrayNode.js";
import JSONIterableNode from "./JSONIterableNode.js";
import JSONValueNode from "./JSONValueNode.js";
import type { CommonInternalProps } from "./types.js";

interface Props extends CommonInternalProps {
  value: unknown;
}

export default function JSONNode({
  getItemString,
  keyPath,
  labelRenderer,
  value,
  valueRenderer,
  isCustomNode,
  valueWrap,

  scrollToPath,
  ...rest
}: Props) {
  const nodeType = isCustomNode(value) ? "Custom" : objType(value);
  const key = keyPath[0];

  const simpleNodeProps = {
    keyPath,
    labelRenderer,
    nodeType,
    value,
    valueRenderer,
    scrollToPath,
  };

  const nestedNodeProps = {
    ...rest,
    ...simpleNodeProps,
    getItemString,
    data: value,
    isCustomNode,
    valueWrap,
  };

  switch (nodeType) {
    case "Object":
    case "Error":
    case "WeakMap":
    case "WeakSet":
      return <JSONObjectNode key={key} {...nestedNodeProps} />;
    case "Array":
      return <JSONArrayNode key={key} {...nestedNodeProps} />;
    case "Iterable":
    case "Map":
    case "Set":
      return <JSONIterableNode key={key} {...nestedNodeProps} />;
    case "String":
      return (
        <JSONValueNode
          {...simpleNodeProps}
          key={key}
          valueGetter={(raw: string) => `${valueWrap}${raw}${valueWrap}`}
        />
      );
    case "Number":
      return <JSONValueNode key={key} {...simpleNodeProps} />;
    case "Boolean":
      return (
        <JSONValueNode
          key={key}
          {...simpleNodeProps}
          valueGetter={(raw) => (raw ? "true" : "false")}
        />
      );
    case "Date":
      return (
        <JSONValueNode
          key={key}
          {...simpleNodeProps}
          valueGetter={(raw) => raw.toISOString()}
        />
      );
    case "Null":
      return (
        <JSONValueNode
          key={key}
          {...simpleNodeProps}
          valueGetter={() => "null"}
        />
      );
    case "Undefined":
      return (
        <JSONValueNode
          key={key}
          {...simpleNodeProps}
          valueGetter={() => "undefined"}
        />
      );
    case "Function":
    case "Symbol":
      return (
        <JSONValueNode
          key={key}
          {...simpleNodeProps}
          valueGetter={(raw) => raw.toString()}
        />
      );
    case "Custom":
      return <JSONValueNode key={key} {...simpleNodeProps} />;
    default:
      return (
        <JSONValueNode
          key={key}
          {...simpleNodeProps}
          valueGetter={() => `<${nodeType}>`}
        />
      );
  }
}
