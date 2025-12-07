class EnneagramGraph {
    constructor() {
        // Prendiamo i dati dal file config
        this.nodes = CONFIG.nodes;
        this.connections = CONFIG.connections;
        this.radius = CONFIG.radius;
    }

    display() {
        push(); // Salva lo stato grafico corrente
        translate(width / 2, height / 2); // Sposta il centro nel mezzo della tela

        // 1. Disegna il Cerchio Esterno (Adiacenza / E_ad)
        // Questo rappresenta le connessioni tra vicini (es. 1-2, 2-3)
        noFill();
        stroke(CONFIG.colors.ring);
        strokeWeight(2);
        ellipse(0, 0, this.radius * 2);

        // 2. Disegna le Linee Interne (Esade e Triangolo)
        // Le iteriamo dall'array 'connections' definito in config.js
        this.connections.forEach(conn => {
            let startNode = this.getNodeById(conn.from);
            let endNode = this.getNodeById(conn.to);

            if (startNode && endNode) {
                // Scegli il colore in base al tipo (Esade vs Triangolo)
                let lineColor = (conn.type === 'hexad') 
                                ? CONFIG.colors.hexad 
                                : CONFIG.colors.triangle;
                
                stroke(lineColor);
                strokeWeight(1.5);
                
                // Calcoliamo le coordinate cartesiane (x, y) dagli angoli
                let startPos = this.getCartesian(startNode.angle);
                let endPos = this.getCartesian(endNode.angle);

                // Disegna la linea
                this.drawArrow(startPos, endPos, lineColor);
            }
        });

        // 3. Disegna i Nodi (I Numeri)
        this.nodes.forEach(node => {
            let pos = this.getCartesian(node.angle);

            // Cerchio del nodo
            fill(CONFIG.colors.background); // Sfondo nero per coprire le linee sotto
            stroke(CONFIG.colors.node);
            strokeWeight(2);
            ellipse(pos.x, pos.y, CONFIG.nodeRadius * 2);

            // Numero
            fill(CONFIG.colors.text);
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(18);
            text(node.id, pos.x, pos.y);
        });

        pop(); // Ripristina lo stato grafico
    }

    // Funzione di utilità: Trova un nodo nel config dato il suo ID (es. cerca il "4")
    getNodeById(id) {
        return this.nodes.find(n => n.id === id);
    }

    // Funzione matematica: Converte Angolo Polare in Coordinate X,Y
    // Fondamentale perché p5.js lavora in cartesiano, ma l'enneagramma è circolare.
    getCartesian(angleDegrees) {
        // Sottraiamo 90 gradi perché in p5.js lo 0 è a destra (ore 3), 
        // ma noi vogliamo calcolare rispetto alla verticale.
        // Tuttavia, nel config abbiamo già messo gli angoli corretti, 
        // quindi usiamo semplicemente seno e coseno.
        let theta = radians(angleDegrees); 
        return {
            x: this.radius * cos(theta),
            y: this.radius * sin(theta)
        };
    }

    // Funzione grafica: Disegna una linea con una freccia alla fine
    // Serve a mostrare la direzione dello Stress/Disintegrazione
    drawArrow(startVec, endVec, color) {
        // Usiamo i vettori di p5 per calcoli facili
        let v1 = createVector(startVec.x, startVec.y);
        let v2 = createVector(endVec.x, endVec.y);
        
        line(v1.x, v1.y, v2.x, v2.y);

        // Disegna la punta della freccia (un po' prima della fine per non coprire il numero)
        push();
        let angle = atan2(v1.y - v2.y, v1.x - v2.x); // Calcola l'angolo della linea
        let offset = CONFIG.nodeRadius + 5; // Distanza dal centro del nodo target
        
        // Spostati alla fine della linea (meno l'offset del raggio del nodo)
        translate(v2.x + offset * cos(angle), v2.y + offset * sin(angle));
        rotate(angle - PI); // Ruota verso la direzione giusta
        
        fill(color);
        noStroke();
        triangle(-5, 5, -5, -5, 5, 0); // Disegna un piccolo triangolo
        pop();
    }
}