const { Bodies, Body, Composite, Vector } = require("matter-js");
const { PI, random } = Math;

function Thorn() {
  const radius = random()*10+5;
  const triangle = Bodies.polygon(random()*900+10, random()*900+10, 3, radius, { render: { fillStyle: "black" } });
  const scale = random()*2 + 0.5;
  Body.rotate(triangle, (random()*2)*PI);

  /**
   * @param {import("matter-js").Engine} engine
   */
  function add(engine) {
    Composite.add(engine.world, triangle);
  }

  function grow() {
    const angle = triangle.angle;
    Body.translate(triangle, Vector.rotate({ x: -(scale-1)*radius/2, y: 0 }, angle));
    Body.rotate(triangle, -angle);
    Body.scale(triangle, scale, 1);
    Body.rotate(triangle, angle);
  }

  function shrink() {
    const angle = triangle.angle;
    Body.translate(triangle, Vector.rotate({ x: (scale-1)*radius/2, y: 0 }, angle));
    Body.rotate(triangle, -angle);
    Body.scale(triangle, 1/scale, 1);
    Body.rotate(triangle, angle);
  }

  return {
    add,
    grow,
    shrink
  };
}

module.exports = {
    new: Thorn
};
