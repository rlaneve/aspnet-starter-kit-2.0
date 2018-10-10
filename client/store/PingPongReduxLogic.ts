import 'rxjs';
import { delay } from 'rxjs/operators';
import { Action, Reducer } from 'redux';
import { createLogic } from 'redux-logic';

export interface PingLogicState {
    isPinging: boolean;
}

interface PingReduxLogicAction extends Action { type: 'LOGIC_PING' }
interface PongReduxLogicAction extends Action { type: 'LOGIC_PONG' }
type KnownAction = PingReduxLogicAction | PongReduxLogicAction;

export const logicActionCreators = {
    logicPing: () => <PingReduxLogicAction>{ type: 'LOGIC_PING' },
    logicPong: () => <PongReduxLogicAction>{ type: 'LOGIC_PONG' }
}

// Reducer
const unloadedState: PingLogicState = { isPinging: false }
export const reducer: Reducer<PingLogicState> = (state: PingLogicState = unloadedState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'LOGIC_PING':
            return { isPinging: true };
        case 'LOGIC_PONG':
            return { isPinging: false };
        default: const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
}

// redux-logic
export const pingLogic = createLogic<PingLogicState>({
    type: 'LOGIC_PING',
    process: ({ getState } , dispatch, done) => {
        const state = getState();
        if (state.isPinging = true){
            delay(5000);
            dispatch({ type: 'LOGIC_PONG' });
        }
        done();
    }
})