let particles = [];
const numParticles = 100; // Un peu moins pour assurer la fluidité sur tous les navigateurs

class Particle {
    constructor() {
        this.pos = createVector(random(windowWidth), random(windowHeight));
        this.vel = createVector(random(-0.8, 0.8), random(-0.8, 0.8));
        this.acc = createVector(0, 0);
        this.size = 4;
        this.maxSpeed = 2.5;
    }

    update() {
        // --- INTERACTION SOURIS (Sécurisée) ---
        // On vérifie que mouseX et mouseY sont bien dans le canvas
        if (mouseX > 0 && mouseY > 0) {
            let mouse = createVector(mouseX, mouseY);
            let dir = p5.Vector.sub(this.pos, mouse);
            let distance = dir.mag();

            if (distance < 150) {
                let force = map(distance, 0, 150, 1.2, 0);
                dir.normalize();
                dir.mult(force * 4); // Force de répulsion
                this.acc.add(dir);
            }
        }

        // --- MOUVEMENT ---
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        
        // Friction pour stabiliser
        this.vel.mult(0.98); 
        this.acc.mult(0); 

        this.edges();
    }

    show() {
        noStroke();
        fill(255, 255, 255, 180);
        circle(this.pos.x, this.pos.y, this.size);
    }

    edges() {
        if (this.pos.x < 0) this.pos.x = windowWidth;
        if (this.pos.x > windowWidth) this.pos.x = 0;
        if (this.pos.y < 0) this.pos.y = windowHeight;
        if (this.pos.y > windowHeight) this.pos.y = 0;
    }

    checkParticles(others) {
        others.forEach(other => {
            let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            if (d < 100) {
                let alpha = map(d, 0, 100, 150, 0);
                stroke(0, 191, 255, alpha); // Utilisation du bleu primaire pour les lignes
                strokeWeight(1);
                line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            }
        });
    }
}

function setup() {
    // On crée le canvas et on l'attache au container
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-canvas-container');
    
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    // background avec opacité pour l'effet de traînée (trail)
    background(10, 10, 26, 100); 

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].show();
        // On ne compare chaque paire qu'une seule fois
        particles[i].checkParticles(particles.slice(i + 1));
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}