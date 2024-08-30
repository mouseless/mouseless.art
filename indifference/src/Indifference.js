const { Bodies, Composite, Engine, Mouse, MouseConstraint, Render, Runner } = require("matter-js");

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

  const aCircle = Bodies.circle(width/2, height/2, 50, { render: { fillStyle: "black" } });
  Composite.add(engine.world, aCircle);

  function enableMouse() {
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 1,
        angularStiffness: 1,
        render: { visible: false }
      }
    });

    Composite.add(engine.world, mouseConstraint);

    render.mouse = mouse;
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

