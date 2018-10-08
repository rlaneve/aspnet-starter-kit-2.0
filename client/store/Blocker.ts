import {Reducer} from 'redux';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface BlockerState {
    isOpen: boolean,
    message: string | null
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface OpenAction { type:'OPEN'; message:string }
interface CloseAction { type:'CLOSE' }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = OpenAction | CloseAction

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    open: (message:string) => <OpenAction>{ type: 'OPEN', message },
    close: () => <CloseAction>{ type: 'CLOSE' }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<BlockerState, KnownAction> = (state: BlockerState = { isOpen: false, message: null }, action: KnownAction) => {
    switch (action.type) {
        case 'OPEN':
            return { isOpen: true, message: action.message };
        case 'CLOSE':
            return { isOpen: false, message: null };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || { isOpen: false, message: null };
};
