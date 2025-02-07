import { Composite, Engine, Events, Mouse, MouseConstraint, Render, Runner } from "matter-js";
import Tricle from "./Tricle.js";

const { random } = Math;

function Anger(id) {
  const tricleCount = 10;

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

  const tricles = [];
  const angryOne = Tricle.new(width/2, height/2, 50);

  for(let i=0; i<tricleCount; i++) {
    tricles.push(Tricle.new(random()*800+50, random()*800+50, random()*50+25, angryOne));
  }
  tricles.push(angryOne);

  for(const tricle of tricles) {
    tricle.add(engine.world);
  }

  Events.on(engine, 'beforeUpdate', function(_) {
    for(const tricle of tricles) {
      tricle.act();
    }
  });

  Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;

    for (var i = 0, j = pairs.length; i != j; ++i) {
      var pair = pairs[i];

      if (pair.bodyA.isSensor && !pair.bodyB.isSensor && pair.bodyB.tricle) { pair.bodyA.tricle.react(pair.bodyB); }
      if (pair.bodyB.isSensor && !pair.bodyA.isSensor && pair.bodyA.tricle) { pair.bodyB.tricle.react(pair.bodyA); }
    }
  });
  Events.on(engine, 'collisionEnd', function(event) {
    var pairs = event.pairs;

    for (var i = 0, j = pairs.length; i != j; ++i) {
      var pair = pairs[i];

      if (pair.bodyA.isSensor && !pair.bodyB.isSensor && pair.bodyB.tricle) { pair.bodyA.tricle.react(null); }
      if (pair.bodyB.isSensor && !pair.bodyA.isSensor && pair.bodyA.tricle) { pair.bodyB.tricle.react(null); }
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

export default {
  new: Anger
};

