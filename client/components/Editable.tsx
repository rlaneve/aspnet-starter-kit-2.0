import * as React from "react";
import assign from "lodash-es/assign";

type EditableProps = {
    value: string,
    onChanged: Function,
    tooltip?: string,
    placeholder?: string,
    disabled?: boolean,
    maxLength?: number,
    style?: object,
}

type EditableState = {
    value: string | undefined
}
export default class Editable extends React.Component<EditableProps, EditableState> {
    readonly finalStyle: object;

    constructor(props) {
        super(props);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = { value: undefined };
        this.finalStyle = assign({}, {width: "100%"}, this.props.style);
    }

    handleBlur(event) {
        event.stopPropagation();
        if (this.state.value !== undefined && this.state.value !== this.props.value) {
            this.props.onChanged(this.state.value, this.props.value);
        }
        this.setState({ value: undefined }); // clear our local state; either we still match the original prop value, or we've called onChanged and will receive an updated prop value
    }

    handleChange(event) {
        event.stopPropagation();
        this.setState({ value: event.target.value });
    }

    render() {
        let value = (this.state.value !== undefined ? this.state.value : this.props.value);
        return (
            <input type="text"
                style={this.finalStyle}
                value={value}
                placeholder={this.props.placeholder}
                title={this.props.tooltip}
                disabled={this.props.disabled}
                maxLength={this.props.maxLength}
                onChange={this.handleChange}
                onBlur={this.handleBlur} />
        )
    }
}
