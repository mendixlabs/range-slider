import { Component, createElement } from "react";
import { RangeSlider, RangeSliderProps } from "./components/RangeSlider";
import RangeSliderContainer, { RangeSliderContainerProps } from "./components/RangeSliderContainer";

import * as css from "./ui/RangeSlider.scss";
import * as rcsliderCss from "rc-slider/dist/rc-slider.css";

// tslint:disable-next-line:class-name
export class preview extends Component<RangeSliderContainerProps, {}> {
    private warnings: string;

    componentWillMount() {
        this.addPreviewStyle(css, "widget-range-slider-preview-style");
        this.addPreviewStyle(rcsliderCss, "widget-rcslider-preview-style");
    }

    render() {
        this.warnings = RangeSliderContainer.validateSettings({
            lowerBoundValue: 20,
            maximumValue: 100,
            minimumValue: 0,
            stepValue: this.props.stepValue,
            upperBoundValue: 50
        });

        return createElement(RangeSlider, this.transformProps(this.props));
    }

    private transformProps(props: RangeSliderContainerProps): RangeSliderProps {
        return {
            alertMessage: this.warnings,
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

    private addPreviewStyle(styleClass: string, styleId: string) {
        // This workaround is to load style in the preview temporary till mendix has a better solution
        const iFrame = document.getElementsByClassName("t-page-editor-iframe")[0] as HTMLIFrameElement;
        const iFrameDoc = iFrame.contentDocument;
        if (!iFrameDoc.getElementById(styleId)) {
            const styleTarget = iFrameDoc.head || iFrameDoc.getElementsByTagName("head")[0];
            const styleElement = document.createElement("style");
            styleElement.setAttribute("type", "text/css");
            styleElement.setAttribute("id", styleId);
            styleElement.appendChild(document.createTextNode(styleClass));
            styleTarget.appendChild(styleElement);
        }
    }
}
