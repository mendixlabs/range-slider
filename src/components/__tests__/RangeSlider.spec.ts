import { shallow, ShallowWrapper } from "enzyme";
import { createElement, DOM } from "react";

import * as RcSlider from "rc-slider";

import { Slider as SliderComponent, SliderProps } from "../RangeSlider";

import { Alert } from "../Alert";

describe("RangeSlider", () => {
    let sliderProps: SliderProps;
    let rangeSlider: ShallowWrapper<SliderProps, any>;
    const upperBound = 40;
    const maxValue = 100;
    const lowerBound = 20;
    const minValue = 0;
    const stepValue = 1;
    const noOfMarkers = 0;
    beforeEach(() => {
        sliderProps = {
            disabled: false,
            lowerBound,
            maxValue,
            minValue,
            noOfMarkers,
            stepValue,
            tooltipText: "{1}",
            upperBound
        };
    });
    const renderSlider = (props: SliderProps) => shallow(createElement(SliderComponent, props));

    it("renders the structure", () => {
        rangeSlider = renderSlider(sliderProps);

        expect(rangeSlider).toBeElement(
            DOM.div({ className: "widget-slider" },
                createElement(RcSlider, {
                    defaultValue: [ lowerBound, upperBound ],
                    disabled: false,
                    included: true,
                    max: maxValue,
                    min: minValue,
                    range: true,
                    step: stepValue,
                    tipFormatter: jasmine.any(Function) as any,
                    vertical: false
                })
            )
        );
    });

    describe("shows an error when the", () => {
        it("maximum value is not set", () => {
            sliderProps.maxValue = null;
            rangeSlider = renderSlider(sliderProps);
            const alert = rangeSlider.find(Alert);

            expect(alert.props().message).toBe("Maximum value is required");
        });

        it("minimum value is not set", () => {
            sliderProps.minValue = null;
            rangeSlider = renderSlider(sliderProps);
            const alert = rangeSlider.find(Alert);

            expect(alert.props().message).toBe("Minimum value is required");
        });

        it("minimum value is greater than or equal to the maximum value", () => {
            sliderProps.minValue = 50;
            sliderProps.maxValue = 30;
            rangeSlider = renderSlider(sliderProps);
            const alert = rangeSlider.find(Alert);

            expect(alert.props().message).toBe(
                `Minimum value ${sliderProps.minValue} should be less than the maximum value ${sliderProps.maxValue}`
            );
        });

        it("lower bound value is not set", () => {
            sliderProps.lowerBound = null;
            rangeSlider = renderSlider(sliderProps);
            const alert = rangeSlider.find(Alert);

            expect(alert.props().message).toBe("Lower bound value is required");
        });

        it("lower bound value is less than the minimum value", () => {
            sliderProps.lowerBound = -5;
            rangeSlider = renderSlider(sliderProps);
            const alert = rangeSlider.find(Alert);

            expect(alert.props().message).toBe(
                `Lower bound ${sliderProps.lowerBound} should be greater than the minimum ${sliderProps.minValue}`
            );
        });

        it("lower bound value is greater than the maximum value", () => {
            sliderProps.lowerBound = 50;
            sliderProps.maxValue = 30;
            sliderProps.upperBound = 30;
            rangeSlider = renderSlider(sliderProps);
            const alert = rangeSlider.find(Alert);

            expect(alert.props().message).toBe(
                `Lower bound ${sliderProps.lowerBound} should be less than the maximum ${sliderProps.maxValue}`
            );
        });

        it("upper bound value is not set", () => {
            sliderProps.upperBound = null;
            rangeSlider = renderSlider(sliderProps);
            const alert = rangeSlider.find(Alert);

            expect(alert.props().message).toBe("Upper bound value is required");
        });

        it("upper bound value is less than the minimum value", () => {
            sliderProps.upperBound = -5;
            rangeSlider = renderSlider(sliderProps);
            const alert = rangeSlider.find(Alert);

            expect(alert.props().message).toBe(
                `Upper bound ${sliderProps.upperBound} should be greater than the minimum ${sliderProps.minValue}`
            );
        });

        it("upper bound value is greater than the maximum value", () => {
            sliderProps.upperBound = 130;
            rangeSlider = renderSlider(sliderProps);
            const alert = rangeSlider.find(Alert);

            expect(alert.props().message).toBe(
                `Upper bound ${sliderProps.upperBound} should be less than the maximum ${sliderProps.maxValue}`
            );
        });
    });

    describe("with the step value specified shows an error", () => {
        it("when the step value is equal to 0", () => {
            sliderProps.stepValue = 0;
            rangeSlider = renderSlider(sliderProps);
            const alert = rangeSlider.find(Alert);

            expect(alert.props().message).toBe("Step value 0 should be greater than 0");
        });

        it("when the step value is less than 0", () => {
            sliderProps.stepValue = -10;
            rangeSlider = renderSlider(sliderProps);
            const alert = rangeSlider.find(Alert);

            expect(alert.props().message).toBe("Step value -10 should be greater than 0");
        });

        it("when the step value does not evenly divide (maximum - minimum)", () => {
            sliderProps.stepValue = 6;
            rangeSlider = renderSlider(sliderProps);
            const alert = rangeSlider.find(Alert);

            expect(alert.props().message).toBe(`Step value is invalid, max - min (100 - 0) 
            should be evenly divisible by the step value 6`);
        });
    });

    describe("with the marker value", () => {
        it("less than 2 renders no markers", () => {
            rangeSlider = renderSlider(sliderProps);
            const RcSliderComponent = rangeSlider.find(RcSlider);

            expect(RcSliderComponent.props().marks).toEqual({});
        });

        it("greater than 2 renders markers on the slider", () => {
            sliderProps.noOfMarkers = 5;
            rangeSlider = renderSlider(sliderProps);
            const RcSliderComponent = rangeSlider.find(RcSlider);

            expect(RcSliderComponent.props().marks).toEqual({ 0: 0, 25: 25, 50: 50, 75: 75, 100: 100 });
        });
    });

    describe("with a tooltip", () => {
        it("renders a tooltip title with the correct text", () => {
            sliderProps.tooltipText = "RangeSlider";
            rangeSlider = renderSlider(sliderProps);
            const RcSliderComponent = rangeSlider.find(RcSlider);

            expect((RcSliderComponent.props() as any).tipFormatter(sliderProps.tooltipText)).toBe("RangeSlider");
        });

        it("renders a tooltip with '--' when no lower bound value is specified", () => {
            sliderProps.lowerBound = undefined;
            rangeSlider = renderSlider(sliderProps);
            const RcSliderComponent = rangeSlider.find(RcSlider);

            expect((RcSliderComponent.props() as any).tipFormatter(sliderProps.tooltipText)).toBe("--");
        });

        it("renders a tooltip with '--' when no upper bound value is specified", () => {
            sliderProps.upperBound = undefined;
            rangeSlider = renderSlider(sliderProps);
            const RcSliderComponent = rangeSlider.find(RcSlider);

            expect((RcSliderComponent.props() as any).tipFormatter(sliderProps.tooltipText)).toBe("--");
        });

        it("renders no tooltip title when value is empty", () => {
            sliderProps.tooltipText = "";
            rangeSlider = renderSlider(sliderProps);
            const RcSliderComponent = rangeSlider.find(RcSlider);

            expect(RcSliderComponent.props().tipFormatter).toBeNull();
        });

        it("with a tooltipText template renders a tooltip with the substituted value", () => {
            rangeSlider = renderSlider(sliderProps);
            const RcSliderComponent = rangeSlider.find(RcSlider);

            expect((RcSliderComponent.props() as any).tipFormatter(sliderProps.lowerBound)).toBe(
                `${sliderProps.lowerBound}`
            );
        });
    });
});
