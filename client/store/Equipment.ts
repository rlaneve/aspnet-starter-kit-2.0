import { Action, Reducer } from 'redux';

import assign from 'lodash-es/assign';

import * as util from '../code/Utility';

import { IEquipmentItem } from '../code/EquipmentTypes';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface EquipmentState {
    items: IEquipmentItem[]
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface UpdateModelAction { type:'EQUIPMENT_UPDATE_MODEL'; id:string; newValue:string; oldValue:string }
interface UpdateDescriptionAction { type:'EQUIPMENT_UPDATE_DESCRIPTION'; id:string; newValue:string; oldValue:string }
interface UpdateQuantityAction { type:'EQUIPMENT_UPDATE_QUANTITY'; id:string; newValue:string; oldValue:string }
interface UpdateCostAction { type:'EQUIPMENT_UPDATE_COST'; id:string; newValue:string; oldValue:string }
interface UpdateMarginAction { type:'EQUIPMENT_UPDATE_MARGIN'; id:string; newValue:string; oldValue:string }
interface UpdatePriceAction { type:'EQUIPMENT_UPDATE_PRICE'; id:string; newValue:string; oldValue:string }
interface DeleteItemAction { type:'EQUIPMENT_DELETE_ITEM'; id:string }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = UpdateModelAction | UpdateDescriptionAction | UpdateQuantityAction | UpdateCostAction | UpdateMarginAction | UpdatePriceAction | DeleteItemAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    updateModel: (id:string, newValue:string, oldValue:string) => <UpdateModelAction>{ type: 'EQUIPMENT_UPDATE_MODEL', id, newValue, oldValue },
    updateDescription: (id:string, newValue:string, oldValue:string) => <UpdateDescriptionAction>{ type: 'EQUIPMENT_UPDATE_DESCRIPTION', id, newValue, oldValue },
    updateQuantity: (id:string, newValue:string, oldValue:string) => <UpdateQuantityAction>{ type: 'EQUIPMENT_UPDATE_QUANTITY', id, newValue, oldValue },
    updateCost: (id:string, newValue:string, oldValue:string) => <UpdateCostAction>{ type: 'EQUIPMENT_UPDATE_COST', id, newValue, oldValue },
    updateMargin: (id:string, newValue:string, oldValue:string) => <UpdateMarginAction>{ type: 'EQUIPMENT_UPDATE_MARGIN', id, newValue, oldValue },
    updatePrice: (id:string, newValue:string, oldValue:string) => <UpdatePriceAction>{ type: 'EQUIPMENT_UPDATE_PRICE', id, newValue, oldValue },
    deleteItem: (id:string) => <DeleteItemAction>{ type: 'EQUIPMENT_DELETE_ITEM', id },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const initialState: EquipmentState = {
    items: [
        { id: "_1_", model: "ASKM1", description: "ASKM1 DESCRIPTION", quantity: 1, cost: 50, margin: 50, price: 100, extendedCost: 50, extendedPrice: 100 },
        { id: "_2_", model: "ASKM1", description: "ASKM1 DESCRIPTION", quantity: 1, cost: 50, margin: 50, price: 100, extendedCost: 50, extendedPrice: 100 },
        { id: "_3_", model: "ASKM1", description: "ASKM1 DESCRIPTION", quantity: 1, cost: 50, margin: 50, price: 100, extendedCost: 50, extendedPrice: 100 },
        { id: "_4_", model: "ASKM1", description: "ASKM1 DESCRIPTION", quantity: 1, cost: 50, margin: 50, price: 100, extendedCost: 50, extendedPrice: 100 },
        { id: "_5_", model: "ASKM1", description: "ASKM1 DESCRIPTION", quantity: 1, cost: 50, margin: 50, price: 100, extendedCost: 50, extendedPrice: 100 },
        { id: "_6_", model: "ASKM1", description: "ASKM1 DESCRIPTION", quantity: 1, cost: 50, margin: 50, price: 100, extendedCost: 50, extendedPrice: 100 },
    ]
};

function getItemCostChanges(oldItem, newCost) {
    const newPrice = util.priceFromCostAndMargin(newCost, oldItem.margin);
    const changes = {
        cost: newCost,
        extendedCost: newCost * oldItem.quantity,
        price: newPrice,
        extendedPrice: newPrice * oldItem.quantity
    };
    return changes;
}

function applyItemChanges(state:EquipmentState, itemId:string, changes:object):EquipmentState {
    return {
        ...state,
        items: state.items.map(item => item.id !== itemId ? item : assign(item, changes) as IEquipmentItem)
    };
}
export const reducer: Reducer<EquipmentState> = (state: EquipmentState = initialState, incomingAction: Action) => {
    let newPrice:number;
    const action = incomingAction as KnownAction;
    let item = state.items.find(i => i.id === action.id) as IEquipmentItem;
    switch (action.type) {
        case 'EQUIPMENT_UPDATE_MODEL':
            return applyItemChanges(state, action.id, { model: action.newValue });
        case 'EQUIPMENT_UPDATE_DESCRIPTION':
            return applyItemChanges(state, action.id, { description: action.newValue });
        case 'EQUIPMENT_UPDATE_QUANTITY':
            const newQuantity = parseInt(action.newValue, 10);
            if (isNaN(newQuantity)) return state;
            return applyItemChanges(state, action.id, {
                quantity: newQuantity,
                extendedCost: newQuantity * item.cost,
                extendedPrice: newQuantity * item.price
            });
        case 'EQUIPMENT_UPDATE_COST':
            const newCost = parseFloat(action.newValue);
            if (isNaN(newCost)) return state;
            return applyItemChanges(state, action.id, getItemCostChanges(item, newCost));
        case 'EQUIPMENT_UPDATE_MARGIN':
            // this isn't working right when margin is 100+, or price is 0, or some combination
            const newMargin = parseFloat(action.newValue);
            if (isNaN(newMargin)) return state;
            if (item.cost !== 0) {
                if(newMargin >= 100) {
                    return applyItemChanges(state, action.id, {
                        margin: util.marginFromCostAndPrice(item.cost, item.price)
                    });
                }
            }
            newPrice = util.priceFromCostAndMargin(item.cost, newMargin)
            return applyItemChanges(state, action.id, {
                margin: newMargin,
                price: newPrice,
                extendedPrice: newPrice * item.quantity
            });
        case 'EQUIPMENT_UPDATE_PRICE':
            newPrice = parseFloat(action.newValue);
            if (isNaN(newPrice)) return state;
            return applyItemChanges(state, action.id, {
                price: newPrice,
                margin: util.marginFromCostAndPrice(item.cost, newPrice),
                extendedPrice: newPrice * item.quantity
            });
        case 'EQUIPMENT_DELETE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.id)
            };
            default:
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || initialState;
};
