//let a = 80; // Create a global variable "a"
let skeletons = {}
let joints = {}


function setup() {
    createCanvas(800, 800);
    stroke(255);
    pg = createGraphics(800, 800);
}

function variableEllipse(x, y, px, py) {
  let speed = abs(x - px) + abs(y - py);
  //stroke(speed);
    
  ellipse(x, y, speed, speed);
}

function draw() {
  
    translate(width / 2, height / 2)
    const selection = []
    const selection2 = []
    const selection3 = []


    for (let name in skeletons) {
        const skeleton = skeletons[name]
        selection.push(skeleton.get('Head'));
        noFill()
        strokeWeight(1)

        if (name == 'Amber' || name == 'Finn') {
            stroke(255, 155, 0)
        } else {
            stroke(0, 150, 150);
        }

        // Paint all Limbs Connections
        const limbs = skeleton.getAllLimbs()
        limbs.forEach(limb => {
            line(limb[0][0] / 10, limb[0][2] / 10, limb[1][0] / 10, limb[1][2] / 10);
            // Strahlen       
            //line(limb[1][0], limb[0][2], limb[1][0] / 10, limb[1][2] / 10)
        })
        noFill();
    }

    beginShape();
    for (let i in selection) {
       // fill('rgba(0,255,255, 0.25)')
        stroke(150);
        const head = selection[i]
        vertex(head[0] / 10, head[2] / 10)     
    }
    endShape(CLOSE);

    for (let name2 in skeletons) {
        const skeleton = skeletons[name2]
        selection2.push(skeleton.get('RightToeBase'));
    }
    
    for (let name in skeletons) {
        const skeleton = skeletons[name]
        selection3.push(skeleton.get('LeftToeBase'));
    }

    //fill(255,0,255,0.4)
    strokeWeight(1)
    beginShape();
    for (let i in selection2) {
        
        const rightToeBase = selection2[i]
        noStroke()  
        console.log('rightToeBase =', rightToeBase[0], rightToeBase[2], rightToeBase[1]);
        if (rightToeBase[1] < 90) {
            console.log("foot");
            fill('rgba(255, 155, 0,0.9)')
            ellipse(rightToeBase[0]/10,rightToeBase[2]/10,10,10)
            fill('rgba(255, 155, 0,0.015)')
            variableEllipse(rightToeBase[0]/10,rightToeBase[2]/10,10,rightToeBase[2]/10)
            noFill()     
        }
        else{
            fill(200, 100, 0)
            ellipse(rightToeBase[0]/10,rightToeBase[2]/10,20,20)
            noFill()  
        }
       // fill('rgba(0,255,0, 0.25)')
        stroke(255, 155, 0);
        vertex(rightToeBase[0] / 10, rightToeBase[2] / 10)
    }
    endShape(CLOSE);  

    
    beginShape();
    for (let i in selection3) { 
        
        const leftToeBase = selection3[i]
        
        noStroke()
        if (leftToeBase[1] < 90) {
            console.log("foot");
            fill('rgba(0, 150, 150,0.9)')
            ellipse(leftToeBase[0]/10,leftToeBase[2]/10,10,10)
            fill('rgba(0, 150, 150,0.01)')
            
        variableEllipse(leftToeBase[0]/10,leftToeBase[2]/10,leftToeBase[2]/10,10)
            noFill()
        }
        else{
            fill(0, 90, 90)
            ellipse(leftToeBase[0]/10,leftToeBase[2]/10,20,20)
            noFill()     
        }
        //fill('rgba(0,255,255, 0.25)')
        stroke(150);
        vertex(leftToeBase[0] / 10, leftToeBase[2] / 10)
        

    }
    endShape(CLOSE);
    
    //Curved Shapes
    /*
    beginShape();
    for (let i in selection2) {
        stroke(200,200,0)
        const rightToeBase = selection[i]
        curveVertex(rightToeBase[0] / 10, rightToeBase[2] / 10)
    }
    endShape(CLOSE);
    */
    /*
    beginShape();
    for (let i in selection) {
    stroke(50);
        const rightToeBase = selection[i]
        curveVertex(rightToeBase[0] / 10, rightToeBase[2] / 10)
        console.log('head =', rightToeBase[0], rightToeBase[2]);
    }
    endShape(CLOSE);*/
    
  /*
    pg.background(51);
   // pg.translate(width / 2, height / 2)
    pg.noFill();
    pg.stroke(255);
    pg.ellipse(mouseX/10, mouseY/10, 60, 60);
    */
    background('rgba(255,255,255, 0.025)')
}


const oscPort = new osc.WebSocketPort({
    url: "ws://127.0.0.1:8888",
    metadata: true
})

const onWebSocketMessage = function (message) {
    const [_, performer, joint] = message.address.split('/')
    
    if (performer === 'annotations') return

    if (!(performer in skeletons)) {
        skeletons[performer] = new Skeleton()
    }

    const values = message.args.map(e => {
        return e.value
    })

    skeletons[performer].set(joint, values, color)

}

oscPort.on('message', onWebSocketMessage)

oscPort.open()
