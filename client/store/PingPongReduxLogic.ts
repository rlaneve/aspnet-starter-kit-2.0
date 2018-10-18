import 'rxjs';
import { fetch, addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import { createLogic } from 'redux-logic';
import EquipmentItem from 'client/components/EquipmentItem';

export interface PingLogicState {
    isLogicPinging: boolean;
}

interface PingReduxLogicAction extends Action { type: 'LOGIC_PING' }
interface PongReduxLogicAction extends Action { type: 'LOGIC_PONG' }
type KnownAction = PingReduxLogicAction | PongReduxLogicAction;

export const logicActionCreators = {
    logicPing: () => <PingReduxLogicAction>{ type: 'LOGIC_PING' },
    logicPong: () => <PongReduxLogicAction>{ type: 'LOGIC_PONG' }
}

// Reducer
const unloadedState: PingLogicState = { isLogicPinging: false }
export const reducer: Reducer<PingLogicState> = (state: PingLogicState = unloadedState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'LOGIC_PING':
            return { isLogicPinging: true };
        case 'LOGIC_PONG':
            return { isLogicPinging: false };
        default: const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
}

// redux-logic
export const pingPongLogic = createLogic<PingLogicState>({
    type: 'LOGIC_PING',
    process: ({ getState }, dispatch, done) => {
        if (getState().isLogicPinging = true) {
            let fetchTask = fetch(`api/Item/1`)
                .then(response => response.json() as Promise<EquipmentItem>)
            addTask(fetchTask);
            console.log(fetchTask);
            dispatch({ type: 'LOGIC_PONG' })
        }
        done();
    }
})
