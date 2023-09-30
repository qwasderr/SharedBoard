import React from 'react';
class Ping extends React.Component{
    constructor(props){
        super(props);
        this.state={
            currentping:0
        }
        setInterval(this.pingServer, 300);
    }
    pingServer = async () => {
        try {
          const startTime = new Date().getTime();
          await fetch("http://localhost:5000", {mode:'cors'});
          const endTime = new Date().getTime();
          const responseTime = endTime - startTime;
          //console.log(responseTime);
          //this.setState({ state: this.state });
          this.setState({currentping:responseTime})
          //this.state.currentping=responseTime;
          
          return `Server responded in ${responseTime}ms`;
        } catch (error) {
          console.error("Ping failed:", error);
          return "Ping failed";
        }
        
      };
    render(){
        return(
            <h1 id="pingh1" class="pingh1">Ping : {this.state.currentping}</h1>
        )
    }
}
export default Ping;