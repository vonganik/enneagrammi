// CONFIGURAZIONE DEL SISTEMA ENNEAGRAMMA

const CONFIG = {
    // Layout visivo
    radius: 250,        // Raggio del cerchio grande
    nodeRadius: 25,     // Grandezza dei pallini (nodi)
    
    // Colori (Stile "Tron/Sci-Fi")
    colors: {
        background: 20,
        node: [200, 200, 200],      // Grigio chiaro
        nodeActive: [255, 255, 0],  // Giallo per il tipo attivo
        text: 255,
        
        // Linee basate sul PDF
        ring: [100, 100, 100],      // Il cerchio esterno (Adiacenza)
        hexad: [0, 150, 255],       // Blu elettrico (1-4-2-8-5-7)
        triangle: [255, 100, 100]   // Rosso (9-6-3)
    },

    // DEFINIZIONE TOPOLOGICA (Il cuore del PDF)
    
    // 1. I Nodi (V) [cite: 13]
    // Usiamo angoli standard per posizionarli sul cerchio (9 in alto)
    nodes: [
        { id: 9, angle: -90 },  // Ore 12
        { id: 1, angle: -50 },
        { id: 2, angle: -10 },
        { id: 3, angle: 30 },
        { id: 4, angle: 70 },
        { id: 5, angle: 110 },
        { id: 6, angle: 150 },
        { id: 7, angle: 190 },
        { id: 8, angle: 230 }
    ],

    // 2. Le Linee di Forza (E_inn) - Vettori di Stress
    // Qui codifichiamo le sequenze descritte negli Assiomi 1.1 e 1.2
    connections: [
        // Sequenza Triangolo (Legge del 3): 9 -> 6 -> 3 -> 9 [cite: 26]
        { from: 9, to: 6, type: 'triangle' },
        { from: 6, to: 3, type: 'triangle' },
        { from: 3, to: 9, type: 'triangle' },

        // Sequenza Esade (Legge del 7): 1->4->2->8->5->7->1 [cite: 24]
        { from: 1, to: 4, type: 'hexad' },
        { from: 4, to: 2, type: 'hexad' },
        { from: 2, to: 8, type: 'hexad' },
        { from: 8, to: 5, type: 'hexad' },
        { from: 5, to: 7, type: 'hexad' },
        { from: 7, to: 1, type: 'hexad' }
    ]
};