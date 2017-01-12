import { Component, DOM, createElement } from "react";

import * as classNames from "classnames";
import * as RcSlider from "rc-slider";

import "../ui/Slider.css";
import "rc-slider/dist/rc-slider.css";

import { ValidationAlert } from "./ValidationAlert";

export interface SliderProps {
    hasError?: boolean;
    value?: number;
    markers?: number;
    max?: number;
    min?: number;
    validationMessage?: string;
    onAfterChange?: (value: number) => void;
    onChange?: (value: number) => void;
    orientation: "horizontal" | "vertical";
    step?: number;
    tooltipTitle?: string;
    disabled: boolean;
}

interface Marks {
    [key: number]: string | number | {
        style: HTMLStyleElement,
        label: string
    };
}

export class Slider extends Component<SliderProps, {}> {
    constructor(props: SliderProps) {
        super(props);
        this.getTooltipTitle = this.getTooltipTitle.bind(this);
    }

    render() {
        const errorValueMessage = this.validateValue(this.props);
        const errorSettingMessage = this.validateSettings(this.props);
        const withError = !!errorSettingMessage || !!errorValueMessage || !!this.props.validationMessage;
        return DOM.div({ className: classNames("widget-slider", { "has-error": withError }) },
            createElement(RcSlider, {
                className: classNames({ "widget-slider-no-value": this.props.value === undefined }),
                disabled: !!errorSettingMessage || this.props.disabled,
                included: false,
                marks: this.calculateMarks(this.props),
                max: this.props.max,
                min: this.props.min,
                onAfterChange: this.props.onAfterChange,
                onChange: this.props.onChange,
                step: this.props.step ? this.props.step : null,
                tipFormatter: this.getTooltipTitle,
                value: this.props.value !== undefined ? this.props.value : this.calculateDefaultValue(this.props),
                vertical: this.props.orientation === "vertical"
            }),
            withError
                ? createElement(ValidationAlert, {
                    message: errorSettingMessage || this.props.validationMessage || errorValueMessage
                })
                : null
        );
    }

    private calculateMarks(props: SliderProps): Marks {
        // TODO: change rounding of value to be equal to position of the steps
        let marks: Marks = {};
        if (this.isValidMinMax(props) && props.markers > 2) {
            let interval = (props.max - props.min) / (props.markers - 1);
            for (let i = 0; i < props.markers; i++) {
                let value = props.min + (i * interval);
                marks[value] = value;
            }
        }
        return marks;
    }

    private isValidMinMax(props: SliderProps): boolean {
        return props.max !== undefined && props.max !== null &&
            props.min !== undefined && props.min !== null &&
            props.min < props.max;
    }

    private calculateDefaultValue(props: SliderProps): number {
        if (this.isValidMinMax(props)) {
                return props.min + (props.max - props.min) / 2;
        }
        return 0;
    }

    private validateSettings(props: SliderProps): string {
        let message: Array<string> = [];
        // This may not be executed because there is a default value for Max and Min
        if (props.max === undefined || props.max === null) {
            message.push("Maximum value needs to be set");
        }
        if (props.min === undefined || props.min === null) {
            message.push("Minimum value needs to be set");
        }
        if (props.min >= props.max) {
            message.push(`Minimum value ${props.min} needs to smaller than the maximum value ${props.max}`);
        }
        if (props.step !== undefined && props.step <= 0) {
            message.push(`Step value ${props.step} should be larger than 0`);
        }
        if (props.step !== undefined && props.max !== undefined && props.min !== undefined &&
            (props.max - props.min) % props.step > 0 ) {

            message.push(`Step value is invalid, max - min (${props.max} - ${props.min}) 
            should be evenly divisible by the step value ${props.step}`);
        }

        return message.join(", ");
    }

    private validateValue(props: SliderProps): string {
        let message: Array<string> = [];
        if (props.value > props.max) {
            message.push(`Value ${props.value} is larger than the maximum ${props.max}`);
        }
        if (props.value < props.min) {
            message.push(`Value ${props.value} is smaller than the minimum ${props.min}`);
        }

        return message.join(", ");
    }

    private getTooltipTitle(value: number, handleIndex: number): string {
        if (this.props.value === undefined) {
            return "--";
        }
        if (this.props.value < this.props.min || this.props.value > this.props.max) {
            return this.props.value.toString();
        }
        if (this.props.tooltipTitle) {
            return this.props.tooltipTitle.replace(/\{1\}/, value.toString());
        } else {
            return value.toString();
        }
    }
}
