'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NewDebuggerView = undefined;

var _classnames;

function _load_classnames() {
  return _classnames = _interopRequireDefault(require('classnames'));
}

var _atom = require('atom');

var _reactForAtom = require('react-for-atom');

var _Section;

function _load_Section() {
  return _Section = require('../../nuclide-ui/Section');
}

var _Button;

function _load_Button() {
  return _Button = require('../../nuclide-ui/Button');
}

var _bindObservableAsProps;

function _load_bindObservableAsProps() {
  return _bindObservableAsProps = require('../../nuclide-ui/bindObservableAsProps');
}

var _ResizableFlexContainer;

function _load_ResizableFlexContainer() {
  return _ResizableFlexContainer = require('../../nuclide-ui/ResizableFlexContainer');
}

var _WatchExpressionComponent;

function _load_WatchExpressionComponent() {
  return _WatchExpressionComponent = require('./WatchExpressionComponent');
}

var _ScopesComponent;

function _load_ScopesComponent() {
  return _ScopesComponent = require('./ScopesComponent');
}

var _BreakpointListComponent;

function _load_BreakpointListComponent() {
  return _BreakpointListComponent = require('./BreakpointListComponent');
}

var _DebuggerSteppingComponent;

function _load_DebuggerSteppingComponent() {
  return _DebuggerSteppingComponent = require('./DebuggerSteppingComponent');
}

var _DebuggerCallstackComponent;

function _load_DebuggerCallstackComponent() {
  return _DebuggerCallstackComponent = require('./DebuggerCallstackComponent');
}

var _DebuggerThreadsComponent;

function _load_DebuggerThreadsComponent() {
  return _DebuggerThreadsComponent = require('./DebuggerThreadsComponent');
}

var _DebuggerStore;

function _load_DebuggerStore() {
  return _DebuggerStore = require('./DebuggerStore');
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * 
 */

class NewDebuggerView extends _reactForAtom.React.PureComponent {

  constructor(props) {
    super(props);
    this._watchExpressionComponentWrapped = (0, (_bindObservableAsProps || _load_bindObservableAsProps()).bindObservableAsProps)(props.model.getWatchExpressionListStore().getWatchExpressions().map(watchExpressions => ({ watchExpressions })), (_WatchExpressionComponent || _load_WatchExpressionComponent()).WatchExpressionComponent);
    this._scopesComponentWrapped = (0, (_bindObservableAsProps || _load_bindObservableAsProps()).bindObservableAsProps)(props.model.getScopesStore().getScopes().map(scopes => ({ scopes })), (_ScopesComponent || _load_ScopesComponent()).ScopesComponent);
    this._disposables = new _atom.CompositeDisposable();
    const debuggerStore = props.model.getStore();
    this.state = {
      showThreadsWindow: Boolean(debuggerStore.getSettings().get('SupportThreadsWindow')),
      customThreadColumns: debuggerStore.getSettings().get('CustomThreadColumns') || [],
      mode: debuggerStore.getDebuggerMode()
    };
  }

  componentDidMount() {
    const debuggerStore = this.props.model.getStore();
    this._disposables.add(debuggerStore.onChange(() => {
      this.setState({
        showThreadsWindow: Boolean(debuggerStore.getSettings().get('SupportThreadsWindow')),
        customThreadColumns: debuggerStore.getSettings().get('CustomThreadColumns') || [],
        mode: debuggerStore.getDebuggerMode()
      });
    }));
  }

  componentWillUnmount() {
    this._dispose();
  }

  render() {
    const {
      model
    } = this.props;
    const actions = model.getActions();
    const mode = this.state.mode;
    const WatchExpressionComponentWrapped = this._watchExpressionComponentWrapped;
    const ScopesComponentWrapped = this._scopesComponentWrapped;
    const disabledClass = mode !== (_DebuggerStore || _load_DebuggerStore()).DebuggerMode.RUNNING ? '' : ' nuclide-debugger-container-new-disabled';

    const threadsSection = this.state.showThreadsWindow ? _reactForAtom.React.createElement(
      (_ResizableFlexContainer || _load_ResizableFlexContainer()).ResizableFlexItem,
      { initialFlexScale: 1 },
      _reactForAtom.React.createElement(
        (_Section || _load_Section()).Section,
        { headline: 'Threads',
          className: (0, (_classnames || _load_classnames()).default)('nuclide-debugger-section-header', disabledClass) },
        _reactForAtom.React.createElement(
          'div',
          { className: 'nuclide-debugger-section-content' },
          _reactForAtom.React.createElement((_DebuggerThreadsComponent || _load_DebuggerThreadsComponent()).DebuggerThreadsComponent, {
            bridge: this.props.model.getBridge(),
            threadStore: model.getThreadStore(),
            customThreadColumns: this.state.customThreadColumns
          })
        )
      )
    ) : null;

    const debuggerStoppedNotice = mode !== (_DebuggerStore || _load_DebuggerStore()).DebuggerMode.STOPPED ? null : _reactForAtom.React.createElement(
      'div',
      { className: 'nuclide-debugger-state-notice' },
      _reactForAtom.React.createElement(
        'span',
        null,
        'The debugger is not attached.'
      ),
      _reactForAtom.React.createElement(
        'div',
        { className: 'nuclide-debugger-state-notice' },
        _reactForAtom.React.createElement(
          (_Button || _load_Button()).Button,
          {
            onClick: () => atom.commands.dispatch(atom.views.getView(atom.workspace), 'nuclide-debugger:toggle') },
          'Start debugging'
        )
      )
    );

    const debugeeRunningNotice = mode !== (_DebuggerStore || _load_DebuggerStore()).DebuggerMode.RUNNING ? null : _reactForAtom.React.createElement(
      'div',
      { className: 'nuclide-debugger-state-notice' },
      'The debugee is currently running.'
    );

    const debugFlexContainer = _reactForAtom.React.createElement(
      (_ResizableFlexContainer || _load_ResizableFlexContainer()).ResizableFlexContainer,
      { direction: (_ResizableFlexContainer || _load_ResizableFlexContainer()).FlexDirections.VERTICAL },
      threadsSection,
      _reactForAtom.React.createElement(
        (_ResizableFlexContainer || _load_ResizableFlexContainer()).ResizableFlexItem,
        { initialFlexScale: 1 },
        _reactForAtom.React.createElement(
          (_Section || _load_Section()).Section,
          { headline: 'Call Stack',
            key: 'callStack',
            className: (0, (_classnames || _load_classnames()).default)('nuclide-debugger-section-header', disabledClass) },
          _reactForAtom.React.createElement(
            'div',
            { className: 'nuclide-debugger-section-content' },
            _reactForAtom.React.createElement((_DebuggerCallstackComponent || _load_DebuggerCallstackComponent()).DebuggerCallstackComponent, {
              actions: actions,
              bridge: model.getBridge(),
              callstackStore: model.getCallstackStore()
            })
          )
        )
      ),
      _reactForAtom.React.createElement(
        (_ResizableFlexContainer || _load_ResizableFlexContainer()).ResizableFlexItem,
        { initialFlexScale: 1 },
        _reactForAtom.React.createElement(
          (_Section || _load_Section()).Section,
          { headline: 'Breakpoints',
            key: 'breakpoints',
            className: 'nuclide-debugger-section-header' },
          _reactForAtom.React.createElement(
            'div',
            { className: 'nuclide-debugger-section-content' },
            _reactForAtom.React.createElement((_BreakpointListComponent || _load_BreakpointListComponent()).BreakpointListComponent, {
              actions: actions,
              breakpointStore: model.getBreakpointStore()
            })
          )
        )
      ),
      _reactForAtom.React.createElement(
        (_ResizableFlexContainer || _load_ResizableFlexContainer()).ResizableFlexItem,
        { initialFlexScale: 1 },
        _reactForAtom.React.createElement(
          (_Section || _load_Section()).Section,
          { headline: 'Scopes',
            key: 'scopes',
            className: (0, (_classnames || _load_classnames()).default)('nuclide-debugger-section-header', disabledClass) },
          _reactForAtom.React.createElement(
            'div',
            { className: 'nuclide-debugger-section-content' },
            _reactForAtom.React.createElement(ScopesComponentWrapped, {
              watchExpressionStore: model.getWatchExpressionStore()
            })
          )
        )
      ),
      _reactForAtom.React.createElement(
        (_ResizableFlexContainer || _load_ResizableFlexContainer()).ResizableFlexItem,
        { initialFlexScale: 1 },
        _reactForAtom.React.createElement(
          (_Section || _load_Section()).Section,
          { headline: 'Watch Expressions',
            key: 'watchExpressions',
            className: 'nuclide-debugger-section-header' },
          _reactForAtom.React.createElement(
            'div',
            { className: 'nuclide-debugger-section-content' },
            _reactForAtom.React.createElement(WatchExpressionComponentWrapped, {
              onAddWatchExpression: actions.addWatchExpression.bind(model),
              onRemoveWatchExpression: actions.removeWatchExpression.bind(model),
              onUpdateWatchExpression: actions.updateWatchExpression.bind(model),
              watchExpressionStore: model.getWatchExpressionStore()
            })
          )
        )
      )
    );

    const debuggerContents = debuggerStoppedNotice || debugFlexContainer;
    return _reactForAtom.React.createElement(
      'div',
      { className: 'nuclide-debugger-container-new' },
      _reactForAtom.React.createElement(
        'div',
        { className: 'nuclide-debugger-section-header nuclide-debugger-controls-section' },
        _reactForAtom.React.createElement(
          'div',
          { className: 'nuclide-debugger-section-content' },
          _reactForAtom.React.createElement((_DebuggerSteppingComponent || _load_DebuggerSteppingComponent()).DebuggerSteppingComponent, {
            actions: actions,
            debuggerStore: model.getStore()
          })
        )
      ),
      debugeeRunningNotice,
      debuggerContents
    );
  }

  _dispose() {
    this._disposables.dispose();
  }
}
exports.NewDebuggerView = NewDebuggerView;