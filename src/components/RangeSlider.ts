import { Component, createElement, DOM, ReactNode } from "react";

import * as classNames from "classnames";
import * as RcSlider from "rc-slider";
import * as Tooltip from "rc-tooltip";

import "rc-slider/dist/rc-slider.css";
import "../ui/RangeSlider.scss";

import { Alert } from "./Alert";

interface TooltipProps {
    value: number;
    className: string;
    vertical: boolean;
    offset: number;
    index: number;
}

interface RangeSliderProps {
    bootstrapStyle?: BootstrapStyle;
    noOfMarkers?: number;
    maxValue?: number;
    minValue?: number;
    alertMessage?: string;
    onChange?: (value: number) => void;
    onUpdate?: (value: number | number[]) => void;
    stepValue?: number;
    tooltipText?: string | null;
    disabled: boolean;
    lowerBound?: number;
    upperBound?: number;
    decimalPlaces?: number;
}

type BootstrapStyle = "primary" | "inverse" | "success" | "info" | "warning" | "danger";

class RangeSlider extends Component<RangeSliderProps, {}> {
    static defaultProps: RangeSliderProps = {
        disabled: false,
    };

    render() {
        const { alertMessage, maxValue, minValue, stepValue, lowerBound, upperBound, tooltipText } = this.props;
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
        return DOM.div({
            className: classNames(
                "widget-range-slider",
                `widget-range-slider-${this.props.bootstrapStyle}`,
                { "has-error": !!alertMessage }
            )
        },
            createElement(RcSlider.Range, {
                defaultValue: [validLowerBound, validUpperBound],
                disabled: this.props.disabled,
                handle: tooltipText ? this.createTooltip(tooltipText) : undefined,
                included: true,
                marks: this.calculateMarks(this.props),
                max: maxValue,
                min: minValue,
                onAfterChange: this.props.onChange,
                onChange: this.props.onUpdate,
                pushable: false,
                step: stepValue,
                value: [validLowerBound, validUpperBound]
            }),
            alertMessage && !this.props.disabled ? createElement(Alert, { message: alertMessage }) : null
        );
    }
    
    private calculateMarks(props: RangeSliderProps): RcSlider.Marks {
        const marks: RcSlider.Marks = {};
        const { noOfMarkers, maxValue, minValue } = props;
        if (typeof noOfMarkers === "number" && typeof maxValue === "number" && typeof minValue === "number") {
            if (this.isValidMinMax(props) && noOfMarkers >= 2) {
                const interval = (maxValue - minValue) / (noOfMarkers - 1);
                for (let i = 0; i < noOfMarkers; i++) {
                    const value = parseFloat((minValue + (i * interval)).toFixed(props.decimalPlaces));
                    marks[value] = value.toString();
                }
            }
        }

        return marks;
    }

    private isValidMinMax(props: RangeSliderProps): boolean {
        const { maxValue, minValue } = props;
        return typeof maxValue === "number" && typeof minValue === "number" && minValue < maxValue;
    }

    private createTooltip(text: string): (props: TooltipProps) => ReactNode {
        return (props) => {
            const sliderText = (this.props.lowerBound === undefined || this.props.upperBound === undefined)
                ? "--"
                : text.replace(/\{1}/, props.value.toString());

            return createElement(Tooltip,
                {
                    mouseLeaveDelay: 0,
                    overlay: DOM.div(null, sliderText),
                    placement: "top",
                    prefixCls: "rc-slider-tooltip",
                    trigger: [ "hover", "click", "focus" ]
                },
                createElement(RcSlider.Handle, {
                    className: props.className,
                    key: props.index,
                    offset: props.offset,
                    vertical: props.vertical
                })
            );
        };
    }
}

export { BootstrapStyle, RangeSlider, RangeSliderProps };
