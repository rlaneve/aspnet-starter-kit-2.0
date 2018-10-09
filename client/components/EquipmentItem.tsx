import * as React from "react";

import { EquipmentItemType } from "../code/EquipmentTypes";

import { EquipmentItemNormal, EquipmentItemNormalProps } from "./EquipmentItemNormal";
import { EquipmentItemHeader, EquipmentItemHeaderProps } from "./EquipmentItemHeader";

type EquipmentItemProps = 
    EquipmentItemNormalProps
    & EquipmentItemHeaderProps;

class EquipmentItem extends React.PureComponent<EquipmentItemProps, {}> {
    render() {
        const type = this.props.item.type;
        // NOTE: no support for Floater type yet.
        switch(type) {
            case EquipmentItemType.Header:
                return (<EquipmentItemHeader {...this.props} />);
            default:
                return (<EquipmentItemNormal {...this.props} />);
        }
    }
}

export default EquipmentItem;
