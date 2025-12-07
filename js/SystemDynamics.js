class SystemAgent {
    constructor(graph) {
        this.graph = graph; 
        
        // PARAMETRI DI STATO
        this.coreType = 9;      
        this.healthLevel = 0.5; 
        this.mode = 'normal'; // 'normal', 'stress', 'integration'

        // FISICA
        this.pos = createVector(0, 0); 
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);

        // CONFIGURAZIONE FISICA 
        this.maxSpeed = 15; 
        this.friction = 0.97; 
    }

    update() {
        // 1. IDENTIFICA IL TARGET
        let targetPos = this.calculateAttractor();

        // 2. APPLICA FORZA DI ATTRAZIONE
        let force = p5.Vector.sub(targetPos, this.pos);
        
        // Tuning della Rigidità (Stiffness)
        let stiffness = map(this.healthLevel, 0, 1, 0.2, 0.001);
        
        // Sotto stress o integrazione la forza deve vincere l'inerzia
        if (this.mode !== 'normal') stiffness = 0.25;

        force.mult(stiffness);
        this.applyForce(force);

        // 3. APPLICA ENTROPIA
        if (this.healthLevel > 0.05 && this.mode === 'normal') {
            let wanderStrength = map(this.healthLevel, 0, 1, 0.1, 5.0);
            let noiseVector = p5.Vector.random2D().mult(wanderStrength);
            this.applyForce(noiseVector); 
        }

        // 4. CONFINI DEL SISTEMA
        this.checkBoundaries();

        // 5. FISICA
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.vel.mult(this.friction);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    checkBoundaries() {
        let maxRadius = this.graph.radius + 30;
        let dist = this.pos.mag();

        if (dist > maxRadius) {
            let pushBack = p5.Vector.sub(createVector(0,0), this.pos);
            pushBack.normalize();
            pushBack.mult(4.0); 
            this.applyForce(pushBack);
        }
    }

    display() {
        push();
        translate(width / 2, height / 2);

        noStroke();
        // Colore basato sullo stato
        if (this.mode === 'stress') fill(255, 50, 50);       
        else if (this.mode === 'integration') fill(50, 255, 100); 
        else fill(255); 
        
        drawingContext.shadowBlur = 15;
        drawingContext.shadowColor = color(255);
        ellipse(this.pos.x, this.pos.y, 15, 15);
        drawingContext.shadowBlur = 0; 
        pop();
    }

    calculateAttractor() {
        let coreNode = this.graph.getNodeById(this.coreType);
        
        if (this.mode === 'stress') {
            let nextId = this.findNextNode(this.coreType);
            if (nextId) {
                let node = this.graph.getNodeById(nextId);
                let p = this.graph.getCartesian(node.angle);
                return createVector(p.x, p.y);
            }
        } 
        else if (this.mode === 'integration') {
            let prevId = this.findPrevNode(this.coreType);
            if (prevId) {
                let node = this.graph.getNodeById(prevId);
                let p = this.graph.getCartesian(node.angle);
                return createVector(p.x, p.y);
            }
        }

        let p = this.graph.getCartesian(coreNode.angle);
        return createVector(p.x, p.y);
    }

    applyForce(force) { this.acc.add(force); }

    findNextNode(id) {
        let conn = CONFIG.connections.find(c => c.from === id);
        return conn ? conn.to : null;
    }

    findPrevNode(id) {
        let conn = CONFIG.connections.find(c => c.to === id);
        return conn ? conn.from : null;
    }

    // --- NUOVO METODO SEMPLIFICATO ---
    setMode(newMode) {
        this.mode = newMode;
    }

    setHealth(val) { this.healthLevel = val; }
}