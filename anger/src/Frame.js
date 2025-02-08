import { Bodies, Composite } from "matter-js";

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
   * @param {import("matter-js").Composite} engine
   */
  function add(composite) {
    Composite.add(composite, edges);
  }

  return {
    add
  };
}

export default {
  new: Frame
};

