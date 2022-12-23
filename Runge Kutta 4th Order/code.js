class Simulation{
    constructor(x1, x2, dt, maxt){
        this.dt = dt;
        this.maxt = maxt;
        
        var t = [];
        for(let i=0; i<maxt/dt; i++){
            t.push(i*dt);
        }
        this.tList = t;
        this.t = 0;
        this.x1=x1;
        this.x2=x2;
        this.x1l=[x1];
        this.x2l=[x2];
    }

    f1(x1,x2,t){
        return x2;
    }

    f2(x1,x2,t){
        return -Math.sin(0.5*x1);
    }

    runSim(){
        for(let i=0;i<this.maxt/this.dt;i++){
            this.rk4();
        }
    }

    rk4(){
        let k11 = this.dt*this.f1(this.x1,this.x2,this.t);
        let k21 = this.dt*this.f2(this.x1,this.x2,this.t);
        let k12 = this.dt*this.f1(this.x1+0.5*k11,this.x2+0.5*k21,this.t+0.5*this.dt);
        let k22 = this.dt*this.f2(this.x1+0.5*k11,this.x2+0.5*k21,this.t+0.5*this.dt);
        let k13 = this.dt*this.f1(this.x1+0.5*k12,this.x2+0.5*k22,this.t+0.5*this.dt);
        let k23 = this.dt*this.f2(this.x1+0.5*k12,this.x2+0.5*k22,this.t+0.5*this.dt);
        let k14 = this.dt*this.f1(this.x1+k13,this.x2+k23,this.t+this.dt);
        let k24 = this.dt*this.f2(this.x1+k13,this.x2+k23,this.t+this.dt);
        this.x1 += (k11+2*k12+2*k13+k14)/6;
        this.x2 += (k21+2*k22+2*k23+k24)/6;
        this.x1l.push(10 * this.x1);
        this.x2l.push(10 * this.x2);
        this.t += this.dt;
    }

    plotx1(){
        ctx.beginPath();
        ctx.moveTo(0, this.x1l[0]);
        ctx.lineWidth = 4;
        for (let i=1;i<this.x1l.length;i++){
            ctx.lineTo(i * this.dt * 10, this.x1l[i]);
        }
        ctx.stroke();
    }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
ctx.translate(0, 300);
ctx.scale(1, -1);

var sim = new Simulation(2,0,0.1,100);
sim.runSim();
sim.plotx1();

