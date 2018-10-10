import * as React from "react";

import * as util from "../code/Utility";

import { IEquipmentTotals } from "../code/EquipmentTypes";

type EquipmentFooterProps = {
    totals: IEquipmentTotals
}

class EquipmentFooter extends React.PureComponent<EquipmentFooterProps, {}> {
    render() {
        const { extendedCost, extendedPrice } = this.props.totals;
        return (
            <tr className="equipmentFooter">
                <td colSpan={5}>&nbsp;</td>
                <td style={{textAlign: "right"}}>Totals:</td>
                <td style={{textAlign: "right"}}>{util.formatCurrency(extendedCost)}</td>
                <td style={{textAlign: "right"}}>{util.formatCurrency(extendedPrice)}</td>
            </tr>
        )
    }
}

export default EquipmentFooter;