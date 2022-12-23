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
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;
canvas.style.border = 'solid';

var g = new Graph(canvas);

let x=Graph.linspace(0, 2*Math.PI, 1000);
let y=[];
for(let t of x){
    y.push(Math.cos(Math.cos(t)));
}

g.plot(x,y);