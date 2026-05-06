import js from "@eslint/js";
import security from "eslint-plugin-security";

export default [
  js.configs.recommended,
  security.configs.recommended,
  {
    files: ["src/**/*.js"],
    rules: {
      "no-console": "warn",
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-regexp": "error",
      "security/detect-possible-timing-attacks": "error",
    },
  },
];
