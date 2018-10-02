import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as PingStore from '../store/PingPong';

type PingProps = 
    PingStore.PingState
    & typeof PingStore.epicActionCreators
    & RouteComponentProps<{}>;

class Counter extends React.Component<PingProps, {}> {
    public render() {
        return <div>
            <h1>Counter</h1>

            <p>This is a simple example of a React component.</p>

            <p>Is pinging: <strong>{ this.props.isPinging }</strong></p>

            <button onClick={ () => { this.props.ping() } }>Start Ping</button>
        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.ping, // Selects which state properties are merged into the component's props
    PingStore.epicActionCreators                 // Selects which action creators are merged into the component's props
)(Counter);
