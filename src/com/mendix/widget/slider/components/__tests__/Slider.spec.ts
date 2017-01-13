import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { Slider as SliderComponent, SliderProps } from "../Slider";

describe("Slider", () => {
    const render = (props: SliderProps) => shallow(createElement(SliderComponent, props));

    it("renders the structure", () => {
        // 
    });

    it("creates an horizontal slider", () => {
        //
    });

    it("creates a vertical slider", () => {
        //
    });

    describe("shows an error when", () => {
        it(" maximum value is not set", () => {
            // 
        });

        it("minimum value is not set", () => {
            //
        });

        it("minimum value is greater than or equal to maximum value", () => {
            //
        });
    });

    describe("with value", () => {
        it("creates a slider with given values", () => {
            //
        });

        it("of undefined renders slider with calculated default value", () => {
            //
        });

        it("greater than maximum value it shows an error", () => {
            //
        });

        it("less than minimum value it shows an error", () => {
            //
        });
    });

    describe("with step value", () => {
        it("greater than 0 it does not show an error", () => {
            //
        });

        it("does not fix equally between minimum and maximum it shows an error", () => {
            //
        });

        it("less than 0 it shows an error", () => {
            //
        });

        it("equal to 0 it shows an error", () => {
            //
        });
    });

    describe("with markers", () => {
        it("less than 2 it shows no makers", () => {
            //
        });

        it("greater than 2 it shows markers on the slider", () => {
            //
        });
    });

    describe("tooltip with", () => {
        it("value renders tooltip title with that value", () => {
            //
        });

        it("value undefined renders title with text '--'", () => {
            //
        });

        it("empty string value renders no tooltip title", () => {
            //
        });

        it("value {1} renders tooltip title as the slider value", () => {
            //
        });
    });
});
