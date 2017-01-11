import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Slider as SliderComponent } from "./components/Slider";

class Slider extends WidgetBase {
    // Properties from Mendix modeler
    valueAttribute: string;
    max: number;
    maxAttribute: string;
    min: number;
    minAttribute: string;
    onAfterChangeMicroflow: string;
    step: number;
    stepAttribute: string;
    markers: number;
    orientation: "horizontal" | "vertical";
    tooltipTitle: string;

    private contextObject: mendix.lib.MxObject;

    postCreate() {
        this.onAfterChange = this.onAfterChange.bind(this);
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
        logger.debug(this.id + ".updateRendering");
        const disabled = !this.contextObject || this.readOnly ||
            this.contextObject.isReadonlyAttr(this.stepAttribute);
        render(createElement(SliderComponent, {
            disabled,
            hasError: !!validationMessage,
            markers: this.markers,
            max: this.getAttributeValue(this.maxAttribute, this.max),
            min: this.getAttributeValue(this.minAttribute, this.min),
            onAfterChange : this.onAfterChange,
            onChange: this.onChange,
            orientation: this.orientation,
            step: this.getAttributeValue(this.stepAttribute, this.step),
            tooltipTitle: this.tooltipTitle,
            value: this.getAttributeValue(this.valueAttribute),
            validationMessage
        }), this.domNode);
    }

    private getAttributeValue(attributeName: string, defaultValue?: number): number {
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
        if (typeof value !== "undefined") {
            this.contextObject.set(this.valueAttribute, value);
        }
    }

    private onAfterChange(value: number) {
        if (typeof value !== "undefined") {
            this.executeAction(this.onAfterChangeMicroflow, [ this.contextObject.getGuid() ]);
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

            this.subscribeAttribute(this.valueAttribute);
            this.subscribeAttribute(this.minAttribute);
            this.subscribeAttribute(this.maxAttribute);
            this.subscribeAttribute(this.stepAttribute);

            this.subscribe({
                callback: validations => this.handleValidation(validations),
                guid: this.contextObject.getGuid(),
                val: true
            });
        }
    }

    private subscribeAttribute(attribute: string) {
        this.subscribe({
            attr: attribute,
            callback: () => this.updateRendering(),
            guid: this.contextObject.getGuid()
        });
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
