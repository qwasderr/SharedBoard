import React from 'react';
import io from 'socket.io-client';
class Pingpong extends React.Component{
    socket = io.connect("http://localhost:5000", { transports: ["websocket"] });
    constructor(props){
        super(props);
        this.socket.io.opts.transports = [this.props.technology];
        this.state={
            ping: 0,
            techno: "websocket"
        }
        setInterval(() => {
            const start = Date.now();
            this.socket.emit("ping", () => {
              const duration = Date.now() - start;
              this.setState({ping:duration});
              console.log("Ping :" +duration);
            });
          }, 300);
       
    }
    componentDidUpdate(prevProps) {
        if (prevProps.technology !== this.props.technology) {
            this.setState({techno:this.props.technology})
            //this.state.techno=this.props.technology;
            this.socket.io.opts.transports = [this.props.technology];
        }
      }
    render(){
        return(
            <h1 id="pingh1" class="pingh1">Ping-Pong : {this.state.ping}</h1>
            
        )
    }
}
export default Pingpong;