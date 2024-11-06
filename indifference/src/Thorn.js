const { Bodies, Body, Composite } = require("matter-js");

function Thorn(group, x, y, growScale, length, initialAngle, fillColor, strokeColor) {
  const body = Bodies.polygon(x, y, 3, length, {
    friction: 1,
    collisionFilter: { group },
    render: { lineWidth: 1, strokeStyle: strokeColor, fillStyle: fillColor }
  });

  Body.rotate(body, initialAngle);

  /**
   * @param {import("matter-js").Composite} engine
   */
  function add(composite) {
    Composite.add(composite, body);
  }

  function grow() {
    scale(growScale);
  }

  function shrink() {
    scale(1/growScale);
  }

  function scale(ratio) {
    const angle = body.angle;
    Body.rotate(body, -angle);
    Body.scale(body, ratio, 1);
    Body.rotate(body, angle);
  }

  return {
    body,

    add,
    grow,
    shrink
  };
}

module.exports = {
    new: Thorn

};
