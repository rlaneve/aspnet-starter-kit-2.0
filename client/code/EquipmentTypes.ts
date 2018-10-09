export enum EquipmentItemType {
    Normal = 1,
    Header = 2
}
export interface IEquipmentItem {
    id: string,
    type: EquipmentItemType,
    model: string,
    description: string,
    quantity: number,
    cost: number,
    margin: number,
    price: number,
    extendedCost: number,
    extendedPrice: number
}
