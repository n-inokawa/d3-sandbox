import { withCssResources } from "@storybook/addon-cssresources";
import init from "./";
import { getRangedData } from "../randamDataCreator";

export default {
  title: "chart/areaChart",
  decorators: [withCssResources],
  parameters: {
    cssresources: [
      {
        id: `areaChart`,
        code: `<style>
      .line {
        fill: steelblue;
      }
      </style>`,
        picked: true,
      },
    ],
  },
};

export const normal = () => {
  const div = document.createElement("div");
  const update = init(div, {
    xKey: "name",
    yKey: "value",
    xLabel: "名前",
    yLabel: "値",
  });

  update(getRangedData(1000));
  setInterval(() => {
    update(getRangedData(1000));
  }, 1000);
  return div;
};
