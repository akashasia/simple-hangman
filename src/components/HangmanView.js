import React, { Component } from 'react';

class HangmanView extends Component {

  constructor(props){
    super(props);
    this.state = {
      status : -1,
    }
  }

  // componentDidMount(){
  //   this.updateCanvas();
  // }

  clearCanvas(){
    this.setState({
      status : -1,
    })

    const context = this.refs.canvas.getContext('2d');
    context.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
    this.updateCanvas();
  }

  updateCanvas(){
    var status = this.state.status;
    status += 1;

    const context = this.refs.canvas.getContext('2d');

    context.beginPath();

    switch(status){
      case 1:
        context.moveTo(9,355);
        context.lineTo(205,355);
        break;
      case 2:
        context.moveTo(9,355);
        context.lineTo(9,24);
        break;
      case 3:
      context.moveTo(9,24);
      context.lineTo(94,24);
      break;

      case 4:
      context.moveTo(94,24);
      context.lineTo(95,59);
      break;

      case 5:
      context.moveTo(98, 90.5 - 31.5);
      context.bezierCurveTo(98 + (0.5522847498307936 * 31), 90.5 - 31.5,  98 + 31, 90.5 - (0.5522847498307936 * 31.5), 98 + 31, 90.5);
      context.bezierCurveTo(98 + 31, 90.5 + (0.5522847498307936 * 31.5), 98 + (0.5522847498307936 * 31), 90.5 + 31.5, 98, 90.5 + 31.5);
      context.bezierCurveTo(98 - (0.5522847498307936 * 31), 90.5 + 31.5, 98 - 31, 90.5 + (0.5522847498307936 * 31.5), 98 - 31, 90.5);
      context.bezierCurveTo(98 - 31, 90.5 - (0.5522847498307936 * 31.5), 98 - (0.5522847498307936 * 31), 90.5 - 31.5, 98, 90.5 - 31.5);
      break;

      case 6:
      context.moveTo(94,122);
      context.lineTo(93,271);
      break;

      case 7:
      context.moveTo(93,271);
      context.lineTo(58,326);
      break;

      case 8:
      context.moveTo(93,271);
      context.lineTo(127,320);
      break;

      case 9:
      context.moveTo(93,165);
      context.lineTo(115,264);
      break;

      case  10:
      context.moveTo(93,165);
      context.lineTo(131,224);
      break;


    }

    // context.scale(2,2);
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
