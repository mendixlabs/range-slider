import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { ValidationAlert } from "../ValidationAlert";

describe("ValidationAlert", () => {
    const render = (message: string) => shallow(createElement(ValidationAlert, { message }));

    it("renders the structure", () => {
        //
    });
});