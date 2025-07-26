import React from "react";
import { Map } from "immutable";
import {
  JSONTree,
  KeyPath,
  areKeyPathsEqual,
  doesNodeContainNode,
  ScrollToPath,
} from "react-json-tree";

const getItemString = (type: string) => (
  <span>
    {" // "}
    {type}
  </span>
);

const longString =
  "Loremipsumdolorsitamet,consecteturadipiscingelit.Namtempusipsumutfelisdignissimauctor.Maecenasodiolectus,finibusegetultricesvel,aliquamutelit.Loremipsumdolorsitamet,consecteturadipiscingelit.Namtempusipsumutfelisdignissimauctor.Maecenasodiolectus,finibusegetultricesvel,aliquamutelit.Loremipsumdolorsitamet,consecteturadipiscingelit.Namtempusipsumutfelisdignissimauctor.Maecenasodiolectus,finibusegetultricesvel,aliquamutelit.";

class Custom {
  value: unknown;

  constructor(value: unknown) {
    this.value = value;
  }

  get [Symbol.toStringTag]() {
    return "Custom";
  }
}

const data: Record<string, any> = {
  array: [1, 2, 3],
  emptyArray: [],
  bool: true,
  date: new Date(),
  error: new Error(longString),
  arrayOfObjects: [
    Array.from({ length: 1000 }).map((e) => ({
      foo: {
        bar: "baz",
        nested: {
          bar: "baz2",
          moreNested: {
            bar: "baz3",
            evenMoreNested: {
              veryNested: {
                insanelyNested: {
                  ridiculouslyDeepValue: "Hello",
                },
              },
            },
          },
        },
      },
    })),
  ],
  object: {
    foo: {
      bar: "baz",
      nested: {
        moreNested: {
          evenMoreNested: {
            veryNested: {
              insanelyNested: {
                ridiculouslyDeepValue: "Hello",
              },
            },
          },
        },
      },
    },
    baz: undefined,
    func: function User() {
      // noop
    },
  },
  emptyObject: {},
  symbol: Symbol("value"),

  immutable: Map<any, any>([
    ["key", "value"],
    [{ objectKey: "value" }, { objectKey: "value" }],
  ]),
  map: new window.Map<any, any>([
    ["key", "value"],
    [0, "value"],
    [{ objectKey: "value" }, { objectKey: "value" }],
  ]),
  weakMap: new window.WeakMap([
    [{ objectKey: "value" }, { objectKey: "value" }],
  ]),
  set: new window.Set(["value", 0, { objectKey: "value" }]),
  weakSet: new window.WeakSet([
    { objectKey: "value1" },
    { objectKey: "value2" },
  ]),
  hugeArray: {
    array: Array.from({ length: 10000 }).map((_, i) => `item #${i}`),
  },
  hugeObject: Object.create(
    Array.from({ length: 10000 }).map((_, i) => `item #${i}`),
  ),
  customProfile: {
    avatar: new Custom("placehold.it/50x50"),
    name: new Custom("Name"),
  },
  longString,
};

// Should not throw error
const key: KeyPath = [];
const hugeArrayKeyPath: ScrollToPath = [101, "array", "hugeArray", "root"];

const App = () => (
  <div style={{ background: "#fff" }}>
    <h3>Basic Example</h3>
    <div style={{ background: "#222" }}>
      <JSONTree data={data} />
    </div>
    <br />

    <h3>Scroll to on render example</h3>
    <div
      style={{
        background: "#222",
        height: "800px",
        overflow: "auto",
        scrollBehavior: "smooth",
      }}
    >
      <JSONTree
        data={data}
        shouldExpandNodeInitially={(keyPath: KeyPath) => {
            // Caller needs to ensure that parent node of scrollToPath is expanded for scrollTo to work on initial render, otherwise it will scroll to when the parent node/collection is expanded
            return !!areKeyPathsEqual(
                keyPath,
                hugeArrayKeyPath.slice(keyPath.length * -1),
            );
        }}
        scrollToPath={hugeArrayKeyPath}
      />
    </div>
    <br />

    <h3>Scroll to on open example</h3>
    <div style={{ background: "#222" }}>
      <JSONTree data={data} scrollToPath={hugeArrayKeyPath} />
    </div>
    <br />

    <h3>Hide root node</h3>
    <div style={{ background: "#222" }}>
      <JSONTree hideRoot={true} data={data} />
    </div>
    <br />

    <h3>Force root node open</h3>
    <div style={{ background: "#222" }}>
      <JSONTree hideRootExpand={true} data={data} />
    </div>
    <br />

    <h3>No quotations around string values</h3>
    <div style={{ background: "#222" }}>
      <JSONTree valueWrap={""} data={data} />
    </div>
    <br />

    <h3>Theming Example</h3>
    <p>
      Styles are managed with css variables, override the default values to
      customize.
    </p>
    <div
      style={
        {
          "--json-tree-label-color": "rgb(12, 127, 149)",
          "--json-tree-key-label-color": "rgb(71, 131, 0)",
          "--json-tree-label-value-color": "rgb(255, 48, 124)",
          "--json-tree-arrow-color": "rgb(12, 127, 149)",
          "--json-tree-value-text-wrap": "nowrap",
        } as React.CSSProperties
      }
    >
      <JSONTree data={data} />
    </div>

    <h3>Theming Example - relative position arrows</h3>
    <p>
      Styles are managed with css variables, override the default values to
      customize.
    </p>
    <div
      style={
        {
          "--json-tree-label-color": "rgb(12, 127, 149)",
          "--json-tree-key-label-color": "rgb(71, 131, 0)",
          "--json-tree-label-value-color": "rgb(255, 48, 124)",
          "--json-tree-arrow-color": "rgb(12, 127, 149)",
          "--json-tree-arrow-position": "relative",
          "--json-tree-ul-root-padding": "0",
          "--json-tree-arrow-left-offset": "0",
          "--json-tree-arrow-right-margin": "0.5em",
        } as React.CSSProperties
      }
    >
      <JSONTree data={data} />
    </div>

    <h3>Style Customization</h3>
    <ul>
      <li>
        Label changes between uppercase/lowercase based on the expanded state.
      </li>
      <li>Array keys are styled based on their parity.</li>
      <li>
        The labels of objects, arrays, and iterables are customized as &quot;//
        type&quot;.
      </li>
      <li>See code for details.</li>
    </ul>
    <div>
      <JSONTree data={data} getItemString={getItemString} />
    </div>
    <h3>More Fine Grained Rendering</h3>
    <p>
      Pass <code>labelRenderer</code> or <code>valueRenderer</code>.
    </p>
    <div>
      <JSONTree
        data={data}
        labelRenderer={([raw]) => <span>(({raw})):</span>}
        valueRenderer={(raw) => (
          <em>
            <span role="img" aria-label="mellow">
              😐
            </span>{" "}
            {raw as string}{" "}
            <span role="img" aria-label="mellow">
              😐
            </span>
          </em>
        )}
      />
    </div>
    <p>
      Sort object keys with <code>sortObjectKeys</code> prop.
    </p>
    <div>
      <JSONTree data={data} sortObjectKeys />
    </div>
    <p>Collapsed root node</p>
    <div>
      <JSONTree data={data} shouldExpandNodeInitially={() => false} />
    </div>

    <p>Collapsed top-level nodes</p>
    <div>
      <JSONTree
        collectionLimit={100}
        data={Array.from({ length: 10000 }).map((_, i) => ({
          name: `item #${i}`,
          value: i,
        }))}
      />
    </div>

    <h3>Shift + click to toggle visualizing all child nodes</h3>
    <div style={{ background: "#222" }}>
      <OnExpandExample />
    </div>
    <br />
  </div>
);

function OnExpandExample() {
  const [keyPathsToExpand, setKeyPathsToExpand] = React.useState<KeyPath[]>([]);
  return (
    <div>
      <div style={{ color: "white" }}>
        KeyPaths that will be expanded: {JSON.stringify(keyPathsToExpand)}
      </div>

      <JSONTree
        shouldExpandNodeInitially={(keyPath, data, level) => {
          for (let i = 0; i < keyPathsToExpand.length; i++) {
            if (doesNodeContainNode(keyPathsToExpand[i], keyPath)) {
              return true;
            }
          }

          return level < 1;
        }}
        data={data}
        onExpand={(e, keyPath, expanded) => {
          if (e.ctrlKey || e.shiftKey || e.altKey) {
            if (expanded) {
              setKeyPathsToExpand([
                ...keyPathsToExpand.filter(
                  (existingKeyPath) =>
                    !areKeyPathsEqual(existingKeyPath, keyPath),
                ),
                keyPath,
              ]);
            } else {
              if (keyPathsToExpand.length) {
                setKeyPathsToExpand(
                  keyPathsToExpand.filter((k) => !areKeyPathsEqual(k, keyPath)),
                );
              }
            }
          }
        }}
      />
    </div>
  );
}

export default App;
