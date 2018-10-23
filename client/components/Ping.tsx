import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as PingStore from '../store/PingPong';

type PingProps = 
    PingStore.PingState
    & typeof PingStore.epicActionCreators
    & RouteComponentProps<{}>;

class Ping extends React.Component<PingProps, {}> {
    public render() {
        return <div>
            <h1>Ping</h1>

            <p>This is a simple example of a React component.</p>

            <p>Is pinging: <strong>{ this.props.isPinging.toString() }</strong></p>

            <button onClick={ () => { this.props.ping() } }>Start Epic Ping</button>

        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.ping, // Selects which state properties are merged into the component's props
    PingStore.epicActionCreators,                 // Selects which action creators are merged into the component's props
)(Ping);
