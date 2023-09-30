import React from 'react';
import io from 'socket.io-client';
import './style.css';
import Ping from './ping.jsx';
import Pingpong from './pingpong.jsx';
//import ReactDOM from 'react-dom/client';
//import Ping from 'react-native-ping';
class Board extends React.Component {
    socket = io.connect("http://localhost:5000", { transports: ["websocket"] });
    constructor(props){
        super(props);
        this.canvasRef = React.createRef();
        this.cls=this.cls.bind(this);
        this.addlisteners=this.addlisteners.bind(this);
        this.oncanvasresize=this.oncanvasresize.bind(this);
        //this.pingServer=this.pingServer.bind(this);
        //this.pingthen=this.pingthen.bind(this);
        //this.changeToPolling=this.changeToPolling.bind(this);
        this.radiochange=this.radiochange.bind(this);
        //this.changeToWebsocket=this.changeToWebsocket.bind(this);
        this.componentDidMount=this.componentDidMount.bind(this);
        this.state={
            currentping:0,
            ttechnology:"websocket",
            didmount:0
        }
        localStorage.setItem( 'currentping', 0 );
        localStorage.setItem( 'ttechnology', "websocket" );
        localStorage.setItem( 'didmount', 0 );
        this.childPingRef = React.createRef();
        window.addEventListener("load",()=>setInterval(this.pingthen, 2000));
        this.socket.on("image", function(data){
            var img=new Image();
            var ctx=document.querySelector('#board').getContext('2d');
            img.onload=function(){
                ctx.drawImage(img,0,0);
            }
            img.src=data;
        })
    }
    changeValue(currentping){
        this.setState({currentping});
      }
    componentDidMount(){
        this.state.didmount=1;
        this.draw();
        this.addlisteners();
        console.log(this.canvasRef);
        
    }
    setCanvasSize(canvas) {
        //var canvas = document.querySelector('#board');
        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));
        var cs=this.canvasRef.current;
        //canvas.width=cs.width;
        //canvas.height=cs.height;
        console.log(canvas.width,canvas.height)
        console.log(cs.width,cs.height)
        console.log('setCanvasSize');
    }
    cls(){
        var cs = this.canvasRef.current;
        const context = cs.getContext('2d');
        context.clearRect(0, 0, cs.width, cs.height);
        cs = this.canvasRef.current;
        var img = cs.toDataURL("image/png");
        this.socket.emit("image", img);
        console.log(img);
        console.log(this.canvasRef.current);
      }
    oncanvasresize(){
            var can=this.canvasRef.current;
            var img = can.toDataURL("image/png");
            var sketch = document.querySelector('#sketch');
            var sketch_style = getComputedStyle(sketch);
            can.width = parseInt(sketch_style.getPropertyValue('width'));
            can.height = parseInt(sketch_style.getPropertyValue('height'));
            var image = new Image();
            var ctx = can.getContext('2d');
            image.onload = function() {
            //this.cls();
            ctx.drawImage(image, 0, 0,can.width,can.height);
    }
    image.src = img;
    console.log(can.width, can.height);
}
    addlisteners(){
        //var button = document.getElementById("cls");
        var button=document.querySelector('#cls');
        //var button2=document.querySelector('#ping');
        button.addEventListener("click", this.cls);
        //button2.addEventListener("click", this.pingServer);
        window.addEventListener('resize', this.oncanvasresize);
    }
    
    draw_comp(data){
        var image = new Image();
        var canvas = document.querySelector('#board');
        var ctx = canvas.getContext('2d');
        image.onload = function() {
            ctx.drawImage(image, 0, 0);
        };
        image.src = data;
    }
    draw() {
        var canvas = document.querySelector('#board');
        this.ctx = canvas.getContext('2d');
        var ctx = this.ctx;
        window.onload = window.onresize = this.setCanvasSize(canvas);
        var mouse = {x: 0, y: 0};
        var last_mouse = {x: 0, y: 0};
        canvas.addEventListener('mousemove', function(e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;
           // console.log(canvas.width, canvas.height);
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';

        canvas.addEventListener('mousedown', function(e) {
            canvas.addEventListener('mousemove', paint_true, false);
        }, false);

        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', paint_true, false);
        }, false);
        var root = this;
        var paint_true = function() {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();
            var img = canvas.toDataURL("image/png");
            root.socket.emit("image", img); 
        };
    }
    radiochange = e =>{
        this.setState({ttechnology:e.target.value})
        this.socket.io.opts.transports = [e.target.value];
    }
    render(){
        return(
            <div className="container">
                <div id="outdiv" class="outdiv">
            <div id="divin" class="divin"><button id="cls" class="cls">Clear</button></div>
        <div id="divin" class="divin"><Ping></Ping></div>
        <div id="divin" class="divin"><Pingpong technology={this.state.ttechnology}></Pingpong></div>
                    
        
        
        
        
        <input type="radio" name="radio" id="websocket" class="websocket" value="websocket" checked={this.state.ttechnology === "websocket"} onChange={this.radiochange}/>
                <label htmlFor="websocket" id="webs">Websocket</label>
            
            <input name="radio" type="radio" id="polling" class="polling" value="polling" checked={this.state.ttechnology === "polling"} onChange={this.radiochange}/>
                <label htmlFor="polling" id="poll">Polling</label> 
                </div>
            <div class="board-c">
            <div class="sketch" id='sketch'>
                <canvas className="board" id="board" ref={this.canvasRef}></canvas>
            </div>
            </div>
        </div>
            
        )
    }
}
export default Board
