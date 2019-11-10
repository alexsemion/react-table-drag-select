import React from "react";
import equal from "deep-is";
import clone from "clone";
import PropTypes from "prop-types";

console.log("hfhhhf");

/**
 * Minimum amount of px for selection to start
 *
 * @type {number}
 */
const SELECTION_START_AT = 20;

export default class TableDragSelect extends React.Component {
  propTypes = {
    value: props => {
      const error = new Error(
        "Invalid prop `value` supplied to `TableDragSelect`. Validation failed."
      );
      if (!Array.isArray(props.value)) {
        return error;
      }
      if (props.value.length === 0) {
        return;
      }
      const columnCount = props.value[0].length;
      for (const row of props.value) {
        if (!Array.isArray(row) || row.length !== columnCount) {
          return error;
        }
        for (const cell of row) {
          if (typeof cell !== "boolean") {
            return error;
          }
        }
      }
    },
    onChange: PropTypes.func,
    children: props => {
      if (TableDragSelect.propTypes.value(props)) {
        return; // Let error be handled elsewhere
      }
      const error = new Error(
        "Invalid prop `children` supplied to `TableDragSelect`. Validation failed."
      );
      const trs = React.Children.toArray(props.children);
      const rowCount = props.value.length;
      const columnCount = props.value.length === 0 ? 0 : props.value[0].length;
      if (trs.length !== rowCount) {
        return error;
      }
      for (const tr of trs) {
        const tds = React.Children.toArray(tr.props.children);
        if (tr.type !== "tr" || tds.length !== columnCount) {
          return error;
        }
        for (const td of tds) {
          if (td.type !== "td") {
            return error;
          }
        }
      }
    },
    classNameCellBeingSelected:PropTypes.string,
    classNameCellSelected:PropTypes.string
  };

  static defaultProps = {
    value: [],
    onChange: () => {},
    classNameCellBeingSelected:'cell-being-selected',
    classNameCellSelected:'cell-selected'
  };

  state = {
    selectionStarted: false,
    startRow: null,
    startColumn: null,
    endRow: null,
    endColumn: null,
    addMode: null
  };

  touchStartCoordinates = null;

  componentDidMount = () => {
    window.addEventListener("mouseup", this.handleTouchEndWindow);
    window.addEventListener("touchend", this.handleTouchEndWindow);
  };

  componentWillUnmount = () => {
    window.removeEventListener("mouseup", this.handleTouchEndWindow);
    window.removeEventListener("touchend", this.handleTouchEndWindow);
  };

  render = () => {
    const { value, onChange, ...props } = this.props;
    return (
      <table className="table-drag-select" {...props}>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  };

  renderRows = () =>{
    const {classNameCellBeingSelected, classNameCellSelected}=this.props;

    return React.Children.map(this.props.children, (tr, i) => {
      return (
        <tr key={i} {...tr.props}>
          {React.Children.map(tr.props.children, (cell, j) => (
            <Cell
              classNameBeingSelected={classNameCellBeingSelected}
              classNameSelected={classNameCellSelected}
              key={j}
              onTouchStart={this.handleTouchStartCell}
              onTouchMove={this.handleTouchMoveCell}
              selected={this.props.value[i][j]}
              beingSelected={this.isCellBeingSelected(i, j)}
              {...cell.props}
            >
              {cell.props.children}
            </Cell>
          ))}
        </tr>
      );
    });
  }

  handleTouchStartCell = e => {
    const isLeftClick = e.button === 0;
    const isTouch = e.type !== "mousedown";

    this.touchStartCoordinates = [e.clientX, e.clientY];
  };

  handleTouchMoveCell = e => {
    if (this.touchStartCoordinates === null) {
      return;
    }

    const { selectionStarted } = this.state;
    const [touchX, touchY] = this.touchStartCoordinates;

    const startSelection =
      Math.abs(e.clientX - touchX) >= SELECTION_START_AT ||
      Math.abs(e.clientY - touchY) >= SELECTION_START_AT;

    const { row, column } = eventToCellLocation(e);

    if (!selectionStarted && startSelection) {
      this.setState({
        selectionStarted: true,
        startRow: row,
        startColumn: column,
        endRow: row,
        endColumn: column,
        addMode: !this.props.value[row][column]
      });
    }

    if (selectionStarted) {
      e.preventDefault();

      if (!startSelection) {
        this.setState({ selectionStarted: false });
      }

      this.setState({
        endRow: row,
        endColumn: column
      });
    }
  };

  handleTouchEndWindow = e => {
    const isLeftClick = e.button === 0;
    const isTouch = e.type !== "mousedown";

    if (this.state.selectionStarted && (isLeftClick || isTouch)) {
      const value = clone(this.props.value);
      const minRow = Math.min(this.state.startRow, this.state.endRow);
      const maxRow = Math.max(this.state.startRow, this.state.endRow);
      for (let row = minRow; row <= maxRow; row++) {
        const minColumn = Math.min(
          this.state.startColumn,
          this.state.endColumn
        );
        const maxColumn = Math.max(
          this.state.startColumn,
          this.state.endColumn
        );
        for (let column = minColumn; column <= maxColumn; column++) {
          value[row][column] = this.state.addMode;
        }
      }
      this.setState({ selectionStarted: false });
      this.props.onChange(value);
    }

    this.touchStartCoordinates = null;
  };

  isCellBeingSelected = (row, column) => {
    const minRow = Math.min(this.state.startRow, this.state.endRow);
    const maxRow = Math.max(this.state.startRow, this.state.endRow);
    const minColumn = Math.min(this.state.startColumn, this.state.endColumn);
    const maxColumn = Math.max(this.state.startColumn, this.state.endColumn);
    return (
      this.state.selectionStarted &&
      (row >= minRow &&
        row <= maxRow &&
        column >= minColumn &&
        column <= maxColumn)
    );
  };
}

class Cell extends React.Component {
  // This optimization gave a 10% performance boost while drag-selecting
  // cells
  shouldComponentUpdate = nextProps =>
    this.props.beingSelected !== nextProps.beingSelected ||
    this.props.selected !== nextProps.selected;

  componentDidMount = () => {
    // We need to call addEventListener ourselves so that we can pass
    // {passive: false}
    this.td.addEventListener("touchstart", this.handleTouchStart, {
      passive: false
    });
    this.td.addEventListener("touchmove", this.handleTouchMove, {
      passive: false
    });
  };

  componentWillUnmount = () => {
    this.td.removeEventListener("touchstart", this.handleTouchStart);
    this.td.removeEventListener("touchmove", this.handleTouchMove);
  };

  render = () => {
    let {
      className,
      classNameBeingSelected,
      classNameSelected,
      disabled,
      beingSelected,
      selected,
      onTouchStart,
      onTouchMove,
      ...props
    } = this.props;

    if (disabled) {
      className += " cell-disabled";
    } else {
      className += " cell-enabled";
      if (selected) {
        className += ` ${classNameSelected}`;
      }
      if (beingSelected) {
        className += ` ${classNameBeingSelected}`;
      }
    }
    return (
      <td
        ref={td => (this.td = td)}
        className={className}
        onMouseDown={this.handleTouchStart}
        onMouseMove={this.handleTouchMove}
        {...props}
      >
        {this.props.children || <span>&nbsp;</span>}
      </td>
    );
  };

  handleTouchStart = e => {
    if (!this.props.disabled) {
      this.props.onTouchStart(e);
    }
  };

  handleTouchMove = e => {
    if (!this.props.disabled) {
      this.props.onTouchMove(e);
    }
  };
}

// Takes a mouse or touch event and returns the corresponding row and cell.
// Example:
//
// eventToCellLocation(event);
// {row: 2, column: 3}
const eventToCellLocation = e => {
  let target;
  // For touchmove and touchend events, e.target and e.touches[n].target are
  // wrong, so we have to rely on elementFromPoint(). For mouse clicks, we have
  // to use e.target.
  if (e.touches) {
    const touch = e.touches[0];
    target = document.elementFromPoint(touch.clientX, touch.clientY);
  } else {
    target = e.target;
    while (target.tagName !== "TD") {
      target = target.parentNode;
    }
  }
  return {
    row: target.parentNode.rowIndex,
    column: target.cellIndex
  };
};
