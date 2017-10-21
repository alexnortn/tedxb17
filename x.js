// TEDxBeaconStreet 2017
// Alex Norton
// http://alexnortn.com

// An X shaped box2D physical object


// Constructor
function X(x, y, size) {
  this.w = size/4;
  this.h = size;

  // Define a body
  let bd = new box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position = scaleToWorld(x,y);

  // Vector for fixture center
  let fdCenter = new box2d.b2Vec2(0, 0);

  // Define fixture #1
  let fd1 = new box2d.b2FixtureDef();
      // Fixture holds shape
      fd1.shape = new box2d.b2PolygonShape();
      fd1.shape.SetAsOrientedBox(scaleToWorld(this.w/2), scaleToWorld(this.h/2), fdCenter, -QUARTER_PI);
      fd1.density = 1.0;
      fd1.friction = 0.5;
      fd1.restitution = 0.5;

  // Define fixture #2
  let fd2 = new box2d.b2FixtureDef();
      // Fixture holds shape
      fd2.shape = new box2d.b2PolygonShape();
      fd2.shape.SetAsOrientedBox(scaleToWorld(this.w/2), scaleToWorld(this.h/2), fdCenter, QUARTER_PI);
      fd2.density = 1.0;
      fd2.friction = 0.5;
      fd2.restitution = 0.5;

  // Create the body
  this.body = world.CreateBody(bd);
  // Attach the fixture
  this.body.CreateFixture(fd1);
  this.body.CreateFixture(fd2);

  // Some additional stuff
  // this.body.SetLinearVelocity(new box2d.b2Vec2(random(-5, 5), random(2, 5)));
  // this.body.SetAngularVelocity(random(-5,5));

  // This function removes the particle from the box2d world
  this.killBody = function() {
    world.DestroyBody(this.body);
  }

  // Is the particle ready for deletion?
  this.done = function() {
    // Let's find the screen position of the particle
    let pos = scaleToPixels(this.body.GetPosition());
    // Is it off the bottom of the screen?
    if (pos.y > height+this.w*this.h) {
      this.killBody();
      return true;
    }
    return false;
  }

  // Drawing the box
  this.display = function() {
    // Get the body's position
    let pos = scaleToPixels(this.body.GetPosition());
    // Get its angle of rotation
    let a = this.body.GetAngleRadians();
    
    // Draw it!
    rectMode(CENTER);
    push();
      translate(pos.x, pos.y);
      rotate(a);

      fill(255,0,0);
      noStroke();

      push();
        rotate(QUARTER_PI);
        rect(0,0,this.w,this.h);
        rotate(-HALF_PI);
        rect(0,0,this.w,this.h);
      pop();

    pop();
  }
}