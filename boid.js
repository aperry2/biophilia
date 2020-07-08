class Boid {
  constructor(x, y, comName) { // pass information derived from eBird API pull here, only x,y coordinates for now
    // physics information
    // ===================
    this.position = createVector(x, y); // this is the position on the screen relative to the center of the canvas
    this.velocity = p5.Vector.random2D(); // random 2D velocity direction for movement
    this.velocity.setMag(random(2, 4)); // magnitude of velocity between 2-4 (?)
    this.acceleration = createVector(); // empty acceleration vector
    this.maxForce = 0.3; // maximum force the boid has in the physics engine
    this.maxSpeed = 2; // maximum speed the boid has (longer migration = faster speed?)

    // physics info associated with behavior
    // =====================================
    // this.alignmentWeight   // how important traveling in the same direction as flockmates is to this boid/species
    // this.cohesionWeight    // how important staying with others is to this boid/species
    // this.separationWeight  // how important keeping distant from others is to this boid/species

    // "species" information
    // =====================
    this.name = comName; // name - scientific? common? default for now
    this.radius = 3.0; //  size of representation (circle, arrowhead, etc.)

    // other variables to potentially use
    // ==================================
    this.c = color(random(255), random(255), random(255)); // associate with ecology/diet
    this.perceptionRadius = 25; // how far the boid/species "sees" in 360 degrees
  }

  edges() {
    if (this.position.x > width/2) {
      this.position.x = -width/2;
    } else if (this.position.x < -width/2) {
      this.position.x = width/2;
    }
    if (this.position.y > height/2) {
      this.position.y = -height/2;
    } else if (this.position.y < -height/2) {
      this.position.y = height/2;
    }
  }

  align(boids) {
    let total = 0;
    let steering = createVector();
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < this.perceptionRadius) { 
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);  
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let total = 0;
    let steering = createVector();
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < this.perceptionRadius) { 
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);  
      steering.limit(this.maxForce);
    }
    return steering;
  }


  cohesion(boids) {
    let total = 0;
    let steering = createVector();
    for (let other of boids) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < this.perceptionRadius) { 
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);  
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);
    
    alignment.mult(0.7);
    cohesion.mult(0.6);
    separation.mult(1.0);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  show() {
    strokeWeight(this.radius);
    fill(this.c);

    push();
    translate(this.position.x, this.position.y);
    
    textAlign(CENTER);
    text(this.name, 0, - 10);
    
    let theta = this.velocity.heading() + PI/2;
    rotate(theta);
    beginShape();
    vertex(0, -this.radius*2);
    vertex(-this.radius, this.radius*2);
    vertex(this.radius, this.radius*2);
    endShape();
    pop();
  }
}
