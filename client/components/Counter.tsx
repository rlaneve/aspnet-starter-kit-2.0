import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as CounterStore from '../store/Counter';
import * as BlockerStore from '../store/Blocker';

type CounterProps =
    CounterStore.CounterState
    & typeof CounterStore.actionCreators
    & { openBlocker: typeof BlockerStore.actionCreators.open }
    & RouteComponentProps<{}>;

class Counter extends React.Component<CounterProps, {}> {
    public render() {
        return <div>
            <h1>Counter</h1>

            <p>This is a simple example of a React component.</p>

            <p>Current count: <strong>{ this.props.count }</strong></p>

            <button onClick={ () => { this.props.increment() } }>Increment</button>

            <button onClick={ () => { this.props.openBlocker("Blocked?") } }>Modal</button>
        </div>;
    }
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    ...CounterStore.actionCreators,
    openBlocker: BlockerStore.actionCreators.open,
}, dispatch);

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.counter, // Selects which state properties are merged into the component's props
    mapDispatchToProps                          // Selects which action creators are merged into the component's props
)(Counter);
