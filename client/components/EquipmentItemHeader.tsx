import * as React from "react";
import * as ReactDOM from "react-dom";

import { Dictionary } from '../code/HelperTypes';
import { IEquipmentItem } from '../code/EquipmentTypes';

import Editable from "./Editable";

function onDeleteItem(e:React.MouseEvent<HTMLAnchorElement>, handler:Function) {
    e.preventDefault();
    handler();
}
function renderHeaderEditMode(props: EquipmentItemHeaderProps) {
    const { item, updateModel, updateDescription, onEditModeRowLeftFirstInput, onEditModeRowLeftLastInput, deleteItem } = props;
    return (
        <tr className="equipmentLineItem">
            <td style={{whiteSpace: 'nowrap'}}>
                <div style={{width: '0px', height: '0px', display: 'inline-block', overflow: 'hidden'}}>
                    <input type='text' style={{width: '0px'}} data-previous='previous' onFocus={() => onEditModeRowLeftFirstInput(item, "price")} />
                </div>
                <Editable value={item.model}
                    ref="model"
                    onChanged={(newValue, oldValue) => updateModel(item.id, newValue, oldValue)} />
            </td>
            <td colSpan={7} style={{whiteSpace: 'nowrap'}}>
                <Editable value={item.description}
                    ref="description"
                    onChanged={(newValue, oldValue) => updateDescription(item.id, newValue, oldValue)} />
                <div style={{width: '0px', height: '0px', display: 'inline-block', overflow: 'hidden'}}>
                    <input type='text' style={{width: '0px'}} data-next='next' onFocus={() => onEditModeRowLeftLastInput(item, "model")} />
                </div>
            </td>
            <td><a onClick={(e) => onDeleteItem(e, deleteItem(item.id))} href="#">x</a></td>
        </tr>
    )
}
function renderHeaderViewMode(props: EquipmentItemHeaderProps) {
    const { item, onViewModeRowClicked, deleteItem } = props;
    return (
        <tr className="equipmentLineItem">
            <td onClick={() => onViewModeRowClicked(item, "model")}>&nbsp;</td>
            <td colSpan={7} style={{fontWeight: "bold", textDecoration: "underline"}} onClick={() => onViewModeRowClicked(item, "description")}>{item.description}</td>
            <td><a onClick={(e) => onDeleteItem(e, deleteItem(item.id))} href="#">x</a></td>
        </tr>
    )
}
function renderHeader(props: EquipmentItemHeaderProps) {
    const { isEditing } = props;
    return (isEditing ? renderHeaderEditMode(props) : renderHeaderViewMode(props));
}

export class EquipmentItemHeader extends React.Component<EquipmentItemHeaderProps, {}> {
    setFocus() {
        if (this.props.fieldToFocus == undefined) return;
        var input = ReactDOM.findDOMNode(this.refs[this.props.fieldToFocus]) as HTMLInputElement;
        if (input == undefined && this.props.fieldToFocus === "price") {
            // couldn't find a "price" input, which means we're moving to a prior row; try "description" instead;
            input = ReactDOM.findDOMNode(this.refs["description"]) as HTMLInputElement;
        }
        if (input == undefined) return; // couldn't find an input; bail out
        input.focus();
        input.setSelectionRange(0, 9999);
    }

    componentDidUpdate(prevProps, prevState) {
        this.setFocus();
    }

    render() {
        return renderHeader(this.props);
    }
}

export type EquipmentItemHeaderProps = {
    item: IEquipmentItem,
    updateModel: Function,
    updateDescription: Function,
    onViewModeRowClicked: Function,
    onEditModeRowLeftLastInput: Function,
    onEditModeRowLeftFirstInput: Function,
    deleteItem: Function,
    columnWidths: Dictionary<string>,
    isEditing: boolean,
    fieldToFocus: (string | undefined)
}
