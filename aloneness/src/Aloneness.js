import { Composite, Engine, Events, Mouse, MouseConstraint, Render, Runner } from "matter-js";
import Tricle from "./Tricle.js";

const THE_ONE_SIZE = 100;
const OTHER_COUNT_PER_PERIOD = 3;
const OTHER_ADD_PERIOD = 5000;

function Aloneness(id) {
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
  const theOne = Tricle.new(width/2, height/2, THE_ONE_SIZE);
  theOne.add(engine.world);

  function addOthers() {
    for(let i=0; i<OTHER_COUNT_PER_PERIOD; i++) {
      const newTricle = Tricle.new(Math.random()*800+50, -100, Math.random()*50+25, theOne);
      tricles.push(newTricle);
      newTricle.add(engine.world);
    }
  }

  addOthers();
  setInterval(addOthers, OTHER_ADD_PERIOD);

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
  new: Aloneness
};

