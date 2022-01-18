import p5 from 'p5';
import P5 from 'p5';
import {PRNGRand} from "./random";
import {ColorScheme} from "./color";
import {createScene, drawScene} from "./scene";
import {ApproxShape, MouthApproxShape} from "./points-shape";

import {Mover} from "./P5/mover";
import {Attractor} from "./P5/attractor";



let chunks = []
var recorder;
const pixelDens = 1;
const sketch = p5 => {

    let colorScheme;
    let colorsArrayMap = new Map()
    let acceleration = 0;
    let velocity = 0
    let globalLineWidth = 30;

    let radius = 0.5;
    let colorFlipAllowed = false;

    const frate = 30 // frame rate
    const numFrames = 100 // num of frames to record
    let recording = false



    let keysDown = {}

    let castlesXML;

    let animateTime = 0; //0..1

    let movers = [];
    let attractor;
let px,py=0;

    p5.preload = () => {
        // castlesXML = p5.loadXML('./castles.svg');
    }
    p5.setup = () => {
        const canv = p5.createCanvas(800, 800);
        canv.parent('sketch')
        p5.pixelDensity(pixelDens)
        // p5.colorMode(p5.HSB)
        p5.sb = new PRNGRand(new Date().getMilliseconds())
        // colorScheme = new ColorScheme(p5)
        p5.noSmooth();
        p5.frameRate(24)



        let a =0
        let cols = [p5.color(255,0,0),p5.color(0,255,0),p5.color(0,0,255)]
        let rads = [100, 150]
        for (let i = 0; i < 30; i++) {
            a = i/30 * p5.TWO_PI
            let x = p5.sin(a) * p5.width/2 +p5.width/2;
            let y = p5.cos(a) * p5.height/2 +p5.height/2;
            let m = 100;//p5.random(50, 150);

            movers[i] = new Mover(p5, x, y, m, cols[i%cols.length], rads[i%rads.length])
        }
        attractor = new Attractor(p5,p5.width / 2, p5.height / 2, 50);
    }

    p5.mouseReleased = () => {
        // p5.loop()
    }

    p5.keyPressed = () => {
        if (p5.key === 'r') {
            recording = !recording
            if (recording) {
                record()
            } else {
                exportVideo()
            }
        }

        if (p5.key === 's') {
            p5.saveCanvas('sketch-d6', 'png')
        }

        keysDown[p5.keyCode]=true
    }

    p5.keyReleased=()=>{

        keysDown[p5.keyCode]=false
    }

    p5.draw = () => {


        p5.push()
        p5.background(0)

        p5.blendMode(p5.ADD);

        for (let mover of movers) {
            mover.update(p5);
            mover.show(p5);
            attractor.attract(p5,mover);
        }
        if (p5.mouseIsPressed) {
            // attractor.pos.x = p5.mouseX;
            // attractor.pos.y = p5.mouseY;
            for (let mover of movers) {
                const m = p5.createVector(p5.mouseX, p5.mouseY)
                if(P5.Vector.sub(mover.pos, m).mag()<mover.mass*5){
                    mover.applyForce(P5.Vector.sub(m, p5.createVector(px,py)).normalize().mult(100))
                }
                mover.update(p5);
                mover.show(p5);
                attractor.attract(p5,mover);
            }
        }
        attractor.show(p5);
        p5.pop()

        px = p5.mouseX
        py = p5.mouseY

    }
    // var recorder=null;
    const record = () => {
        chunks.length = 0;
        let stream = document.querySelector('canvas').captureStream(30)
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            if (e.data.size) {
                chunks.push(e.data);
            }
        };
        recorder.start();

    }

    const exportVideo = (e) => {
        recorder.stop();

        setTimeout(() => {
            var blob = new Blob(chunks);
            var vid = document.createElement('video');
            vid.id = 'recorded'
            vid.controls = true;
            vid.src = URL.createObjectURL(blob);
            document.body.appendChild(vid);
            vid.play();
        }, 1000)
    }
}


new p5(sketch);
