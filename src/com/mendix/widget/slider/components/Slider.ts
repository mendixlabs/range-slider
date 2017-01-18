import { Component, DOM, createElement } from "react";

import * as classNames from "classnames";
import * as RcSlider from "rc-slider";

import "../ui/Slider.css";
import "rc-slider/dist/rc-slider.css";

import { ValidationAlert } from "./ValidationAlert";

export interface SliderProps {
    hasError?: boolean;
    value?: number;
    noOfMarkers?: number;
    maxValue?: number;
    minValue?: number;
    validationMessage?: string;
    onClick?: (value: number) => void;
    onChange?: (value: number) => void;
    orientation: "horizontal" | "vertical";
    stepValue?: number;
    tooltipText?: string;
    disabled: boolean;
    showRange?: boolean;
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
                defaultValue: this.props.showRange
                    ? [ this.props.minValue, this.props.value !== undefined ? this.props.value : this.calculateDefaultValue(this.props) ]
                    : 0,
                disabled: !!errorSettingMessage || this.props.disabled,
                included: this.props.showRange,
                marks: this.calculateMarks(this.props),
                max: this.props.maxValue,
                min: this.props.minValue,
                onAfterChange: this.props.onClick,
                onChange: this.props.onChange,
                pushable: this.props.showRange,
                range: this.props.showRange,
                step: this.props.stepValue ? this.props.stepValue : null,
                tipFormatter: this.props.tooltipText ? this.getTooltipTitle : null,
                // Don't use defaultValue property from rc-slider, to support empty values after first rendering
                value: this.props.showRange
                    ?  undefined
                    : this.props.value !== undefined ? this.props.value : this.calculateDefaultValue(this.props),
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
        if (this.isValidMinMax(props) && props.noOfMarkers >= 2) {
            let interval = (props.maxValue - props.minValue) / (props.noOfMarkers - 1);
            for (let i = 0; i < props.noOfMarkers; i++) {
                let value = props.minValue + (i * interval);
                marks[value] = value;
            }
        }
        return marks;
    }

    private isValidMinMax(props: SliderProps): boolean {
        return props.maxValue !== undefined && props.maxValue !== null &&
            props.minValue !== undefined && props.minValue !== null &&
            props.minValue < props.maxValue;
    }

    private calculateDefaultValue(props: SliderProps): number {
        if (this.isValidMinMax(props)) {
                return props.minValue + (props.maxValue - props.minValue) / 2;
        }
        return 0;
    }

    private validateSettings(props: SliderProps): string {
        let message: Array<string> = [];
        // This may not be executed because there is a default value for Max and Min
        if (props.maxValue === undefined || props.maxValue === null) {
            message.push("Maximum value needs to be set");
        }
        if (props.minValue === undefined || props.minValue === null) {
            message.push("Minimum value needs to be set");
        }
        if (props.minValue >= props.maxValue) {
            message.push(`Minimum value ${props.minValue} needs to smaller than the maximum value ${props.maxValue}`);
        }
        if (props.stepValue !== undefined && props.stepValue <= 0) {
            message.push(`Step value ${props.stepValue} should be larger than 0`);
        }
        if (props.stepValue !== undefined && props.maxValue !== undefined && props.minValue !== undefined &&
            (props.maxValue - props.minValue) % props.stepValue > 0 ) {

            message.push(`Step value is invalid, max - min (${props.maxValue} - ${props.minValue}) 
            should be evenly divisible by the step value ${props.stepValue}`);
        }

        return message.join(", ");
    }

    private validateValue(props: SliderProps): string {
        let message: string[] = [];
        if (props.value > props.maxValue) {
            message.push(`Value ${props.value} is larger than the maximum ${props.maxValue}`);
        }
        if (props.value < props.minValue) {
            message.push(`Value ${props.value} is smaller than the minimum ${props.minValue}`);
        }

        return message.join(", ");
    }

    private getTooltipTitle(value: number, handleIndex: number): string {
        if (this.props.value === undefined) {
            return "--";
        }
        let displayValue = value.toString();
        if (this.props.value < this.props.minValue || this.props.value > this.props.maxValue) {
            displayValue = this.props.value.toString();
        }
        return this.props.tooltipText.replace(/\{1\}/, displayValue);
    }
}
