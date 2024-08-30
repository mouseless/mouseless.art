const { Composite, Engine, Events, Mouse, MouseConstraint, Render, Runner } = require("matter-js");
const Frame = require("./Frame.js");
const Thorn = require("./Thorn.js");

function Indifference(id) {
  const canvas = document.getElementById(id)
  const width = canvas.width;
  const height = canvas.height;

  const engine = Engine.create({
    gravity: { x: 0, y: 0 }
  });
  const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      wireframes: false,
      background: "transparent",
      width: width,
      height: height
    }
  });
  const runner = Runner.create();
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 1,
      angularStiffness: 1,
      render: { visible: false }
    }
  });

  render.mouse = mouse;

  const frame = Frame.new(width, height, 5);
  const thorns = [
    Thorn.new(),
    Thorn.new(),
    Thorn.new(),
    Thorn.new(),
    Thorn.new()
  ];

  frame.add(engine);
  for(const thorn of thorns) {
    thorn.add(engine);
  }

  Events.on(mouseConstraint, "mousedown", () => {
    for(const thorn of thorns) {
      thorn.grow();
    }
  });

  Events.on(mouseConstraint, "mouseup", () => {
    for(const thorn of thorns) {
      thorn.shrink();
    }
  });

  function enableMouse() {
    Composite.add(engine.world, mouseConstraint);
  }

  function run() {
    Render.run(render);
    Runner.run(runner, engine);
  }

  return {
    enableMouse,
    run
  };
}

module.exports = {
  new: Indifference
};

