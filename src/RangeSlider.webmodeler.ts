import { Component, createElement } from "react";
import { RangeSlider, RangeSliderProps } from "./components/RangeSlider";
import RangeSliderContainer, { RangeSliderContainerProps } from "./components/RangeSliderContainer";

declare function require(name: string): string;

// tslint:disable-next-line:class-name
export class preview extends Component<RangeSliderContainerProps, {}> {
    render() {
        const warnings = RangeSliderContainer.validateSettings({
            lowerBoundValue: 20,
            maximumValue: 100,
            minimumValue: 0,
            stepValue: this.props.stepValue,
            upperBoundValue: 50
        });

        return createElement(RangeSlider, this.transformProps(this.props, warnings));
    }

    private transformProps(props: RangeSliderContainerProps, warnings: string): RangeSliderProps {
        return {
            alertMessage: warnings,
            bootstrapStyle: props.bootstrapStyle,
            className: props.class,
            decimalPlaces: props.decimalPlaces,
            disabled: false,
            lowerBound: 20,
            maxValue: 100,
            minValue: 0,
            noOfMarkers: props.noOfMarkers,
            stepValue: props.stepValue <= 0 ? 10 : props.stepValue,
            style: RangeSliderContainer.parseStyle(props.style),
            tooltipText: props.tooltipText,
            upperBound: 50
        };
    }
}

export function getPreviewCss() {
    return (
        require("./ui/RangeSlider.scss") + require("rc-slider/dist/rc-slider.css")
    );
}
