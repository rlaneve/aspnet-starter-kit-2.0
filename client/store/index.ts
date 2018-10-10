import { combineEpics, Epic } from 'redux-observable';
import * as WeatherForecasts from './WeatherForecasts';
import * as Counter from './Counter';
import * as Blocker from './Blocker';
import * as Equipment from './Equipment';
import * as PingPong from './PingPong';
import * as PingReduxLogic from './PingPongReduxLogic';

// The top-level state object
export interface ApplicationState {
    counter: Counter.CounterState;
    weatherForecasts: WeatherForecasts.WeatherForecastsState;
    blocker: Blocker.BlockerState;
    equipment: Equipment.EquipmentState;
    ping: PingPong.PingState;
    pingLogic: PingReduxLogic.PingLogicState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    counter: Counter.reducer,
    weatherForecasts: WeatherForecasts.reducer,
    blocker: Blocker.reducer,
    equipment: Equipment.reducer,
    ping: PingPong.reducer,
    pingLogic: PingReduxLogic.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}

export const rootEpic: Epic = combineEpics(
    PingPong.PingPongEpic,
)