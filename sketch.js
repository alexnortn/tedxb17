// TEDxBeaconStreet 2017
// Alex Norton
// http://alexnortn.com

// Check for mobile context
!function(a){var b=/iPhone/i,c=/iPod/i,d=/iPad/i,e=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,f=/Android/i,g=/(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,h=/(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,i=/IEMobile/i,j=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,k=/BlackBerry/i,l=/BB10/i,m=/Opera Mini/i,n=/(CriOS|Chrome)(?=.*\bMobile\b)/i,o=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,p=new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i"),q=function(a,b){return a.test(b)},r=function(a){var r=a||navigator.userAgent,s=r.split("[FBAN");return"undefined"!=typeof s[1]&&(r=s[0]),s=r.split("Twitter"),"undefined"!=typeof s[1]&&(r=s[0]),this.apple={phone:q(b,r),ipod:q(c,r),tablet:!q(b,r)&&q(d,r),device:q(b,r)||q(c,r)||q(d,r)},this.amazon={phone:q(g,r),tablet:!q(g,r)&&q(h,r),device:q(g,r)||q(h,r)},this.android={phone:q(g,r)||q(e,r),tablet:!q(g,r)&&!q(e,r)&&(q(h,r)||q(f,r)),device:q(g,r)||q(h,r)||q(e,r)||q(f,r)},this.windows={phone:q(i,r),tablet:q(j,r),device:q(i,r)||q(j,r)},this.other={blackberry:q(k,r),blackberry10:q(l,r),opera:q(m,r),firefox:q(o,r),chrome:q(n,r),device:q(k,r)||q(l,r)||q(m,r)||q(o,r)||q(n,r)},this.seven_inch=q(p,r),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window?this:void 0},s=function(){var a=new r;return a.Class=r,a};"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=r:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?module.exports=s():"function"==typeof define&&define.amd?define("isMobile",[],a.isMobile=s()):a.isMobile=s()}(this);


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
let max_count = 100000;

let layout = {};

// optimize xs / xm · wrt perfect, responsive layout
// recursive hillclimbing
// 0: xs 1: xm 2: xk 3: yk 4: ps 5: re
function layoutMachine(w,h) {
  let _xs,_xm;
  let best;
  // starting points
  _xs = 60;
  _xm = _xs/4;

  sols = [];

  // cost function » optimize for re
  function costf(xs,xm) {
    let xk,yk,ps,re;
    // how many x fit on canvas width
    xk = Math.floor((xs + w + xm) / (xs + xm));
    // how many x fit on canvas height
    yk = Math.ceil((h*0.6) / (xs  + xm));
    ps = xs/8,
    // leftover space
    re = Math.round((w + xs) - (xk * (xs + xm) - xm));
    // solution
    return [xs,xm,xk,yk,ps,re];
  }

  for(let i=-50; i<50; i++) {       // Search ± 25% xs
    for(let j=-10; j<10; j++) {     // Search ± 10% xm
      sols.push(
        costf(
          _xs + (_xs * ((100 - i) * 0.01)),
          _xm + (_xm * ((100 - i) * 0.01))
        )
      )
    }
  }

  best = sols.sort((a,b) => { return b[5] - a[5] }).pop();
  console.log(best);
  return best;

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize box2d physics and create the world
  world = createWorld();
  world.SetContactListener(new CustomListener());

  // For box2D to work, we must always step through time each frame
  timeStep = 1.0/30;

  // Make the windmill at an x,y location
  p_rate = isMobile.any ? 0.005 : 0.01 
  
  // calculate layout
  let l = layoutMachine(width,height);
  
  layout["xs"] = l[0];
  layout["xm"] = l[1];
  layout["xk"] = l[2];
  layout["yk"] = l[3];
  layout["ps"] = l[4];
  layout["re"] = l[5];

  for (let i=0; i<layout.yk; i++) {
    for (let j=0; j<layout.xk; j++) {
      if (count >= max_count) return;
      mills.push(
        xMill = new XMill(
          j * (layout.xs + layout.xm),
          i * (layout.xs + layout.xm),
          layout.xs
        )
      );
      count++;
    }
  }

  console.log(count);

  // mills.push(
  //   new XMill(width/2, height/2, x_size)
  // );

}

function draw() {
  clear();

  // 2nd and 3rd arguments are velocity and position iterations
  world.Step(timeStep,10,10);

  // Particle emitter
  if (random(1) < p_rate) {
    particles.push(new Particle(random(0,width),-20, layout.ps));
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
// function mousePressed() {
//   mills.forEach((m, i) => {
//     m.toggleMotor();
//     console.log(i + " " + m.motorOn());
//   });
//   // xMill.toggleMotor();
// }