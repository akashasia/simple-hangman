import React, { Component } from 'react';

class CharSelector extends Component {

  static defaultProps = {
    chars : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  }

  constructor(props){
    super(props);
    this.onclick = this.onclick.bind(this);
    // this.resetButtonStates = this.resetButtonStates.bind(this);

    var buttonStates = []
    for(var i = 0; i < this.props.chars.length; i++){
      buttonStates[i] = false;
    }

    this.state = {
      buttonStates : buttonStates,
    }
  }

  resetButtonStates(){
    var buttonStates = this.state.buttonStates.slice();

    for(var i = 0; i < this.props.chars.length; i++){
      buttonStates[i] = false;
    }

    this.setState({buttonStates : buttonStates});
  }

  onclick(e){
    var target = e.target;

    fetch('http://localhost:5000/checkchar?c=' + e.target.id, {credentials : 'include'})
    .then(results => {
      results.json().then(json => {
        console.log(json)
        this.props.onCharSelected(json)
        // target.disabled = true; //disable the button
        var buttonStates = this.state.buttonStates.slice();

        if (json.gameStatus === 1 || json.gameStatus === -1){
          for(var i = 0; i < this.props.chars.length; i++){
            buttonStates[i] = true;
          }
        }
        else {
          buttonStates[this.props.chars.indexOf(target.id)] = true;
        }

        this.setState({buttonStates : buttonStates});
      });
    });
  }

  render() {

    let char_buttons = this.props.chars.map((char, i) => {
      return (<button className = "CharButton btn btn-lg btn-primary" id = {char} key = {char} onClick = {this.onclick}
                    disabled={this.state.buttonStates[i]}>{char}</button>);
    });

    return (
      <div className="CharSelector">
        {char_buttons}
      </div>
    );
  }
}

export default CharSelector;
