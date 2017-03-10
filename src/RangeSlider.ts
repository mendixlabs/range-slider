import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { RangeSliderContainer } from "./components/RangeSliderContainer";

class RangeSlider extends WidgetBase {
    // Properties from Mendix modeler
    lowerBoundAttribute: string;
    upperBoundAttribute: string;
    maxAttribute: string;
    minAttribute: string;
    onChangeMicroflow: string;
    stepValue: number;
    stepAttribute: string;
    noOfMarkers: number;
    tooltipText: string;
    decimalPlaces: number;

    update(contextObject: mendix.lib.MxObject, callback?: Function) {
        this.updateRendering(contextObject);

        if (callback) {
            callback();
        }
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);

        return true;
    }

    private updateRendering(contextObject: mendix.lib.MxObject) {
        render(createElement(RangeSliderContainer, {
            contextObject,
            decimalPlaces: this.decimalPlaces,
            lowerBoundAttribute: this.lowerBoundAttribute,
            maximumAttribute: this.maxAttribute,
            minimumAttribute: this.minAttribute,
            noOfMarkers: this.noOfMarkers,
            onChangeMicroflow: this.onChangeMicroflow,
            readOnly: this.readOnly,
            stepAttribute: this.stepAttribute,
            stepValue: this.stepValue,
            tooltipText: this.tooltipText,
            upperBoundAttribute: this.upperBoundAttribute
        }), this.domNode);
    }
}

// tslint:disable : only-arrow-functions
dojoDeclare("com.mendix.widget.custom.RangeSlider.RangeSlider", [ WidgetBase ], function(Source: any) {
    const result: any = {};
    for (const property in Source.prototype) {
        if (property !== "constructor" && Source.prototype.hasOwnProperty(property)) {
            result[property] = Source.prototype[property];
        }
    }
    return result;
}(RangeSlider));
