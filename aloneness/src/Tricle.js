const { Bodies, Body, Composite, Constraint, Vector } = require("matter-js");

const XRAY = false;
const SENSOR_WIDTH = 1.5;
const SOUL_COLOR = "white";
const SUBJECT_STROKE_COLOR = "#002fa7";
const SUBJECT_BODY_COLOR = "#002fa7";
const OTHER_BODY_COLOR = "#999999";
const OTHER_ACT_FORCE_RATIO = 0.001;
const ANIMATION_SCALE_FACTOR = 1.0015;
const SCALE_FACTOR = 1.4;
const SOUL_STIFFNESS = 0.1;
const SOUL_OPACITY = 0.2;

const CATEGORY_NONE = 0x0000;
const CATEGORY_THE_ONE = 0x0001;
const CATEGORY_OTHER = 0x0002;
const CATEGORY_SOUL = 0x0004;
const CATEGORY_SENSOR = 0x0008;

function Tricle(x, y, radius, theOne) {
  const isTheOne = theOne === undefined;

  const tricle = Composite.create({ label: "tricle" });
  const body = Bodies.circle(x, y, radius, {
    collisionFilter: {
        group: 0,
        category: isTheOne ? CATEGORY_THE_ONE : CATEGORY_OTHER,
        mask: isTheOne
            ? CATEGORY_SENSOR | CATEGORY_OTHER
            : CATEGORY_SENSOR | CATEGORY_THE_ONE
    },
    restitution: 0,
    render: {
      lineWidth: isTheOne ? 3 : 0,
      strokeStyle: isTheOne ? SUBJECT_STROKE_COLOR : "transparent",
      fillStyle: isTheOne ? SUBJECT_BODY_COLOR : OTHER_BODY_COLOR
    }
  });

  let soul;
  if(isTheOne) {
    soul = Bodies.circle(x, y, radius, {
      collisionFilter: {
        group: 0,
        category: CATEGORY_SOUL,
        mask: CATEGORY_NONE
      },
      render: {
        fillStyle: SOUL_COLOR,
        opacity: SOUL_OPACITY
      }
    });
  }

  const sensor = Bodies.circle(x, y, radius * SENSOR_WIDTH, {
    isSensor: true,
    collisionFilter: {
      group: 0,
      category: CATEGORY_SENSOR,
      mask: CATEGORY_OTHER | CATEGORY_THE_ONE
    },
    render: {
      strokeStyle: "green",
      fillStyle: 'transparent',
      lineWidth: 1,
      visible: XRAY
    }
  });

  bind(body, sensor, 1.0);

  if(isTheOne) {
    bind(body, null, 1, null, Vector.create(x, y));
  }

  function bind(bodyA, bodyB, stiffness,
    pointA = null,
    pointB = null
  ) {
    Composite.add(tricle, Constraint.create({
      bodyA,
      pointA,
      bodyB,
      pointB,
      stiffness,
      render: { visible: XRAY, lineWidth: 1, strokeStyle: "blue" }
    }));
  }

  /**
   * @param {import("matter-js").Composite} engine
   */
  function add(composite) {
    Composite.add(composite, tricle);
    Composite.add(tricle, body);
    Composite.add(tricle, sensor);

    if(isTheOne) {
      bind(soul, body, SOUL_STIFFNESS);
      Composite.add(tricle, soul);
    }
  }

  function growSoul() {
    scale(SCALE_FACTOR);
  }

  function shrinkSoul() {
    scale(1/SCALE_FACTOR);
  }

  let targetScale = SCALE_FACTOR;
  let currentScale = 1;

  function scale(value) {
    targetScale = targetScale * value;
  }

  if(soul) {
    scaleAnimation();
  }

  function scaleAnimation() {
    const stepScale =
      currentScale - targetScale < -0.001 ? ANIMATION_SCALE_FACTOR :
      currentScale - targetScale > 0.001 ? 1 / ANIMATION_SCALE_FACTOR :
      1
    ;

    Body.scale(soul, stepScale, stepScale);
    currentScale *= stepScale;
    requestAnimationFrame(scaleAnimation);
  }

  function act() {
    if(isTheOne) { return; }

    if(body.speed < 1) {
      var downwards = { x: 0, y: 1 };
      var force = Vector.mult(Vector.normalise(downwards), body.mass * OTHER_ACT_FORCE_RATIO);
      Body.applyForce(body, body.position, force);
    }
  }

  function react(otherTricle) {
    if(!isTheOne) { return; }

    if(otherTricle) {
      shrinkSoul();
    } else {
      growSoul();
    }
  }

  const result = {
    body,

    add,
    act,
    react
  };

  body.tricle = result;
  sensor.tricle = result;

  return result;
}

module.exports = {
    new: Tricle
};

