import { Component, createElement, DOM } from "react";

import * as classNames from "classnames";
import * as RcSlider from "rc-slider";

import "rc-slider/dist/rc-slider.css";
import "../ui/RangeSlider.css";

import { Alert } from "./Alert";

export interface SliderProps {
    hasError?: boolean;
    noOfMarkers?: number;
    maxValue?: number | null;
    minValue?: number | null;
    validationMessage?: string;
    onChange?: (value: number) => void;
    onUpdate?: (value: number) => void;
    stepValue?: number;
    tooltipText?: string | null;
    disabled: boolean;
    lowerBound?: number | null;
    upperBound?: number | null;
    decimalPlaces?: number;
}

interface Marks {
    [key: number]: string | number | {
        style: HTMLStyleElement,
        label: string
    };
}

export class Slider extends Component<SliderProps, {}> {
    static defaultProps: SliderProps = {
        disabled: false,
        maxValue: 100,
        minValue: 0,
        noOfMarkers: 2,
        tooltipText: "{1}"
    };

    constructor(props: SliderProps) {
        super(props);

        this.getTooltipText = this.getTooltipText.bind(this);
    }

    render() {
        const { maxValue, minValue, stepValue, lowerBound, upperBound } = this.props;
        const alertMessage = this.validateSettings(this.props)
            || this.validateValues(this.props) || this.props.validationMessage;
        const validLowerBound = typeof lowerBound === "number"
            ? lowerBound
            : this.isValidMinMax(this.props) ? (minValue + stepValue) : 1;
        const validUpperBound = typeof upperBound === "number"
            ? upperBound
            : this.isValidMinMax(this.props) ? (maxValue - stepValue) : (100 - stepValue);

        return DOM.div({ className: classNames("widget-slider", { "has-error": !!alertMessage }) },
            createElement(RcSlider, {
                defaultValue: [ validLowerBound, validUpperBound ],
                disabled: !!alertMessage || this.props.disabled,
                included: true,
                marks: this.calculateMarks(this.props),
                max: maxValue,
                min: minValue,
                onAfterChange: this.props.onChange,
                onChange: this.props.onUpdate,
                pushable: false,
                range: true,
                step: stepValue ? stepValue : null,
                tipFormatter: this.props.tooltipText ? this.getTooltipText : null,
                value: [ validLowerBound, validUpperBound ]
            }),
            alertMessage && !this.props.disabled ? createElement(Alert, { message: alertMessage }) : null
        );
    }

    private calculateMarks(props: SliderProps): Marks {
        const marks: Marks = {};
        if (this.isValidMinMax(props) && props.noOfMarkers >= 2) {
            const interval = (props.maxValue - props.minValue) / (props.noOfMarkers - 1);
            for (let i = 0; i < props.noOfMarkers; i++) {
                const value = parseFloat((props.minValue + (i * interval)).toFixed(props.decimalPlaces));
                marks[value] = value;
            }
        }
        return marks;
    }

    private isValidMinMax(props: SliderProps): boolean {
        const { maxValue, minValue } = props;
        return typeof maxValue === "number" && typeof minValue === "number" && minValue < maxValue;
    }

    private validateSettings(props: SliderProps): string {
        const message: string[] = [];
        const validMax = typeof props.maxValue === "number";
        const validMin = typeof props.minValue === "number";
        if (!validMax) {
            message.push("Maximum value is required");
        }
        if (!validMin) {
            message.push("Minimum value is required");
        }
        if (typeof props.lowerBound !== "number") {
            message.push("Lower bound value is required");
        }
        if (typeof props.upperBound !== "number") {
            message.push("Upper bound value is required");
        }
        if (validMin && validMax && (props.minValue >= props.maxValue)) {
            message.push(`Minimum value ${props.minValue} should be less than the maximum value ${props.maxValue}`);
        }
        if (!props.stepValue || props.stepValue <= 0) {
            message.push(`Step value ${props.stepValue} should be greater than 0`);
        } else if (validMax && validMin && (props.maxValue - props.minValue) % props.stepValue > 0) {
            message.push(`Step value is invalid, max - min (${props.maxValue} - ${props.minValue}) 
            should be evenly divisible by the step value ${props.stepValue}`);
        }

        return message.join(", ");
    }

    private validateValues(props: SliderProps): string {
        const message: string[] = [];
        if (props.lowerBound > props.maxValue) {
            message.push(`Lower bound ${props.lowerBound} should be less than the maximum ${props.maxValue}`);
        }
        if (props.lowerBound < props.minValue) {
            message.push(`Lower bound ${props.lowerBound} should be greater than the minimum ${props.minValue}`);
        }
        if (props.upperBound > props.maxValue) {
            message.push(`Upper bound ${props.upperBound} should be less than the maximum ${props.maxValue}`);
        }
        if (props.upperBound < props.minValue) {
            message.push(`Upper bound ${props.upperBound} should be greater than the minimum ${props.minValue}`);
        }
        return message.join(", ");
    }

    private getTooltipText(value: number): string {
        if (this.props.lowerBound === undefined || this.props.upperBound === undefined) {
            return "--";
        }

        return this.props.tooltipText ? this.props.tooltipText.replace(/\{1}/, value.toString()) : value.toString();
    }
}
