let graph;
let agent;
let typeSelector, healthSlider, btnStress, btnIntegration;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0); // Assicura che la canvas sia sullo sfondo
    canvas.style('z-index', '-1'); // Manda la canvas dietro
    
    graph = new EnneagramGraph();
    agent = new SystemAgent(graph);
    createInterface();
}

function draw() {
    background(CONFIG.colors.background);
    agent.update();
    graph.display();
    agent.display();
    drawDataHUD();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function createInterface() {
    let uiX = 20;
    let uiY = 20;

    createP('ENNEATIPO BASE (Attrattore)').position(uiX, uiY).style('color', '#aaa');
    typeSelector = createSelect();
    typeSelector.position(uiX, uiY + 35);
    for(let i=1; i<=9; i++) typeSelector.option(i);
    typeSelector.selected(9);
    typeSelector.changed(() => {
        agent.coreType = parseInt(typeSelector.value());
    });

    uiY += 80;

    createP('LIVELLO SALUTE (Entropia H)').position(uiX, uiY).style('color', '#aaa');
    healthSlider = createSlider(0, 1, 0.5, 0.01);
    healthSlider.position(uiX, uiY + 35);
    healthSlider.style('width', '200px');
    healthSlider.input(() => agent.setHealth(healthSlider.value()));

    uiY += 80;

    // TASTI FUNZIONANTI
    btnStress = createButton('STRESS (Disintegrazione)');
    btnStress.position(uiX, uiY);
    btnStress.mousePressed(() => toggleMode('stress'));
    styleButton(btnStress, '#ff3333');

    btnIntegration = createButton('SICUREZZA (Integrazione)');
    btnIntegration.position(uiX, uiY + 50);
    btnIntegration.mousePressed(() => toggleMode('integration'));
    styleButton(btnIntegration, '#33ff77');
}

// NUOVA LOGICA PULSANTI (Fixato il bug)
function toggleMode(targetMode) {
    if (agent.mode === targetMode) {
        agent.setMode('normal'); // Se riclicco, spengo
    } else {
        agent.setMode(targetMode); // Altrimenti attivo
    }
}

function styleButton(btn, color) {
    btn.style('background-color', 'transparent');
    btn.style('border', '1px solid ' + color);
    btn.style('color', color);
    btn.style('padding', '10px');
    btn.style('cursor', 'pointer');
    btn.style('font-family', 'monospace');
    btn.mouseOver(() => btn.style('background-color', color).style('color', '#000'));
    btn.mouseOut(() => btn.style('background-color', 'transparent').style('color', color));
}

function drawDataHUD() {
    fill(255);
    noStroke();
    textSize(14);
    textAlign(LEFT);
    let x = 20; 
    let y = height - 120;
    
    text("--- SYSTEM DIAGNOSTICS ---", x, y);
    y += 20;
    text(`Stato Attuale: ${agent.mode.toUpperCase()}`, x, y);
    y += 20;
    text(`Livello Entropia (H): ${agent.healthLevel.toFixed(2)}`, x, y);
    y += 20;
    let status = agent.healthLevel < 0.3 ? "CRITICO: Fissazione" : (agent.healthLevel > 0.7 ? "OTTIMO: Flessibilità" : "MEDIO");
    text(`Diagnosi: ${status}`, x, y);
}