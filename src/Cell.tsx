import React, { ReactElement } from "react";
import { CELL_TYPE } from "./App";

interface Props {
  cellType: CELL_TYPE;
  color: string;
  handleLeftClick: Function;
}

export default function Cell(props: Props): ReactElement {
  const { cellType, color } = props;

  const renderIcon = () => {
    if (cellType === CELL_TYPE.EMPTY) return <></>;
    if (cellType === CELL_TYPE.START)
      return <i className="fas fa-chevron-right"></i>;
    if (cellType === CELL_TYPE.END) return <i className="fas fa-bullseye"></i>;
    if (cellType === CELL_TYPE.WALL) return <i className="fas fa-tree"></i>;
  };

  return (
    <div onClick={() => props.handleLeftClick()} style={{ backgroundColor: color !== "" ? color : "#343a40" }}>
      <div className={color !== "" ? "grayIcon" : ""}>{renderIcon()}</div>
    </div>
  );
}
