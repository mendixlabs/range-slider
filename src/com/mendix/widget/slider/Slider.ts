import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Slider as SliderComponent } from "./components/Slider";

class Slider extends WidgetBase {
    // Properties from Mendix modeler
    valueAttribute: string;
    maxValue: number;
    maxAttribute: string;
    minValue: number;
    minAttribute: string;
    onClickMicroflow: string;
    stepValue: number;
    stepAttribute: string;
    noOfMarkers: number;
    orientation: "horizontal" | "vertical";
    tooltipText: string;
    showRange: boolean;

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
        const disabled = !this.contextObject || this.readOnly || this.contextObject.isReadonlyAttr(this.stepAttribute);
        render(createElement(SliderComponent, {
            disabled,
            hasError: !!validationMessage,
            noOfMarkers: this.noOfMarkers,
            maxValue: this.getAttributeValue(this.maxAttribute, this.maxValue),
            minValue: this.getAttributeValue(this.minAttribute, this.minValue),
            onClick : this.onClick,
            onChange: this.onChange,
            orientation: this.orientation,
            showRange: this.showRange,
            stepValue: this.getAttributeValue(this.stepAttribute, this.stepValue),
            tooltipText: this.tooltipText,
            value: this.getAttributeValue(this.valueAttribute),
            validationMessage
        }), this.domNode);
    }

    private getAttributeValue(attributeName: string, defaultValue?: number): number {
        if (this.contextObject && attributeName) {
            if (this.contextObject.get(attributeName)) {
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
            this.contextObject.set(this.valueAttribute, value);
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
                error: error =>
                    window.mx.ui.error(`An error occurred while executing microflow: ${error.message}`, true),
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

            this.subscribeAttributes([ this.valueAttribute, this.minAttribute, this.maxAttribute, this.stepAttribute ]);

            this.subscribe({
                callback: validations => this.handleValidation(validations),
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
    let result: any = {};
    for (let property in Source.prototype) {
        if (property !== "constructor" && Source.prototype.hasOwnProperty(property)) {
            result[property] = Source.prototype[property];
        }
    }
    return result;
}(Slider));
