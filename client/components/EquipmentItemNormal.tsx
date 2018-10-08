import * as React from "react";
import * as ReactDOM from "react-dom";

import { Dictionary } from '../code/HelperTypes';
import { IEquipmentItem } from '../code/EquipmentTypes';

import Editable from "./Editable";

import * as util from "../code/Utility";

function onDeleteItem(e:React.MouseEvent<HTMLAnchorElement>, handler:Function) {
    e.preventDefault();
    handler();
}
function renderNormalEditMode(props: EquipmentItemNormalProps) {
    const {
        item,
        updateModel, updateDescription, updateQuantity, updateCost, updateMargin, updatePrice, columnWidths,
        onEditModeRowLeftLastInput, onEditModeRowLeftFirstInput, deleteItem } = props;
    return (
        <tr className="equipmentLineItem">
            <td style={{width: columnWidths.model, whiteSpace: 'nowrap'}}>
                <div style={{width: '0px', height: '0px', display: 'inline-block', overflow: 'hidden'}}>
                    <input type='text' style={{width: '0px'}} data-previous='previous' onFocus={() => onEditModeRowLeftFirstInput(item, "price")} />
                </div>
                <Editable value={item.model}
                    ref="model"
                    onChanged={(newValue, oldValue) => updateModel(item.id, newValue, oldValue)} />
            </td>
            <td style={{width: columnWidths.description}}>
                <Editable value={item.description}
                    ref="description"
                    onChanged={(newValue, oldValue) => updateDescription(item.id, newValue, oldValue)} />
            </td>
            <td style={{width: columnWidths.quantity}}>
                <Editable value={item.quantity.toString()}
                    style={{textAlign: "center"}}
                    ref="quantity"
                    onChanged={(newValue, oldValue) => updateQuantity(item.id, newValue, oldValue)} />
            </td>
            <td style={{width: columnWidths.cost}}>
                <Editable value={item.cost.toString()}
                    style={{textAlign: "right"}}
                    ref="cost"
                    onChanged={(newValue, oldValue) => updateCost(item.id, newValue, oldValue)} />
            </td>
            <td style={{width: columnWidths.margin}}>
                <Editable value={item.margin.toString()}
                    style={{textAlign: "right"}}
                    ref="margin"
                    onChanged={(newValue, oldValue) => updateMargin(item.id, newValue, oldValue)} />
            </td>
            <td style={{width: columnWidths.price, whiteSpace: 'nowrap'}}>
                <Editable value={item.price.toString()}
                    style={{textAlign: "right"}}
                    ref="price"
                    onChanged={(newValue, oldValue) => updatePrice(item.id, newValue, oldValue)} />
                <div style={{width: '0px', height: '0px', display: 'inline-block', overflow: 'hidden'}}>
                    <input type='text' style={{width: '0px'}} data-next='next' onFocus={() => onEditModeRowLeftLastInput(item, "model")} />
                </div>
            </td>
            <td style={{textAlign: "right", width: columnWidths.extendedCost}}>{util.formatCurrency(item.extendedCost)}</td>
            <td style={{textAlign: "right", width: columnWidths.extendedPrice}}>{util.formatCurrency(item.extendedPrice)}</td>
            <td><a onClick={(e) => onDeleteItem(e, deleteItem(item.id))} href="#">x</a></td>
        </tr>
    )
}
function renderNormalViewMode(props: EquipmentItemNormalProps) {
    const { item, onViewModeRowClicked, deleteItem } = props;
    return (
        <tr className="equipmentLineItem">
            <td onClick={() => onViewModeRowClicked(item, "model")}>{item.model}</td>
            <td onClick={() => onViewModeRowClicked(item, "description")}>{item.description}</td>
            <td style={{textAlign: "center"}} onClick={() => onViewModeRowClicked(item, "quantity")}>{item.quantity}</td>
            <td style={{textAlign: "right"}} onClick={() => onViewModeRowClicked(item, "cost")}>{util.formatCurrency(item.cost)}</td>
            <td style={{textAlign: "right"}} onClick={() => onViewModeRowClicked(item, "margin")}>{util.formatPercentage(item.margin)}</td>
            <td style={{textAlign: "right"}} onClick={() => onViewModeRowClicked(item, "price")}>{util.formatCurrency(item.price)}</td>
            <td style={{textAlign: "right"}} onClick={() => onViewModeRowClicked(item, "model")}>{util.formatCurrency(item.extendedCost)}</td>
            <td style={{textAlign: "right"}} onClick={() => onViewModeRowClicked(item, "model")}>{util.formatCurrency(item.extendedPrice)}</td>
            <td><a onClick={(e) => onDeleteItem(e, deleteItem(item.id))} href="#">x</a></td>
        </tr>
    )
}
function renderNormal(props: EquipmentItemNormalProps) {
    const { isEditing } = props;
    return (isEditing ? renderNormalEditMode(props) : renderNormalViewMode(props));
}

export type EquipmentItemNormalProps = {
    item: IEquipmentItem,
    updateModel: Function,
    updateDescription: Function,
    updateQuantity: Function,
    updateCost: Function,
    updateMargin: Function,
    updatePrice: Function,
    onViewModeRowClicked: Function,
    onEditModeRowLeftLastInput: Function,
    onEditModeRowLeftFirstInput: Function,
    deleteItem: Function,
    columnWidths: Dictionary<string>,
    isEditing: boolean,
    fieldToFocus: (string | undefined)
}

export class EquipmentItemNormal extends React.Component<EquipmentItemNormalProps, {}> {
    setFocus() {
        if (this.props.fieldToFocus == undefined) return;
        let input = ReactDOM.findDOMNode(this.refs[this.props.fieldToFocus]) as HTMLInputElement;
        if (input == undefined && this.props.fieldToFocus === "price") {
            // couldn't find a "price" input, which means we're moving to a prior row; try "description" instead;
            input = ReactDOM.findDOMNode(this.refs["description"]) as HTMLInputElement;
        }
        if (input == undefined) return; // couldn't find an input; bail out
        input.focus();
        input.setSelectionRange(0, 9999);
    }

    componentDidUpdate() {
        this.setFocus();
    }

    render() {
        return renderNormal(this.props);
    }
}
