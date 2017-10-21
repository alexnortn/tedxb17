// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Two particles connected with distance joints

// Constructor
function XMill(x,y,size) {
  this.len = size/2;

  // windmill elements
  // this.box1 = new Box(x, y-20, 120, 10, false); 
  this.pinWheel = new Box(x, y, 1, 1, true); 
  this.xShape   = new X(x,y,size);

  // Define joint as between two bodies
  var rjd = new box2d.b2RevoluteJointDef();

  rjd.Initialize(this.xShape.body, this.pinWheel.body, this.xShape.body.GetWorldCenter());

  // Turning on a motor (optional)
  rjd.motorSpeed = 0;       // how fast?
  rjd.maxMotorTorque = 50.0; // how powerful?
  rjd.enableMotor = true;      // is it on?

  // There are many other properties you can set for a Revolute joint
  // For example, you can limit its angle between a minimum and a maximum
  // See box2d manual for more

  // Create the joint
  this.joint = world.CreateJoint(rjd);

  this.display = function() {
    this.pinWheel.display();
    this.xShape.display();

    // console.log(joint.GetJointAngleRadians());

    // Draw anchor just for debug
    // var anchor = scaleToPixels(this.xShape.body.GetWorldCenter());
    // fill(0);
    // noStroke();
    // ellipse(anchor.x, anchor.y, 8, 8);
  }

  this.update = function() {
    let angle = this.joint.GetJointAngleRadians();
    let rads = [];
        rads.push(angle % (PI/2));
        rads.push(angle % PI);
        rads.push(angle % (3*PI/2));
        rads.push(angle % (2*PI));

    let theta = rads.sort((a,b) => { return abs(b - a) }).pop();

    // apply torque to reduce this angle
    let dir = theta > 0 ? -1 : 1;
    let speed = map( abs(theta), 0, HALF_PI, 0, 100 ) * dir;
    this.joint.SetMotorSpeed(speed);
    // console.log(this.joint.GetMotorSpeed());

  }

  // Turn the motor on or off
  this.toggleMotor = function() {
    this.joint.EnableMotor(!this.joint.IsMotorEnabled());
  }

  this.motorOn = function() {
    return this.joint.IsMotorEnabled();
  }
}

