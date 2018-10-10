import { Action, Reducer } from 'redux';

import assign from 'lodash-es/assign';
import reduce from 'lodash-es/reduce';

import * as util from '../code/Utility';

import { IEquipmentItem, EquipmentItemType, IEquipmentTotals } from '../code/EquipmentTypes';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface EquipmentState {
    items: IEquipmentItem[],
    totals: IEquipmentTotals
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
        { id: "_0_", type: EquipmentItemType.Header, model: "HEADER", description: "Super Cool Header", quantity: 0, cost: 0, margin: 0, price: 0, extendedCost: 0, extendedPrice: 0 },
        { id: "_1_", type: EquipmentItemType.Normal, model: "ASKM1", description: "ASKM1 DESCRIPTION", quantity: 1, cost: 50, margin: 50, price: 100, extendedCost: 50, extendedPrice: 100 },
        { id: "_2_", type: EquipmentItemType.Normal, model: "ASKM1", description: "ASKM1 DESCRIPTION", quantity: 1, cost: 50, margin: 50, price: 100, extendedCost: 50, extendedPrice: 100 },
        { id: "_3_", type: EquipmentItemType.Normal, model: "ASKM1", description: "ASKM1 DESCRIPTION", quantity: 1, cost: 50, margin: 50, price: 100, extendedCost: 50, extendedPrice: 100 },
        { id: "_4_", type: EquipmentItemType.Normal, model: "ASKM1", description: "ASKM1 DESCRIPTION", quantity: 1, cost: 50, margin: 50, price: 100, extendedCost: 50, extendedPrice: 100 },
        { id: "_5_", type: EquipmentItemType.Normal, model: "ASKM1", description: "ASKM1 DESCRIPTION", quantity: 1, cost: 50, margin: 50, price: 100, extendedCost: 50, extendedPrice: 100 },
        { id: "_6_", type: EquipmentItemType.Normal, model: "ASKM1", description: "ASKM1 DESCRIPTION", quantity: 1, cost: 50, margin: 50, price: 100, extendedCost: 50, extendedPrice: 100 },
    ],
    totals: {
        extendedCost: 300,
        extendedPrice: 600
    }
};

function calculateTotals(items) {
    return reduce(items, function(total, i) {
        total.extendedCost += i.extendedCost || 0;
        total.extendedPrice += i.extendedPrice || 0;
        return total;
    }, { extendedCost: 0, extendedPrice: 0 });
}

function updateTotals(state:EquipmentState) {
    return {
        ...state,
        totals: calculateTotals(state.items)
    };
}

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

function getModelAndTypeChanges(oldItem, newModel) {
    let newType = EquipmentItemType.Normal; // normal
    if (newModel.toUpperCase() === "HEADER") {
        newType = EquipmentItemType.Header; // header
    }
    if ((oldItem.type || EquipmentItemType.Normal) !== newType) {
        let newQuantity = 0;
        if (newType === 1) { // normal
            newQuantity = 1;
        }
        return {
            model: newModel,
            type: newType,
            quantity: newQuantity,
            cost: 0,
            price: 0,
            margin: 0,
            extendedCost: 0,
            extendedPrice: 0
        };
    }
    return { model: newModel };
}

function applyItemChanges(state:EquipmentState, itemId:string, changes:object):EquipmentState {
    return {
        ...state,
        items: state.items.map(item => item.id !== itemId ? item : assign(item, changes) as IEquipmentItem)
    };
}
export const reducer: Reducer<EquipmentState> = (state: EquipmentState = initialState, incomingAction: Action) => {
    let newPrice:number;
    let newState:EquipmentState;
    const action = incomingAction as KnownAction;
    let item = state.items.find(i => i.id === action.id) as IEquipmentItem;
    switch (action.type) {
        case 'EQUIPMENT_UPDATE_MODEL':
            return applyItemChanges(state, action.id, getModelAndTypeChanges(item, action.newValue));
        case 'EQUIPMENT_UPDATE_DESCRIPTION':
            return applyItemChanges(state, action.id, { description: action.newValue });
        case 'EQUIPMENT_UPDATE_QUANTITY':
            const newQuantity = parseInt(action.newValue, 10);
            if (isNaN(newQuantity)) return state;
            newState = applyItemChanges(state, action.id, {
                quantity: newQuantity,
                extendedCost: newQuantity * item.cost,
                extendedPrice: newQuantity * item.price
            });
            return updateTotals(newState);
        case 'EQUIPMENT_UPDATE_COST':
            const newCost = parseFloat(action.newValue);
            if (isNaN(newCost)) return state;
            newState = applyItemChanges(state, action.id, getItemCostChanges(item, newCost));
            return updateTotals(newState);
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
            newState = applyItemChanges(state, action.id, {
                margin: newMargin,
                price: newPrice,
                extendedPrice: newPrice * item.quantity
            });
            return updateTotals(newState);
        case 'EQUIPMENT_UPDATE_PRICE':
            newPrice = parseFloat(action.newValue);
            if (isNaN(newPrice)) return state;
            newState = applyItemChanges(state, action.id, {
                price: newPrice,
                margin: util.marginFromCostAndPrice(item.cost, newPrice),
                extendedPrice: newPrice * item.quantity
            });
            return updateTotals(newState);
        case 'EQUIPMENT_DELETE_ITEM':
            newState = {
                ...state,
                items: state.items.filter(item => item.id !== action.id)
            };
            return updateTotals(newState);
        default:
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || initialState;
};
