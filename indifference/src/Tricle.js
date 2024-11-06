const { Bodies, Body, Composite, Constraint, Events, Vector } = require("matter-js");
const { PI, cos, sin } = Math;
const Thorn = require("./Thorn.js");
const xray = false;

function Tricle(x, y, radius) {
  const strokeColor = "black";
  const thornCount = 32;
  const thornLength = 1/5;
  const thornBaseRatio = 3;
  const thornStiffness = 0.7;
  const sensorWidth = 2;
  const maxGrowth = 3;

  const group = Body.nextGroup(true);
  const tricle = Composite.create({ label: "tricle" });
  const body = Bodies.circle(x, y, radius, {
    collisionFilter: { group },
    render: { lineWidth: 2, strokeStyle: strokeColor }
  });
  const sensor = Bodies.circle(x, y, radius*sensorWidth, {
    isSensor: true,
    isStatic: false,
    collisionFilter: { group },
    render: {
        strokeStyle: "lightgray",
        fillStyle: 'transparent',
        lineWidth: 1
    }
  });

  const thorns = [];
  for(let i=0; i<thornCount; i++) {
    const angle = (i/thornCount)*2*PI;
    thorns.push(
      Thorn.new(
        group,
        x-radius*cos(angle),
        y-radius*sin(angle),
        thornLength*thornCount/thornBaseRatio,
        radius/(thornCount/thornBaseRatio),
        angle,
        body.render.fillStyle,
        strokeColor
      )
    );
  }
  for(let i = 0; i<thorns.length; i++) {
    const thorn = thorns[i];

    // bind one leg of thorn
    bind(thorn.body, body, thornStiffness,
      // calculate leg's offset
      Vector.sub(thorn.body.position, thorn.body.vertices[0]),
      // calculate offset from center of body towards leg of thorn
      offset(body.position, thorn.body.vertices[2], radius*1)
    );
    // bind other leg of thorn
    bind(thorn.body, body, thornStiffness,
      // calculate leg's offset
      Vector.sub(thorn.body.position, thorn.body.vertices[2]),
      // calculate offset from center of body towards leg of thorn
      offset(body.position, thorn.body.vertices[0], radius*1)
    );
    // bind center of thorn
    bind(thorn.body, body, thornStiffness,
      Vector.sub(thorn.body.vertices[1], thorn.body.position),
    );

    thorn.add(tricle);
  }
  bind(body, sensor, 1.0);
  Composite.add(tricle, body);
  Composite.add(tricle, sensor);

  function offset(a, b, distance) {
    const direction = Vector.sub(b, a);
    const unitDirection = Vector.normalise(direction);

    return Vector.mult(unitDirection, distance);
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
        render: { visible: xray, lineWidth: 1, strokeStyle: "blue" }
    }));
  }

  /**
   * @param {import("matter-js").Composite} engine
   */
  function add(composite) {
    Composite.add(composite, tricle);
  }

  let growCount = 0;
  function grow() {
    if(growCount >= maxGrowth) { return; }

    growCount++;
    for(const thorn of thorns) {
      thorn.grow();
    }
  }

  function shrink() {
    if(growCount <= 0) { return; }

    growCount--;
    for(const thorn of thorns) {
      thorn.shrink();
    }
  }

  function react(otherTricle) {
    if(otherTricle) {
      setTimeout(grow, 1000);
    } else {
      setTimeout(shrink, 1000);
    }
  }

  const result = {
    add,
    grow,
    shrink,
    react
  };

  body.tricle = result;
  sensor.tricle = result;

  return result;
}

module.exports = {
    new: Tricle
};

