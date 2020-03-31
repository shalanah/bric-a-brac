import React from "react";
import t from "prop-types";

const quadraticFormula = (a, b, c) => {
  const discriminate = b ** 2 - 4 * a * c;
  if (discriminate < 0) {
    console.error(`Discriminate is negative: ${discriminate}.`);
    return;
  } else {
    return [
      (-b + discriminate ** 0.5) / (2 * a),
      (-b - discriminate ** 0.5) / (2 * a)
    ];
  }
};

const getTransforms = ({ direction, width, height }) => {
  switch (direction) {
    case "left":
      return {
        transform: "scaleX(-1)",
        transformOrigin: "center center"
      };
    case "top":
      return {
        transform: `translateY(${width}px) rotate(-90deg)`,
        transformOrigin: "0 0"
      };
    case "bottom":
      return {
        transform: `translateX(${height}px) rotate(90deg)`,
        transformOrigin: "0 0"
      };
    default:
      return {};
  }
};

const PerfectArrow = ({
  width,
  height,
  strokeWidth: s = 4,
  direction = "right",
  color = "black",
  style = {},
  ...props
}) => {
  const rotate = ["top", "bottom"].includes(direction); // always render right arrow first these will get turned 90 degrees
  const w = rotate ? height : width;
  const h = rotate ? width : height;

  // Console error if bad values given
  const maxStrokeWidth = Math.min(w / 2, h / 4);
  if (s >= maxStrokeWidth)
    console.error(`Max stroke width is ${maxStrokeWidth}.`);

  // TODO: Memorize some of this stuff?
  const halfStroke = s / 2;
  const a = (h - s) ** 2 - s ** 2;
  const b = 4 * s ** 2 * w - 2 * s ** 3;
  const c =
    -((h - s) ** 2 * s ** 2) - 4 * w ** 2 * s ** 2 + 4 * w * s ** 3 - s ** 4;
  const solns = quadraticFormula(a, b, c) || [0]; // falling back to [0] just to not fully error out
  const deltaVertexX = Math.max(...solns); // only care about the positive values (max)
  return (
    <div
      style={{
        width,
        height,
        boxSizing: "border-box",
        position: "relative",
        display: "inline-block",
        ...style
      }}
      {...props}
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          boxSizing: "border-box",
          width: w,
          height: h,
          overflow: "visible",
          ...getTransforms({ direction, width: w, height: h })
        }}
      >
        <path
          strokeMiterlimit="100000" // ridiculously large miter limit for good measure,,, default for some reason is only 4
          fill={"transparent"}
          strokeLinecap={"round"}
          d={`M${halfStroke},${halfStroke} ${w - deltaVertexX / 2},${h /
            2} ${halfStroke},${h - halfStroke}`}
          stroke={color}
          strokeWidth={s}
        />
      </svg>
    </div>
  );
};

PerfectArrow.propTypes = {
  direction: t.oneOf(["right", "left", "top", "bottom"]),
  /**
   * In pixels
   */
  width: t.number.isRequired,
  /**
   * In pixels
   */
  height: t.number.isRequired,
  /**
   * In pixels
   */
  strokeWidth: t.number,
  /**
   * The color of the arrow, can be hex, rgba, anything css can take as a color
   */
  color: t.string
};

export default PerfectArrow;
