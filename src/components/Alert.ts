import { SFC, createElement } from "react";

export const Alert: SFC<{ message?: string }> = ({ message }) =>
    message ? createElement("div", { className: "alert alert-danger widget-validation-message" }, message) : null;

Alert.displayName = "Alert";
