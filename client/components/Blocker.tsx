import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as BlockerStore from '../store/Blocker';

import * as ReactModal from 'react-modal';

type BlockerProps =
    BlockerStore.BlockerState
    & typeof BlockerStore.actionCreators;

class Blocker extends React.Component<BlockerProps, {}> {
    public render() {
        return <ReactModal
            ariaHideApp={false}
            isOpen={this.props.isOpen}
            contentLabel="Blocker"
            className="blockerContainer"
        >
            <div className="blockerInner">
                <p className="blockerText">{this.props.message}</p>
                <button onClick={ () => { this.props.close() } }>dismiss</button>
            </div>
        </ReactModal>;
    }
}

// Wire up the React component to the Redux store
const ConnectedBlocker = connect(
    (state: ApplicationState) => state.blocker, // Selects which state properties are merged into the component's props
    BlockerStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Blocker);

export { ConnectedBlocker as Blocker };
