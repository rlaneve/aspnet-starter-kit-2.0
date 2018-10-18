import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as PingReduxLogicStore from '../store/PingPongReduxLogic';

type PingLogicProps = 
    PingReduxLogicStore.PingLogicState
    & typeof PingReduxLogicStore.logicActionCreators
    & RouteComponentProps<{}>;

class Ping extends React.Component<PingLogicProps, {}> {
    public render() {
        return <div>
            <h1>Ping</h1>

            <p>This is a simple example of a React component.</p>

            <p>Is pinging: <strong>{ this.props.isLogicPinging.toString() }</strong></p>

            <button onClick={ () => { this.props.logicPing() } }>Start Logic Ping</button>

        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.pingLogic, // Selects which state properties are merged into the component's props
    PingReduxLogicStore.logicActionCreators,                 // Selects which action creators are merged into the component's props
)(Ping);
