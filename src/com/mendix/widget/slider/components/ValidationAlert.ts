import { DOM, StatelessComponent } from "react";

export const ValidationAlert: StatelessComponent<{ message: string }> = (props) =>
    DOM.div({ className: "alert alert-danger widget-validation-message" }, props.message);
    