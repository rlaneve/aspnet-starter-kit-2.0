import * as React from "react";

import { EquipmentItemNormal, EquipmentItemNormalProps } from "./EquipmentItemNormal";

type EquipmentItemProps = 
    EquipmentItemNormalProps;

class EquipmentItem extends React.PureComponent<EquipmentItemProps, {}> {
    render() {
        return (<EquipmentItemNormal {...this.props} />);
        // const type = this.props.item.type;
        // // NOTE: no support for Floater type yet.
        // switch(type) {
        //     case 2:
        //         return (<Header {...this.props} />);
        //     default:
        //         return (<Normal {...this.props} />);
        // }
    }
}

export default EquipmentItem;
