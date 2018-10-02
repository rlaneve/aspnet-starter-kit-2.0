import 'rxjs';
import { filter, delay, mapTo } from 'rxjs/operators';
import { Action, Reducer } from 'redux';
import { ofType } from 'redux-observable';

export interface PingState {
    isPinging: boolean;
}

interface PingAction extends Action { type: 'PING' }
interface PongAction extends Action { type: 'PONG' }
type KnownAction = PingAction | PongAction;

export const epicActionCreators = {
    ping: () => <PingAction>{ type: 'PING' },
    pong: () => <PongAction>{ type: 'PONG' }
}

// Reducer
const unloadedState: PingState = { isPinging: false }
export const reducer: Reducer<PingState> = (state: PingState = unloadedState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'PING':
            return { isPinging: true };
        case 'PONG':
            return { isPinging: false };
        default: const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
}

// Epics
export const PingPongEpic = action$ => action$.pipe(
    ofType('PING'),
    delay(2000),
    mapTo({ type: 'PONG' })
);