"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _deepIs = require("deep-is");

var _deepIs2 = _interopRequireDefault(_deepIs);

var _clone = require("clone");

var _clone2 = _interopRequireDefault(_clone);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Minimum amount of px for selection to start
 *
 * @type {number}
 */
var SELECTION_START_AT = 20;

var TableDragSelect = function (_React$Component) {
  _inherits(TableDragSelect, _React$Component);

  function TableDragSelect() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TableDragSelect);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TableDragSelect.__proto__ || Object.getPrototypeOf(TableDragSelect)).call.apply(_ref, [this].concat(args))), _this), _this.propTypes = {
      value: function value(props) {
        var error = new Error("Invalid prop `value` supplied to `TableDragSelect`. Validation failed.");
        if (!Array.isArray(props.value)) {
          return error;
        }
        if (props.value.length === 0) {
          return;
        }
        var columnCount = props.value[0].length;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = props.value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var row = _step.value;

            if (!Array.isArray(row) || row.length !== columnCount) {
              return error;
            }
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = row[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var cell = _step2.value;

                if (typeof cell !== "boolean") {
                  return error;
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      },
      onChange: _propTypes2.default.func,
      children: function children(props) {
        if (TableDragSelect.propTypes.value(props)) {
          return; // Let error be handled elsewhere
        }
        var error = new Error("Invalid prop `children` supplied to `TableDragSelect`. Validation failed.");
        var trs = _react2.default.Children.toArray(props.children);
        var rowCount = props.value.length;
        var columnCount = props.value.length === 0 ? 0 : props.value[0].length;
        if (trs.length !== rowCount) {
          return error;
        }
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = trs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var tr = _step3.value;

            var tds = _react2.default.Children.toArray(tr.props.children);
            if (tr.type !== "tr" || tds.length !== columnCount) {
              return error;
            }
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = tds[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var td = _step4.value;

                if (td.type !== "td") {
                  return error;
                }
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      },
      classNameCellBeingSelected: _propTypes2.default.string,
      classNameCellSelected: _propTypes2.default.string
    }, _this.state = {
      selectionStarted: false,
      startRow: null,
      startColumn: null,
      endRow: null,
      endColumn: null,
      addMode: null
    }, _this.touchStartCoordinates = null, _this.componentDidMount = function () {
      window.addEventListener("mouseup", _this.handleTouchEndWindow);
      window.addEventListener("touchend", _this.handleTouchEndWindow);
    }, _this.componentWillUnmount = function () {
      window.removeEventListener("mouseup", _this.handleTouchEndWindow);
      window.removeEventListener("touchend", _this.handleTouchEndWindow);
    }, _this.render = function () {
      var _this$props = _this.props,
          value = _this$props.value,
          onChange = _this$props.onChange,
          props = _objectWithoutProperties(_this$props, ["value", "onChange"]);

      return _react2.default.createElement(
        "table",
        _extends({ className: "table-drag-select" }, props),
        _react2.default.createElement(
          "tbody",
          null,
          _this.renderRows()
        )
      );
    }, _this.renderRows = function () {
      var _this$props2 = _this.props,
          classNameCellBeingSelected = _this$props2.classNameCellBeingSelected,
          classNameCellSelected = _this$props2.classNameCellSelected;


      return _react2.default.Children.map(_this.props.children, function (tr, i) {
        return _react2.default.createElement(
          "tr",
          _extends({ key: i }, tr.props),
          _react2.default.Children.map(tr.props.children, function (cell, j) {
            return _react2.default.createElement(
              Cell,
              _extends({
                classNameBeingSelected: classNameCellBeingSelected,
                classNameSelected: classNameCellSelected,
                key: j,
                onTouchStart: _this.handleTouchStartCell,
                onTouchMove: _this.handleTouchMoveCell,
                selected: _this.props.value[i][j],
                beingSelected: _this.isCellBeingSelected(i, j)
              }, cell.props),
              cell.props.children
            );
          })
        );
      });
    }, _this.handleTouchStartCell = function (e) {
      var isLeftClick = e.button === 0;
      var isTouch = e.type !== "mousedown";

      _this.touchStartCoordinates = [e.clientX, e.clientY];
    }, _this.handleTouchMoveCell = function (e) {
      if (_this.touchStartCoordinates === null) {
        return;
      }

      var selectionStarted = _this.state.selectionStarted;

      var _this$touchStartCoord = _slicedToArray(_this.touchStartCoordinates, 2),
          touchX = _this$touchStartCoord[0],
          touchY = _this$touchStartCoord[1];

      var startSelection = Math.abs(e.clientX - touchX) >= SELECTION_START_AT || Math.abs(e.clientY - touchY) >= SELECTION_START_AT;

      var _eventToCellLocation = eventToCellLocation(e),
          row = _eventToCellLocation.row,
          column = _eventToCellLocation.column;

      if (!selectionStarted && startSelection) {
        _this.setState({
          selectionStarted: true,
          startRow: row,
          startColumn: column,
          endRow: row,
          endColumn: column,
          addMode: !_this.props.value[row][column]
        });
      }

      if (selectionStarted) {
        e.preventDefault();

        if (!startSelection) {
          _this.setState({ selectionStarted: false });
        }

        _this.setState({
          endRow: row,
          endColumn: column
        });
      }
    }, _this.handleTouchEndWindow = function (e) {
      var isLeftClick = e.button === 0;
      var isTouch = e.type !== "mousedown";

      if (_this.state.selectionStarted && (isLeftClick || isTouch)) {
        var value = (0, _clone2.default)(_this.props.value);
        var minRow = Math.min(_this.state.startRow, _this.state.endRow);
        var maxRow = Math.max(_this.state.startRow, _this.state.endRow);
        for (var row = minRow; row <= maxRow; row++) {
          var minColumn = Math.min(_this.state.startColumn, _this.state.endColumn);
          var maxColumn = Math.max(_this.state.startColumn, _this.state.endColumn);
          for (var column = minColumn; column <= maxColumn; column++) {
            value[row][column] = _this.state.addMode;
          }
        }
        _this.setState({ selectionStarted: false });
        _this.props.onChange(value);
      }

      _this.touchStartCoordinates = null;
    }, _this.isCellBeingSelected = function (row, column) {
      var minRow = Math.min(_this.state.startRow, _this.state.endRow);
      var maxRow = Math.max(_this.state.startRow, _this.state.endRow);
      var minColumn = Math.min(_this.state.startColumn, _this.state.endColumn);
      var maxColumn = Math.max(_this.state.startColumn, _this.state.endColumn);
      return _this.state.selectionStarted && row >= minRow && row <= maxRow && column >= minColumn && column <= maxColumn;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return TableDragSelect;
}(_react2.default.Component);

TableDragSelect.defaultProps = {
  value: [],
  onChange: function onChange() {},
  classNameCellBeingSelected: 'cell-being-selected',
  classNameCellSelected: 'cell-selected'
};
exports.default = TableDragSelect;

var Cell = function (_React$Component2) {
  _inherits(Cell, _React$Component2);

  function Cell() {
    var _ref2;

    var _temp2, _this2, _ret2;

    _classCallCheck(this, Cell);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_ref2 = Cell.__proto__ || Object.getPrototypeOf(Cell)).call.apply(_ref2, [this].concat(args))), _this2), _this2.shouldComponentUpdate = function (nextProps) {
      return _this2.props.beingSelected !== nextProps.beingSelected || _this2.props.selected !== nextProps.selected;
    }, _this2.componentDidMount = function () {
      // We need to call addEventListener ourselves so that we can pass
      // {passive: false}
      _this2.td.addEventListener("touchstart", _this2.handleTouchStart, {
        passive: false
      });
      _this2.td.addEventListener("touchmove", _this2.handleTouchMove, {
        passive: false
      });
    }, _this2.componentWillUnmount = function () {
      _this2.td.removeEventListener("touchstart", _this2.handleTouchStart);
      _this2.td.removeEventListener("touchmove", _this2.handleTouchMove);
    }, _this2.render = function () {
      var _this2$props = _this2.props,
          className = _this2$props.className,
          classNameBeingSelected = _this2$props.classNameBeingSelected,
          classNameSelected = _this2$props.classNameSelected,
          disabled = _this2$props.disabled,
          beingSelected = _this2$props.beingSelected,
          selected = _this2$props.selected,
          onTouchStart = _this2$props.onTouchStart,
          onTouchMove = _this2$props.onTouchMove,
          props = _objectWithoutProperties(_this2$props, ["className", "classNameBeingSelected", "classNameSelected", "disabled", "beingSelected", "selected", "onTouchStart", "onTouchMove"]);

      if (disabled) {
        className += " cell-disabled";
      } else {
        className += " cell-enabled";
        if (selected) {
          className += " " + classNameSelected;
        }
        if (beingSelected) {
          className += " " + classNameBeingSelected;
        }
      }
      return _react2.default.createElement(
        "td",
        _extends({
          ref: function ref(td) {
            return _this2.td = td;
          },
          className: className,
          onMouseDown: _this2.handleTouchStart,
          onMouseMove: _this2.handleTouchMove
        }, props),
        _this2.props.children || _react2.default.createElement(
          "span",
          null,
          "\xA0"
        )
      );
    }, _this2.handleTouchStart = function (e) {
      if (!_this2.props.disabled) {
        _this2.props.onTouchStart(e);
      }
    }, _this2.handleTouchMove = function (e) {
      if (!_this2.props.disabled) {
        _this2.props.onTouchMove(e);
      }
    }, _temp2), _possibleConstructorReturn(_this2, _ret2);
  }
  // This optimization gave a 10% performance boost while drag-selecting
  // cells


  return Cell;
}(_react2.default.Component);

// Takes a mouse or touch event and returns the corresponding row and cell.
// Example:
//
// eventToCellLocation(event);
// {row: 2, column: 3}


var eventToCellLocation = function eventToCellLocation(e) {
  var target = void 0;
  // For touchmove and touchend events, e.target and e.touches[n].target are
  // wrong, so we have to rely on elementFromPoint(). For mouse clicks, we have
  // to use e.target.
  if (e.touches) {
    var touch = e.touches[0];
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
//# sourceMappingURL=index.js.map