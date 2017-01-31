import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { Alert } from "../Alert";

describe("Alert", () => {
    const message = "This is an error";
    const alert = shallow(createElement(Alert, { message }));

    it("renders the structure", () => {
        expect(alert).toBeElement(
            DOM.div({ className: "alert alert-danger widget-validation-message" }, message)
        );
    });
});
