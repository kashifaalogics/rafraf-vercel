/**
 * @type {{key: string, action: "darken" | "lighten" | "alpha", value: number}[]}
 */
const shades = [
  { key: "dark", action: "darken", value: 0.4 },
  { key: "darker", action: "darken", value: 0.7 },
  { key: "light", action: "lighten", value: 0.4 },
  { key: "lighter", action: "lighten", value: 0.7 },
  { key: "op-20", action: "alpha", value: 0.2 },
  { key: "op-30", action: "alpha", value: 0.3 },
];

const colors = {
  blue: "#3C425A",
  "add-blue": "#3C5C83",
  "light-blue": "#B5D6DF",
  red: "#E74949",
  yellow: "#FFCE03",
  black: "#121212",
  light: "#DDEBEB",
  white: "#fefefe",
  grey: "#cccccc",
  darkgrey: "#999999",
  "blue-grey": "#D0DDDD",
};

const globalColors = {
  primary: "blue",
  "primary-2": "light-blue",
  secondary: "red",
  "secondary-2": "yellow",
};

const gradients = {};

module.exports = { shades, colors, globalColors, gradients };
