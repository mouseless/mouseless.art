const { Bodies, Composite } = require("matter-js");

/**
 * @param {Number} width
 * @param {Number} height
 * @param {Number} thickness
 */
function Frame(width, height, thickness) {
  const edges = [
    Bodies.rectangle(width/2, -thickness/2, width, thickness, { isStatic: true }),
    Bodies.rectangle(-thickness/2, height/2, thickness, height, { isStatic: true }),
    Bodies.rectangle(width/2, height+thickness/2, width, thickness, { isStatic: true }),
    Bodies.rectangle(width+thickness/2, height/2, thickness, height, { isStatic: true })
  ];

  /**
   * @param {import("matter-js").Engine} engine
   */
  function add(engine) {
    Composite.add(engine.world, edges);
  }

  return {
    add
  };
}

module.exports = {
  new: Frame
};

