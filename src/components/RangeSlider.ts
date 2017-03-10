import { Component, createElement, DOM } from "react";

import * as classNames from "classnames";
import * as RcSlider from "rc-slider";

import "rc-slider/dist/rc-slider.css";
import "../ui/RangeSlider.css";

import { Alert } from "./Alert";

export interface RangeSliderProps {
    noOfMarkers?: number;
    maxValue?: number;
    minValue?: number;
    alertMessage?: string;
    onChange?: (value: number) => void;
    onUpdate?: (value: number | number[]) => void;
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

export class RangeSlider extends Component<RangeSliderProps, {}> {
    static defaultProps: RangeSliderProps = {
        disabled: false,
        maxValue: 100,
        minValue: 0,
        noOfMarkers: 2,
        tooltipText: "{1}"
    };

    constructor(props: RangeSliderProps) {
        super(props);

        this.getTooltipText = this.getTooltipText.bind(this);
    }

    render() {
        const { alertMessage, maxValue, minValue, stepValue, lowerBound, upperBound } = this.props;
        let validLowerBound = 0;
        let validUpperBound = 0;
        if (typeof minValue === "number" && typeof maxValue === "number" && typeof stepValue === "number") {
            validLowerBound = typeof lowerBound === "number"
                ? lowerBound
                : this.isValidMinMax(this.props) ? (minValue + stepValue) : 1;
            validUpperBound = typeof upperBound === "number"
                ? upperBound
                : this.isValidMinMax(this.props) ? (maxValue - stepValue) : (100 - stepValue);
        }
        return DOM.div({ className: classNames("widget-slider", { "has-error": !!alertMessage }) },
            createElement(RcSlider, {
                defaultValue: [ validLowerBound, validUpperBound ],
                disabled: this.props.disabled,
                included: true,
                marks: this.calculateMarks(this.props),
                max: maxValue,
                min: minValue,
                onAfterChange: this.props.onChange,
                onChange: this.props.onUpdate,
                pushable: false,
                range: true,
                step: stepValue,
                tipFormatter: this.props.tooltipText ? this.getTooltipText : null,
                value: [ validLowerBound, validUpperBound ]
            }),
            alertMessage && !this.props.disabled ? createElement(Alert, { message: alertMessage }) : null
        );
    }

    private calculateMarks(props: RangeSliderProps): Marks {
        const marks: Marks = {};
        const { noOfMarkers, maxValue, minValue } = props;
        if (typeof noOfMarkers === "number" && typeof maxValue === "number" && typeof minValue === "number") {
            if (this.isValidMinMax(props) && noOfMarkers >= 2) {
                const interval = (maxValue - minValue) / (noOfMarkers - 1);
                for (let i = 0; i < noOfMarkers; i++) {
                    const value = parseFloat((minValue + (i * interval)).toFixed(props.decimalPlaces));
                    marks[value] = value;
                }
            }
        }

        return marks;
    }

    private isValidMinMax(props: RangeSliderProps): boolean {
        const { maxValue, minValue } = props;
        return typeof maxValue === "number" && typeof minValue === "number" && minValue < maxValue;
    }

    private getTooltipText(value: number): string {
        if (this.props.lowerBound === undefined || this.props.upperBound === undefined) {
            return "--";
        }

        return this.props.tooltipText ? this.props.tooltipText.replace(/\{1}/, value.toString()) : value.toString();
    }
}
