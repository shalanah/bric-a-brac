import React from "react";
import t from "prop-types";

const quadraticFormula = (a, b, c) => {
  const discriminate = b ** 2 - 4 * a * c;
  if (discriminate < 0) {
    console.error(
      `Discriminate is negative: ${discriminate}. Cannot calculate arrow with those initial values`
    );
    return [];
  } else {
    return [
      (-b + discriminate ** 0.5) / (2 * a),
      (-b - discriminate ** 0.5) / (2 * a)
    ];
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
  const isHorizontal = ["top", "bottom"].includes(direction);
  const w = isHorizontal ? height : width;
  const h = isHorizontal ? width : height;
  let transform;
  let transformOrigin;
  switch (direction) {
    case "left":
      transform = "scaleX(-1)";
      transformOrigin = "center center";
      break;
    case "top":
      transform = `translateY(${w}px) rotate(-90deg)`;
      transformOrigin = "0 0";
      break;
    case "bottom":
      transform = `translateX(${h}px) rotate(90deg)`;
      transformOrigin = "0 0";
      break;
    default:
      break;
  }

  // Memorize some of this stuff
  const halfStroke = s / 2;
  const a = (h - s) ** 2 - s ** 2;
  const b = 4 * s ** 2 * w - 2 * s ** 3;
  const c =
    -((h - s) ** 2 * s ** 2) - 4 * w ** 2 * s ** 2 + 4 * w * s ** 3 - s ** 4;
  const deltaVertexX = Math.max(...quadraticFormula(a, b, c)); // only care about the positive value
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
          transformOrigin,
          transform,
          overflow: "visible"
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
