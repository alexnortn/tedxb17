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
  // rjd.motorSpeed = 0;       // how fast?
  // rjd.maxMotorTorque = 100.0; // how powerful?
  // rjd.enableMotor = true;      // is it on?

  // There are many other properties you can set for a Revolute joint
  // For example, you can limit its angle between a minimum and a maximum
  // See box2d manual for more

  // Create the joint
  this.joint = world.CreateJoint(rjd);
  // this.joint.SetLimits(-HALF_PI, HALF_PI);
  // this.joint.EnableLimit(true);
  this.joint.EnableMotor(true);
  this.joint.SetMaxMotorTorque(1000);
  this.joint.SetMotorSpeed(0);

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
    // apply torque to reduce this angle
    // let speed = map( angle, -HALF_PI, HALF_PI, 100, -100 );  
    // if (degrees(angle) < 0.05) {
    //   angle = 0;
    // }

    let gain = 0.05;

    this.joint.SetMotorSpeed(-gain * degrees(angle));
    // let power = degrees(angle) < 2.5 ? 0 : 1000;
    this.joint.SetMaxMotorTorque(1000 * abs(degrees(angle)) + pow(abs(angle), 10) * 100);

  }

  // Turn the motor on or off
  this.toggleMotor = function() {
    this.joint.EnableMotor(!this.joint.IsMotorEnabled());
  }

  this.motorOn = function() {
    return this.joint.IsMotorEnabled();
  }
}

