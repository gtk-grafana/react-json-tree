import React, { EventHandler } from "react";
import styles from "./styles/JSONArrow.module.scss";
import { OnExpandEvent } from "./types.ts";

interface Props {
  arrowStyle?: "single" | "double";
  expanded: boolean;
  nodeType: string;
  onNodeExpand: (e: OnExpandEvent) => void;
}

export default function JSONArrow({
  arrowStyle = "single",
  expanded,
  onNodeExpand,
}: Props) {
  return (
    <div
      role={"button"}
      aria-expanded={expanded}
      tabIndex={0}
      onClick={onNodeExpand}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onNodeExpand(event);
        }
      }}
      className={`${styles.arrow} ${expanded ? styles.arrowExpanded : ""}`}
    >
      {/* @todo let implementer define custom arrow object */}
      {"\u25B6"}
      {arrowStyle === "double" && (
        <div className={`${styles.arrowInner}`}>{"\u25B6"}</div>
      )}
    </div>
  );
}
