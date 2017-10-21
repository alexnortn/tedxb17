// TEDxBeaconStreet 2017
// Alex Norton
// http://alexnortn.com


// A reference to our box2d world
let world;
// A list for all of our particles
let particles = [];
// An object to describe a Windmill (two bodies and one joint)
// let windmill;
// let x_rot;
let xMill;
let timeStep;
let mills = [];
let count = 0;
let max_count = 1000;

let x_size,
    x_margin,
    p_size,
    kw,
    kh;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize box2d physics and create the world
  world = createWorld();

  // For box2D to work, we must always step through time each frame
  timeStep = 1.0/30;

  // Make the windmill at an x,y location
  x_size = 200,
  x_margin = x_size/6,
  p_size = x_size/6,
  kw = 1 + Math.ceil((width) / (x_size  + x_margin)),
  kh = 1 + Math.ceil((height*0.6) / (x_size  + x_margin));

  for (let i=0; i<kh; i++) {
    for (let j=0; j<kw; j++) {
      if (count >= max_count) return;
      mills.push(
        xMill = new XMill(
          j * (x_size + x_margin) - x_size - x_margin,
          i * (x_size + x_margin) - x_size - x_margin,
          x_size
        )
      );
      count++;
    }
  }
}

function draw() {
  background(255);

  // 2nd and 3rd arguments are velocity and position iterations
  world.Step(timeStep,10,10);

  // Particle emitter
  if (random(1) < 0.01) {
    particles.push(new Particle(random(0,width),-20, p_size));
  }


  // Display all the particles
  for (let i = particles.length-1; i >= 0; i--) {
    particles[i].display();
    if (particles[i].done()) {
      particles.splice(i,1); // oh nice let js auto gc take care of removing particle from system!
    }
  }

  // Draw the windmill
  mills.forEach(m => {
    m.update();
    m.display();
  });
  // xMill.display();
  // x_rot.display();

  // let status = "OFF";
  // if (xMill.motorOn()) status = "ON";
  
}

// Might be kind of cool, to make this interactive wrt mouse!!
function mousePressed() {
  mills.forEach((m, i) => {
    m.toggleMotor();
    console.log(i + " " + m.motorOn());
  });
  // xMill.toggleMotor();
}