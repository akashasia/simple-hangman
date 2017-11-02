import React, { Component } from 'react';

class HangmanView extends Component {

  constructor(props){
    super(props);
    this.state = {
      status : -1,
    };
  }

  clearCanvas(){
    this.setState({
      status : -1,
    });

    const context = this.refs.canvas.getContext('2d');
    context.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
    this.updateCanvas();
  }

  updateCanvas(){
    var status = this.state.status;
    status += 1;

    this.updateCanvasExplicit(status);
  }

  updateCanvasExplicit(status){
    // Hangman canvas drawing code generated with help from
    // http://www.cs.toronto.edu/~noam/c-generator.html

    const context = this.refs.canvas.getContext('2d');
    context.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
    context.lineWidth = 2;
    context.beginPath();
    console.log(status)
    
    if (status >= 1){
      context.moveTo(9,355);
      context.lineTo(205,355);
    }

    if (status >= 2){
      context.moveTo(9,355);
      context.lineTo(9,24);
    }

    if (status >= 3){
      context.moveTo(9,24);
      context.lineTo(94,24);
    }

    if (status >= 4){
      context.moveTo(94,24);
      context.lineTo(95,59);
    }

    if (status >= 5){
      context.moveTo(98, 90.5 - 31.5);
      context.bezierCurveTo(98 + (0.5522847498307936 * 31), 90.5 - 31.5,  98 + 31, 90.5 - (0.5522847498307936 * 31.5), 98 + 31, 90.5);
      context.bezierCurveTo(98 + 31, 90.5 + (0.5522847498307936 * 31.5), 98 + (0.5522847498307936 * 31), 90.5 + 31.5, 98, 90.5 + 31.5);
      context.bezierCurveTo(98 - (0.5522847498307936 * 31), 90.5 + 31.5, 98 - 31, 90.5 + (0.5522847498307936 * 31.5), 98 - 31, 90.5);
      context.bezierCurveTo(98 - 31, 90.5 - (0.5522847498307936 * 31.5), 98 - (0.5522847498307936 * 31), 90.5 - 31.5, 98, 90.5 - 31.5);
    }

    if (status >= 6){
      context.moveTo(94,122);
      context.lineTo(93,271);
    }

    if (status >= 7){
      context.moveTo(93,271);
      context.lineTo(58,326);
    }

    if (status >= 8){
      context.moveTo(93,271);
      context.lineTo(127,320);
    }

    if (status >= 9){
      context.moveTo(93,165);
      context.lineTo(115,264);
    }

    if (status >= 10){
      context.moveTo(93,165);
      context.lineTo(131,224);
    }

    context.stroke();
    this.setState({status : status});
  }

  render() {
    return (
      <div className="HangmanView">
        <canvas ref="canvas" width = {220} height={390} />
      </div>
    );
  }
}

export default HangmanView;
