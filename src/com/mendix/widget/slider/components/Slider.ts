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
    maxValue?: number | null;
    minValue?: number | null;
    validationMessage?: string;
    onClick?: (value: number) => void;
    onChange?: (value: number) => void;
    orientation: "horizontal" | "vertical";
    stepValue?: number;
    tooltipText?: string | null;
    disabled: boolean;
    showRange?: boolean;
    lowerBound?: number | null;
    upperBound?: number | null;
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
        orientation: "horizontal",
        tooltipText: ""
    };
    constructor(props: SliderProps) {
        super(props);
        this.getTooltipText = this.getTooltipText.bind(this);
    }

    render() {
        const alertMessage = this.validateSettings(this.props) 
        || this.validateValues(this.props) || this.props.validationMessage;

        return DOM.div({ className: classNames("widget-slider", { "has-error": !!alertMessage }) },
            createElement(RcSlider, this.getSliderProps()),
            this.showError(alertMessage)
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
        const { maxValue, minValue } = props;
        return typeof maxValue === "number" && typeof minValue === "number" && minValue < maxValue;
    }

    private calculateDefaultValue(props: SliderProps): number {
        return this.isValidMinMax(props) ? props.minValue + (props.maxValue - props.minValue) / 2 : 0;
    }

    private validateSettings(props: SliderProps): string {
        let message: string[] = [];
        const validMax = typeof props.maxValue === "number";
        const validMin = typeof props.minValue === "number";
        if (!validMax) {
            message.push("Maximum value is required");
        }
        if (!validMin) {
            message.push("Minimum value is required");
        }
        if (typeof props.lowerBound !== "number" && this.props.showRange) {
            message.push("Lower Bound value is required");
        }
        if (typeof props.upperBound !== "number" && this.props.showRange) {
            message.push("Upper Bound value is required");
        }
        if (validMin && validMax && (props.minValue >= props.maxValue)) {
            message.push(`Minimum value ${props.minValue} should be less than the maximum value ${props.maxValue}`);
        }
        if (!props.stepValue || props.stepValue <= 0) {
            message.push(`Step value ${props.stepValue} should be greater than 0`);
        } else if (validMax && validMin && (props.maxValue - props.minValue) % props.stepValue > 0 ) {
            message.push(`Step value is invalid, max - min (${props.maxValue} - ${props.minValue}) 
            should be evenly divisible by the step value ${props.stepValue}`);
        }

        return message.join(", ");
    }

    private validateValues(props: SliderProps): string {
        let message: string[] = [];
        if (!this.props.showRange) {
            if (props.value > props.maxValue) {
                message.push(`Value ${props.value} should not be greater than the maximum ${props.maxValue}`);
            }
            if (props.value < props.minValue) {
                message.push(`Value ${props.value} should not be less than the minimum ${props.minValue}`);
            }
        } else {
            if (props.lowerBound > props.maxValue) {
                message.push(`LowerBound ${props.lowerBound} should not be greater than the maximum ${props.maxValue}`);
            }
            if (props.lowerBound < props.minValue) {
                message.push(`LowerBound ${props.lowerBound} should not be less than the minimum ${props.minValue}`);
            }
            if (props.upperBound > props.maxValue) {
                message.push(`UpperBound ${props.upperBound} should not be greater than the maximum ${props.maxValue}`);
            }
            if (props.upperBound < props.minValue) {
                message.push(`UpperBound ${props.upperBound} should not be less than the minimum ${props.minValue}`);
            }
        }
        return message.join(", ");
    }

    private getTooltipText(value: number): string {
        if (this.props.value === undefined) {
            return "--";
        }
        const text = this.validateValues(this.props) ? this.props.value.toString() : value.toString();

        return this.props.tooltipText ? this.props.tooltipText.replace(/\{1}/, text) : text;
    }

    private showError(alertMessage: string | undefined): React.ReactNode {
        if (alertMessage && !this.props.disabled) {
            return createElement(ValidationAlert, { message: alertMessage });
        } else if (alertMessage) {
            console.log(alertMessage);
        }

        return null;
    }

    private getSliderProps() {
        const { maxValue, minValue, showRange, value, stepValue, lowerBound, upperBound } = this.props;
        const props: any = {
            disabled: !!this.validateSettings(this.props) || this.props.disabled,
            included: showRange,
            marks: this.calculateMarks(this.props),
            max: maxValue,
            min: minValue,
            onAfterChange: this.props.onClick,
            onChange: this.props.onChange,
            pushable: false,
            range: showRange,
            step: stepValue ? stepValue : null,
            tipFormatter: this.props.tooltipText ? this.getTooltipText : null,
            vertical: this.props.orientation === "vertical"
        }

        if (showRange) {
            const validLowerBound = typeof lowerBound === "number";
            const validUpperBound = typeof upperBound === "number";
            props.defaultValue = [
                validLowerBound ? lowerBound : this.isValidMinMax(props) ? (minValue + stepValue) : 1,
                validUpperBound ? upperBound : this.isValidMinMax(props) ? (maxValue - stepValue) : (100 - stepValue)
            ];
        } else {
            props.value = typeof value === "number" ? value : this.calculateDefaultValue(this.props)
        }

        return props;
    }
}
