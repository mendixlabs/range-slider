import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Slider as SliderComponent } from "./components/Slider";

class Slider extends WidgetBase {
    // Properties from Mendix modeler
    valueAttribute: string;
    lowerBoundAttribute: string;
    upperBoundAttribute: string;
    maxAttribute: string;
    minAttribute: string;
    onClickMicroflow: string;
    stepValue: number;
    stepAttribute: string;
    noOfMarkers: number;
    tooltipText: string;
    showRange: boolean;
    decimalPlaces: number;

    private contextObject: mendix.lib.MxObject;

    postCreate() {
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    update(contextObject: mendix.lib.MxObject, callback?: Function) {
        this.contextObject = contextObject;
        this.resetSubscriptions();
        this.updateRendering();

        if (callback) {
            callback();
        }
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);

        return true;
    }

    private updateRendering(validationMessage?: string) {
        const disabled = !this.contextObject
            || this.readOnly
            || !!(this.stepAttribute && this.contextObject.isReadonlyAttr(this.stepAttribute));
        render(createElement(SliderComponent, {
            decimalPlaces: this.decimalPlaces,
            disabled,
            hasError: !!validationMessage,
            lowerBound: this.getAttributeValue(this.lowerBoundAttribute),
            maxValue: this.getAttributeValue(this.maxAttribute),
            minValue: this.getAttributeValue(this.minAttribute),
            noOfMarkers: this.noOfMarkers,
            onChange: this.onChange,
            onClick : this.onClick,
            showRange: this.showRange,
            stepValue: this.getAttributeValue(this.stepAttribute, this.stepValue),
            tooltipText: this.tooltipText,
            upperBound: this.getAttributeValue(this.upperBoundAttribute),
            value: this.getAttributeValue(this.valueAttribute),
            validationMessage
        }), this.domNode);
    }

    private getAttributeValue(attributeName: string, defaultValue?: number): number | undefined {
        if (this.contextObject && attributeName) {
            if (this.contextObject.get(attributeName) !== "") {
                return parseFloat(this.contextObject.get(attributeName) as string);
            }
        }

        return defaultValue;
    }

    private handleValidation(validations: mendix.lib.ObjectValidation[]) {
        const validationMessage = validations[0].getErrorReason(this.valueAttribute);
        if (validationMessage) {
            this.updateRendering(validationMessage);
        }
    }

    private onChange(value: number) {
        if ((value || value === 0) && !this.showRange) {
            if (value > this.getAttributeValue(this.maxAttribute)) {
                this.contextObject.set(this.valueAttribute, this.getAttributeValue(this.maxAttribute));
            } else {
                this.contextObject.set(this.valueAttribute, value);
            }
        } else if (Array.isArray(value)) {
            if (value[0] !== this.getAttributeValue(this.lowerBoundAttribute, 0)) {
                this.contextObject.set(this.lowerBoundAttribute, value[0]);
            } else {
                if (value[1] > this.getAttributeValue(this.maxAttribute)) {
                    this.contextObject.set(this.upperBoundAttribute, this.getAttributeValue(this.maxAttribute));
                } else {
                    this.contextObject.set(this.upperBoundAttribute, value[1]);
                }

            }
        }
    }

    private onClick(value: number) {
        if (value || value === 0) {
            this.executeAction(this.onClickMicroflow, [ this.contextObject.getGuid() ]);
        }
    }

    private executeAction(actionname: string, guids: string[]) {
        if (actionname) {
            window.mx.ui.action(actionname, {
                error: (error) => this.updateRendering(`An error occurred while executing microflow: ${error.message}`),
                params: {
                    applyto: "selection",
                    guids
                }
            });
        }
    }

    private resetSubscriptions() {
        this.unsubscribeAll();

        if (this.contextObject) {
            this.subscribe({
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });

            this.subscribeAttributes([ this.valueAttribute, this.minAttribute, this.maxAttribute, this.stepAttribute,
                this.lowerBoundAttribute, this.upperBoundAttribute ]);

            this.subscribe({
                callback: (validations) => this.handleValidation(validations),
                guid: this.contextObject.getGuid(),
                val: true
            });
        }
    }

    private subscribeAttributes(attributes: string[]) {
        attributes.forEach((attribute) =>
            this.subscribe({
                attr: attribute,
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            })
        );
    }
}

// tslint:disable : only-arrow-functions
dojoDeclare("com.mendix.widget.slider.Slider", [ WidgetBase ], function(Source: any) {
    const result: any = {};
    for (const property in Source.prototype) {
        if (property !== "constructor" && Source.prototype.hasOwnProperty(property)) {
            result[property] = Source.prototype[property];
        }
    }
    return result;
}(Slider));
