import { shallow, ShallowWrapper } from "enzyme";
import { createElement, DOM } from "react";

import * as RcSlider from "rc-slider";

import { RangeSlider, RangeSliderProps } from "../RangeSlider";

describe("RangeSlider", () => {
    let sliderProps: RangeSliderProps;
    let rangeSlider: ShallowWrapper<RangeSliderProps, any>;
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
    const renderSlider = (props: RangeSliderProps) => shallow(createElement(RangeSlider, props));

    it("renders the structure", () => {
        rangeSlider = renderSlider(sliderProps);

        expect(rangeSlider).toBeElement(
            DOM.div({ className: "widget-range-slider" },
                createElement(RcSlider.Range, {
                    defaultValue: [ lowerBound, upperBound ],
                    disabled: false,
                    included: true,
                    max: maxValue,
                    min: minValue,
                    step: stepValue,
                    tipFormatter: jasmine.any(Function) as any,
                    value: [ lowerBound, upperBound ],
                    vertical: false
                })
            )
        );
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
