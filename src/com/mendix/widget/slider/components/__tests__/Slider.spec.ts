import { ShallowWrapper, shallow } from "enzyme";
import { DOM, createElement } from "react";
import * as RcSlider from "rc-slider";

import { Slider as SliderComponent, SliderProps } from "../Slider";

import { ValidationAlert } from "../ValidationAlert";

describe("Slider", () => {
    let sliderProps: SliderProps;
    let slider: ShallowWrapper<SliderProps, any>;
    beforeEach(() => {
        sliderProps = {
            maxValue: 100,
            minValue: 0,
            orientation: "horizontal",
            disabled: false,
            value: 20,
            stepValue: 1,
            tooltipText: "{1}",
            noOfMarkers: 0,
            showRange: false,
            lowerBound: 20,
            upperBound: 40
        }
    }); //TODO: incorrect alignment on next line
const renderSlider = (props: SliderProps) => shallow(createElement(SliderComponent, props));

    it("renders the structure", () => {
        slider = renderSlider(sliderProps);

        expect(slider).toBeElement(
            DOM.div({ className: "widget-slider" },
                createElement(RcSlider, {
                    max: 100,
                    min: 0,
                    disabled: false,
                    value: 20,
                    step: 1,
                    tipFormatter: jasmine.any(Function) as any,
                    included: false,
                    vertical: false
                })
            )
        );
    });

    it("creates an horizontal slider when orientation is horizontal", () => { // TODO: when "THE" orientation
        slider = renderSlider(sliderProps);
        const RcSliderComponent = slider.find(RcSlider);

        expect(RcSliderComponent.props().vertical).toBe(false);
    });

    it("creates a vertical slider when orientation is vertical", () => { // TODO: Same here
        sliderProps.orientation = "vertical";
        slider = renderSlider(sliderProps);;
        const RcSliderComponent = slider.find(RcSlider);

        expect(RcSliderComponent.props().vertical).toBe(true);
    });

    it("logs all errors on console when disabled", () => { // TODO: on THE console
        spyOn(console, "log").and.callThrough();
        sliderProps.disabled = true;
        sliderProps.maxValue = null;

        slider = renderSlider(sliderProps); // TODO: Don't need the slider =

        expect(console.log).toHaveBeenCalledWith("Maximum value is required");
    });

    describe("shows an error when", () => { // TODO: when THE
        it("maximum value is not set", () => {
            sliderProps.maxValue = null;
            slider = renderSlider(sliderProps);
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Maximum value is required");
        });

        it("minimum value is not set", () => {
            sliderProps.minValue = null;
            slider = renderSlider(sliderProps);
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Minimum value is required");
        });

        it("minimum value is greater than or equal to maximum value", () => { // TODO: to THE maximimum
            sliderProps.minValue = 50;
            sliderProps.maxValue = 30;
            slider = renderSlider(sliderProps);
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Minimum value 50 should be less than the maximum value 30");
        });
    });

    describe("with a range interval shows an error when", () => { // TODO: when THE
        beforeEach(() => { sliderProps.showRange = true; });

        it("lower bound value is not set", () => {
            sliderProps.lowerBound = null;
            slider = renderSlider(sliderProps);
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Lower bound value is required");
        });

        it("lower bound value is less than the minimum value", () => {
            sliderProps.lowerBound = -5;
            slider = renderSlider(sliderProps);
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Lower bound -5 should not be less than the minimum 0");
        });

        it("lower bound value is greater than maximum value", () => { // TODO: than THE
            sliderProps.lowerBound = 50;
            sliderProps.maxValue = 30;
            sliderProps.upperBound = 30;
            slider = renderSlider(sliderProps);
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Lower bound 50 should not be greater than the maximum 30");
        });

        it("upper bound value is not set", () => {
            sliderProps.upperBound = null;
            slider = renderSlider(sliderProps);
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Upper bound value is required");
        });

        it("upper bound value is less than the minimum value", () => {
            sliderProps.upperBound = -5;
            slider = renderSlider(sliderProps);
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Upper bound -5 should not be less than the minimum 0");
        });

        it("upper bound value is greater than maximum value", () => { // TODO: than THE
            sliderProps.upperBound = 130;
            slider = renderSlider(sliderProps);
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Upper bound 130 should not be greater than the maximum 100");
        });
    });

    describe("without a range interval", () => {
        it("renders a slider with given value", () => { // TODO: with THE
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().value).toBe(sliderProps.value);
        });

        it("renders slider with calculated default value when value is undefined", () => { // TODO: when THE
            sliderProps.value = undefined;
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().value).toBe((sliderProps.maxValue - sliderProps.minValue)/2);
        });

        it("shows an error when value is greater than maximum value", () => { // TODO: correct as above... in 2 places
            sliderProps.value = 150;
            slider = renderSlider(sliderProps);
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Value 150 should not be greater than the maximum 100");
        });

        it("shows an error when value is less than minimum value", () => { // TODO: same as above
            sliderProps.value = -10;
            slider = renderSlider(sliderProps);
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Value -10 should not be less than the minimum 0");
        });
    });

    describe("with step value shows an error", () => { // TODO: with the step value specified...
        it("when step value is equal to 0", () => { // TODO: when THE
            sliderProps.stepValue = 0;
            slider = renderSlider(sliderProps);
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Step value 0 should be greater than 0");
        });

        it("when step value is less than 0", () => { // TODO: same as above
            sliderProps.stepValue = -10;
            slider = renderSlider(sliderProps);
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Step value -10 should be greater than 0");
        });

        it("when step value does not evenly divide (maximum - minimum)", () => { // TODO: same as above
            sliderProps.stepValue = 6;
            slider = renderSlider(sliderProps);
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe(`Step value is invalid, max - min (100 - 0) 
            should be evenly divisible by the step value 6`);
        });
    });

    describe("with marker value", () => { // TODO: with THE marker value
        it("less than 2 renders no markers", () => {
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().marks).toEqual({ });
        });

        it("greater than 2 renders markers on the slider", () => {
            sliderProps.noOfMarkers = 5;
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().marks).toEqual({ 0: 0, 25: 25, 50: 50, 75: 75, 100: 100 });
        });
    });

    describe("with tooltip", () => { // TODO: with A
        it("renders a tooltip title with the correct text", () => {
            sliderProps.tooltipText = "Slider";
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect((RcSliderComponent.props() as any).tipFormatter(sliderProps.tooltipText)).toBe("Slider");
        });

        it("renders a tooltip with '--' when no value is specified", () => {
            sliderProps.value = undefined // TODO: semi-colon
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect((RcSliderComponent.props() as any).tipFormatter(sliderProps.tooltipText)).toBe("--");
        });

        it("renders no tooltip title when value is empty string", () => { // TODO: shouldn't it be the same as above??
            sliderProps.tooltipText = "";
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().tipFormatter).toBeNull();
        });

        it("with a tooltipText template renders a tooltip with the substituted value", () => {
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect((RcSliderComponent.props() as any).tipFormatter(sliderProps.value)).toBe(`${sliderProps.value}`);
        });
    });
});
