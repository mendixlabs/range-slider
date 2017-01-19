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
            tooltipText: null,
            noOfMarkers: 0,
            showRange: false,
            lowerBound: 20,
            upperBound: 40
        }
    });

    it("renders the structure", () => {
        slider = shallow(createElement(SliderComponent, sliderProps));

        expect(slider).toBeElement(
            DOM.div({ className: "widget-slider" },
                createElement(RcSlider, {
                    max: 100,
                    min: 0,
                    disabled: false,
                    value: 20,
                    step: 1,
                    tipFormatter: null,
                    included: false,
                    vertical: false
                })
            )
        );
    });

    it("creates an horizontal slider", () => {
        slider = shallow(createElement(SliderComponent, sliderProps));
        const RcSliderComponent = slider.find(RcSlider);

        expect(RcSliderComponent.props().vertical).toBe(false);
    });

    it("creates a vertical slider", () => {
        sliderProps.orientation = "vertical";
        slider = shallow(createElement(SliderComponent, sliderProps));
        const RcSliderComponent = slider.find(RcSlider);

        expect(RcSliderComponent.props().vertical).toBe(true);
    });

    it("logs an error on console when disable is true", () => {
        spyOn(console, "log").and.callThrough();
        sliderProps.disabled = true;
        sliderProps.maxValue = null;

        slider = shallow(createElement(SliderComponent, sliderProps));

        expect(console.log).toHaveBeenCalledWith("Maximum value is required");
    });

    describe("with a range shows an error when", () => {
        it("lower bound value is not set", () => {
            sliderProps.lowerBound = null;
            sliderProps.showRange = true;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Lower Bound value is required");
        });

        it("Lower Bound value is less than the minimum value", () => {
            sliderProps.lowerBound = -5;
            sliderProps.showRange = true;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("LowerBound -5 should not be less than the minimum 0");
        });

        it("Lower Bound value is greater than maximum value", () => {
            sliderProps.lowerBound = 50;
            sliderProps.maxValue = 30;
            sliderProps.upperBound = 30;
            sliderProps.showRange = true;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("LowerBound 50 should not be greater than the maximum 30");
        });

        it("upper bound value is not set", () => {
            sliderProps.upperBound = null;
            sliderProps.showRange = true;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Upper Bound value is required");
        });

        it("Upper bound value is less than the minimum value", () => {
            sliderProps.upperBound = -5;
            sliderProps.showRange = true;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("UpperBound -5 should not be less than the minimum 0");
        });

        it("Upper bound value is greater than maximum value", () => {
            sliderProps.upperBound = 130;
            sliderProps.showRange = true;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("UpperBound 130 should not be greater than the maximum 100");
        });
    });

    describe("without a range shows an error when", () => {
        it("maximum value is not set", () => {
            sliderProps.maxValue = null;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Maximum value is required");
        });

        it("minimum value is not set", () => {
            sliderProps.minValue = null;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Minimum value is required");
        });

        it("minimum value is greater than or equal to maximum value", () => {
            sliderProps.minValue = 50;
            sliderProps.maxValue = 30;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Minimum value 50 should be less than the maximum value 30");
        });
    });

    describe("with value", () => {
        it("creates a slider with given value", () => {
            slider = shallow(createElement(SliderComponent, sliderProps));
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().value).toBe(20);
        });

        it("of undefined renders slider with calculated default value", () => {
            sliderProps.value = undefined;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().value).toBe(50);
        });

        it("greater than maximum value it shows an error", () => {
            sliderProps.value = 150;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Value 150 should not be greater than the maximum 100");
        });

        it("less than minimum value it shows an error", () => {
            sliderProps.value = -10;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Value -10 should not be less than the minimum 0");
        });
    });

    describe("with step value", () => {
        it("greater than 0 it does not show an error", () => {
            slider = shallow(createElement(SliderComponent, sliderProps));
            const hasError = slider.find(".has-error");
            const alert = slider.find(ValidationAlert);

            expect(hasError.length).toBe(0);
            expect(alert.length).toBe(0);
        });

        it("does not fix equally between minimum and maximum it shows an error", () => {
            sliderProps.stepValue = 6;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe(`Step value is invalid, max - min (100 - 0) 
            should be evenly divisible by the step value 6`);
        });

        it("less than 0 it shows an error", () => {
            sliderProps.stepValue = -10;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Step value -10 should be greater than 0");
        });

        it("equal to 0 it shows an error", () => {
            sliderProps.stepValue = 0;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const alert = slider.find(ValidationAlert);

            expect(alert.props().message).toBe("Step value 0 should be greater than 0");
        });
    });

    describe("with markers", () => {
        it("less than 2 it shows no makers", () => {
            slider = shallow(createElement(SliderComponent, sliderProps));
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().marks).toEqual({ });
        });

        it("greater than 2 it shows markers on the slider", () => {
            sliderProps.noOfMarkers = 5;
            slider = shallow(createElement(SliderComponent, sliderProps));
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().marks).toEqual({ 0: 0, 25: 25, 50: 50, 75: 75, 100: 100 });
        });
    });

    describe("tooltip with", () => {
        it("title renders tooltip title with that title", () => {
            sliderProps.tooltipText = "Slider";
            slider = shallow(createElement(SliderComponent, sliderProps));
            const RcSliderComponent = slider.find(RcSlider);

            expect((RcSliderComponent.props() as any).tipFormatter(sliderProps.tooltipText)).toBe("Slider");
        });

        it("value undefined renders title with text '--'", () => {
            sliderProps.value = undefined
            sliderProps.tooltipText = "{1}";
            slider = shallow(createElement(SliderComponent, sliderProps));
            const RcSliderComponent = slider.find(RcSlider);

            expect((RcSliderComponent.props() as any).tipFormatter(sliderProps.value)).toBe("--");
        });

        it("empty string value renders no tooltip title", () => {
            sliderProps.tooltipText = "";
            slider = shallow(createElement(SliderComponent, sliderProps));
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().tipFormatter).toBeNull();
        });

        it("value {1} renders tooltip title as the slider value", () => {
            sliderProps.tooltipText = "{1}";
            slider = shallow(createElement(SliderComponent, sliderProps));
            const RcSliderComponent = slider.find(RcSlider);

            expect((RcSliderComponent.props() as any).tipFormatter(sliderProps.value)).toBe("20");
        });
    });
});
