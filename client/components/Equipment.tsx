import * as React from 'react';
import { connect } from 'react-redux';

import { Dictionary } from '../code/HelperTypes';

import { ApplicationState }  from '../store';
import * as EquipmentStore from '../store/Equipment';

import EquipmentItem from './EquipmentItem';

type EquipmentProps =
    EquipmentStore.EquipmentState
    & typeof EquipmentStore.actionCreators;

type EquipmentState = {
    editingItemId: string | undefined,
}

class Equipment extends React.Component<EquipmentProps, EquipmentState> {
    readonly columnWidths: Dictionary<string> = {};
    fieldToFocus: (string | undefined) = undefined;

    constructor(props) {
        super(props);
        this.state = {} as EquipmentState;
        this.onViewModeRowClicked = this.onViewModeRowClicked.bind(this);
        this.onEditModeRowLeftFirstInput = this.onEditModeRowLeftFirstInput.bind(this);
        this.onEditModeRowLeftLastInput = this.onEditModeRowLeftLastInput.bind(this);
        this.fieldToFocus = undefined;
        this.columnWidths = {
            model: "120px",
            description: "auto",
            quantity: "40px",
            cost: "70px",
            margin: "40px",
            price: "70px",
            extendedCost: "80px",
            extendedPrice: "80px"
        }
    }

    onViewModeRowClicked(item, fieldToFocus) {
        if (item === undefined) {
            this.fieldToFocus = undefined;
            this.setState({ editingItemId: undefined });
        } else {
          this.fieldToFocus = fieldToFocus;
          this.setState({ editingItemId: item.id });
        }
    }

    onEditModeRowLeftFirstInput(lineItem, fieldToFocus) {
        const items = this.props.items;
        let currentIndex = items.findIndex(function(li) { return li.id === lineItem.id; });
        let newLineItem = items[--currentIndex];
        this.onViewModeRowClicked(newLineItem, fieldToFocus);
    }
  
    onEditModeRowLeftLastInput(lineItem, fieldToFocus) {
        const items = this.props.items;
        let currentIndex = items.findIndex(function(li) { return li.id === lineItem.id; });
        let newLineItem = items[++currentIndex];
        this.onViewModeRowClicked(newLineItem, fieldToFocus);
    }

    componentDidUpdate() {
        this.fieldToFocus = undefined;
    }
    
    public render() {
        return <div>
            <h1>Equipment</h1>
            <table style={{width: "760px"}}>
                <thead>
                    <tr>
                        <th style={{textAlign: "left", width: this.columnWidths.model}}>Model</th>
                        <th style={{textAlign: "left", width: this.columnWidths.description}}>Description</th>
                        <th style={{textAlign: "center", width: this.columnWidths.quantity}}>Quantity</th>
                        <th style={{textAlign: "right", width: this.columnWidths.cost}}>Cost</th>
                        <th style={{textAlign: "right", width: this.columnWidths.margin}}>Margin</th>
                        <th style={{textAlign: "right", width: this.columnWidths.price}}>Price</th>
                        <th style={{textAlign: "right", width: this.columnWidths.extendedCost}}>Ext Cost</th>
                        <th style={{textAlign: "right", width: this.columnWidths.extendedPrice}}>Ext Price</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.items.map(lineItem =>
                        <EquipmentItem
                            item={lineItem}
                            columnWidths={this.columnWidths}
                            key={lineItem.id}
                            isEditing={lineItem.id === this.state.editingItemId}
                            fieldToFocus={(lineItem.id === this.state.editingItemId ? this.fieldToFocus : undefined)}
                            updateModel={this.props.updateModel}
                            updateDescription={this.props.updateDescription}
                            updateQuantity={this.props.updateQuantity}
                            updateCost={this.props.updateCost}
                            updateMargin={this.props.updateMargin}
                            updatePrice={this.props.updatePrice}
                            deleteItem={this.props.deleteItem}
                            onViewModeRowClicked={this.onViewModeRowClicked}
                            onEditModeRowLeftFirstInput={this.onEditModeRowLeftFirstInput}
                            onEditModeRowLeftLastInput={this.onEditModeRowLeftLastInput}
                        />
                    )}
                </tbody>
                <tfoot>
                </tfoot>
            </table>
        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.equipment, // Selects which state properties are merged into the component's props
    EquipmentStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Equipment);
