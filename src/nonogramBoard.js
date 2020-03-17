import React from 'react';
import App from './App';
 
class NonogramBoard extends React.Component {
  constructor() {
    super();
    this.state = {
      message: "Mouse Event"
    }
    this.handleClick = this.handleClick.bind(this);
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
        <App
            message={this.message}
        />
      );
  }
}
 
export default NonogramBoard;
