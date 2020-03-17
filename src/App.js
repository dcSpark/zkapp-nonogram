import React from 'react';
import NonogramBoard from './nonogramBoard';
import './App.css';
 
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Mouse Event",
      seconds: 0,
      timer: "00:00:00",
    }
  }

  tick() {
    this.setState(state => ({
      seconds: state.seconds + 1,
      timer: new Date(1000 * this.state.seconds).toISOString().substr(11, 8)
    }))
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }
 
  handleClick = (event) => {
    if (event.button === 0) {
      if (event.type === "mousedown") {
        this.setState({ message: "Left Mouse Down"});
      } else if (event.type === "mouseup") {
        this.setState({ message: "Left Mouse Up"});
      }
    } else if (event.button === 2) {
      if (event.type === "mousedown") {
        this.setState({ message: "Right Mouse Down"});
      } else if (event.type === "mouseup") {
        this.setState({ message: "Right Mouse Up"});
      }
    }
  }
 
  render() {
    return (
      <div onContextMenu={(e)=> e.preventDefault()}>
        <div className="App-header" onMouseDown={ this.handleClick } onMouseUp={ this.handleClick }>
            { this.state.message }
            <div>
              { this.state.timer }
            </div>
        </div>
      </div>
    );
  }
}
 
export default App;
