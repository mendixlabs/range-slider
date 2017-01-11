import { DOM } from "react";

export const ValidationAlert = (props: { message: string }) =>
    DOM.div({ className: "alert alert-danger widget-validation-message" }, props.message);
