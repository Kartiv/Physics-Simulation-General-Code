class Simulation{
    constructor(x,v, dt, maxt, xscale = 10, yscale = 10){
        this.xscale = xscale;
        this.yscale = yscale;
        this.pos = x;
        this.speed = v;
        this.maxt = maxt;
        this.xlist = [x];
        this.vlist = [v];
        this.dt = dt;
        this.t = 0;
    }
    
    f1(x1,x2,t){
        return x2;
    }

    f2(x1,x2,t){
        let ddx = m/M * Math.sin(x1.coords[1])*(x2.coords[1]**2*L+g*Math.cos(x1.coords[1])) 
        /(1+m/M*Math.sin(x1.coords[1])**2);

        let ddtheta = -g/L*Math.sin(x1.coords[1]) + ddx*Math.cos(x1.coords[1])/L

        return new vec([ddx, ddtheta]);
    }

    run(){
        this.t = this.dt;
        while(this.t<this.maxt){
            this.t+=this.dt;
            this.rk4();
        }
    }

    rk4(){
        let k11 = this.f1(this.pos,this.speed,this.t).scaleUp(this.dt);
        let k21 = this.f2(this.pos,this.speed,this.t).scaleUp(this.dt);
        let k12 = this.f1(this.pos.add(k11.scaleDown(2)),this.speed.add(k21.scaleDown(2)),this.t+0.5*this.dt).scaleUp(this.dt);
        let k22 = this.f2(this.pos.add(k11.scaleDown(2)),this.speed.add(k21.scaleDown(2)),this.t+0.5*this.dt).scaleUp(this.dt);
        let k13 = this.f1(this.pos.add(k12.scaleDown(2)),this.speed.add(k22.scaleDown(2)),this.t+0.5*this.dt).scaleUp(this.dt);
        let k23 = this.f2(this.pos.add(k12.scaleDown(2)),this.speed.add(k22.scaleDown(2)),this.t+0.5*this.dt).scaleUp(this.dt);
        let k14 = this.f1(this.pos.add(k13),this.speed.add(k23),this.t+this.dt).scaleUp(this.dt);
        let k24 = this.f2(this.pos.add(k13),this.speed.add(k23),this.t+this.dt).scaleUp(this.dt);
        this.pos = this.pos.add((k11.add(k12.scaleUp(2)).add(k14).add(k13.scaleUp(2))).scaleDown(6));
        this.speed = this.speed.add((k21.add(k22.scaleUp(2)).add(k23.scaleUp(2)).add(k24)).scaleDown(6));
        this.xlist.push(this.pos);
        //this.ylist.push(this.pos.c1);
    }
}
class vec{ //vector class

    constructor(coords){
        this.coords = coords;
        this.dim = coords.length;
    } 

    add(v){ //add this vector with input vector
        if(v.dim!=this.dim){
            throw("Vector Dimensions don't Match");
        }

        let a = [];
        for(let i in this.coords){
            a.push(this.coords[i]+v.coords[i]);
        }
        return new vec(a);
    }

    sub(v){ //subtract input vector from this vector
        if(v.dim!=this.dim){
            throw("Vector Dimensions don't Match");
        }

        let a = [];
        for(let i in this.coords){
            a.push(this.coords[i]-v.coords[i]);
        }
        return new vec(a);
    }

    scaleUp(lambda){ //multiply by scalar
        let a = [];
        for(let i in this.coords){
            a.push(this.coords[i]*lambda);
        }
        return new vec(a);
    }

    scaleDown(lambda){ //divide by scalar
        let a = [];
        for(let i in this.coords){
            a.push(this.coords[i]*1/lambda);
        }
        return new vec(a);
    }

    norm(){ //norm of vector
        let s = 0;
        for(let c of this.coords){
            s+=c**2;
        }
        return Math.sqrt(s);
    }
}

class Graph{
    constructor(canvas, xmin = null, ymin = null, xmax = null, ymax = null){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.xmin = xmin;
        this.xmax = xmax;
        this.ymin = ymin;
        this.ymax = ymax;
    }

    plot(xdata, ydata, color=null, s=2){

        let xmin = this.xmin;
        let ymin = this.ymin;
        let xmax = this.xmax;
        let ymax = this.ymax;
        if(!xmin){
            xmin = Math.min(...xdata);
        }
        if(!ymin){
            ymin = Math.min(...ydata);
        }
        if(!xmax){
            xmax = Math.max(...xdata);
        }
        if(!ymax){
            ymax = Math.max(...ydata);
        }   

        if(ymax==ymin){
            ymax+=2;
            ymin-=2;
        }

        if(xdata.length != ydata.length){ //check for error in drawing
            console.error("xdata and ydata have mismatching dimensions");
        }

        if(color==null){ //set color
            ctx.strokeStyle="blue";
        }
        else{
            ctx.strokeStyle = color;
        }

        this.ctx.lineWidth = s;
        this.ctx.beginPath();
        this.ctx.moveTo((xdata[0] - xmin)/(xmax-xmin)*this.canvas.width, (ymax-ydata[0])/(ymax-ymin)*this.canvas.height); //minus on ydata cuz canvas flipped
        for(let i in xdata){
            this.ctx.lineTo((xdata[i] - xmin)/(xmax-xmin)*this.canvas.width, (ymax-ydata[i])/(ymax-ymin)*this.canvas.height);
        }
        this.ctx.stroke();
        this.ctx.closePath();

        return;
    }

    scatter(xdata, ydata, color = null, c=null, s=3){

        let xmin = this.xmin;
        let ymin = this.ymin;
        let xmax = this.xmax;
        let ymax = this.ymax;
        if(!xmin){
            xmin = Math.min(...xdata);
        }
        if(!ymin){
            ymin = Math.min(...ydata);
        }
        if(!xmax){
            xmax = Math.max(...xdata);
        }
        if(!ymax){
            ymax = Math.max(...ydata);
        }

        if(xdata.length != ydata.length){ //check for error in drawing
            console.error("xdata and ydata have mismatching dimensions");
        }

        if(!c && !color){ //set color
            ctx.fillStyle="blue";
            for(let i in xdata){
                ctx.beginPath();
                this.ctx.arc((xdata[i] - xmin)/(xmax-xmin)*this.canvas.width, (ymax-ydata[i])/(ymax-ymin)*this.canvas.height, s, 0, 2*Math.PI);
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
        else if(color){
            ctx.fillStyle=color;
            for(let i in xdata){
                ctx.beginPath();
                this.ctx.arc((xdata[i] - xmin)/(xmax-xmin)*this.canvas.width, (ymax-ydata[i])/(ymax-ymin)*this.canvas.height, s, 0, 2*Math.PI);
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
        else{
            for(let i in xdata){
                ctx.fillStyle = c[i];
                ctx.beginPath();
                this.ctx.arc((xdata[i] - xmin)/(xmax-xmin)*this.canvas.width, (ymax-ydata[i])/(ymax-ymin)*this.canvas.height, s, 0, 2*Math.PI);
                this.ctx.fill();
                this.ctx.closePath();
            }
        }

        return;
    }

    static linspace(a,b,n){
        let x = [];
        for(let i=0; i<n; i++){
            x.push(a+i*b/n);
        }
        return x;
    }

    static arange(a,b,dt){
        let x = [];
        while(a<b){
            x.push(a);
            a+=dt;
        }
        return x;
    }
}

//Simulation

const g = 9.81;
const L = 1;
const m = 1;
const M = 1;

var x = new vec([0, -Math.PI/3]);
var v = new vec([0, 0]);

var sim = new Simulation(x, v, 0.01, 100);
sim.run();

//Drawing

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;
canvas.style.border = "solid";
// ctx.translate(canvas.width/2, 0);
// ctx.scale(1,-1);

// let tlist = Graph.linspace(0, 100, 100/0.01);
// let xlist = [];
// for(let i of sim.xlist){
//     xlist.push(i.coords[0]);
// }
// let graph = new Graph(canvas);
// graph.plot(tlist, xlist);

ctx.translate(canvas.width/2, 0);


const scaleFactor = 50;

var interval = setInterval(()=>{
    ctx.clearRect(-canvas.width/2, 0, canvas.width, canvas.height);

    let x = sim.pos.coords[0];
    let theta = sim.pos.coords[1]

    //draw base
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x * scaleFactor,0,10,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();

    //colors
    ctx.fillStyle = "red";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    //pendulum
    ctx.beginPath();
    ctx.arc((x+L*Math.sin(theta)) * scaleFactor, (L*Math.cos(theta))* scaleFactor,10,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();

    sim.rk4();
}, 16)

