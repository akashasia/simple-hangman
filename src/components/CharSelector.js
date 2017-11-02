import React, { Component } from 'react';

class CharSelector extends Component {

  static defaultProps = {
    chars : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  };

  constructor(props){
    super(props);
    this.onCharSelected = this.onCharSelected.bind(this);
    this.onClick = this.onClick.bind(this);

    var buttonStates = []
    for(var i = 0; i < this.props.chars.length; i++){
      buttonStates[i] = false;
    }

    this.state = {
      buttonStates : buttonStates,
      style : {},
    }
  }

  getCharIndex(char){
    var ascii = char.charCodeAt(0)
    return ascii - 65;
  }

  resetButtonStates(){
    // Called from parent to enable all buttons
    var buttonStates = this.state.buttonStates.slice();

    //Enable all buttons
    for(var i = 0; i < this.props.chars.length; i++){
      buttonStates[i] = false;
    }

    // Disable used chars from saved game, if any
    for(i = 0; i < this.props.usedChars.length; i++){
      var buttonIndex = this.getCharIndex(this.props.usedChars[i])
      buttonStates[buttonIndex] = true;
    }

    this.setState({buttonStates : buttonStates});
  }

  onCharSelected(char){

    this.setState({
      style : {
        opacity: 0.5,
        pointerEvents: 'none',
        transition: 'opacity 100ms ease-in-out',
      }
    });

    fetch('http://localhost:5000/checkchar?c=' + char, {credentials : 'include'})
    .then(results => {
      results.json().then(json => {
        this.props.onCharSelected(json);

        var buttonStates = this.state.buttonStates.slice();

        if (json.gameStatus !== 0){
          // Disable all buttons if game is not in progress i.e won or lost
          for(var i = 0; i < this.props.chars.length; i++){
            buttonStates[i] = true;
          }
        }
        else {
          buttonStates[this.props.chars.indexOf(char)] = true;
        }

        this.setState({
          buttonStates : buttonStates,
          style : {},
        });

      });
    });
  }

  onClick(e){
    this.onCharSelected(e.target.id);
  }

  render() {

    let char_buttons = this.props.chars.map((char, i) => {
      return (<button className = "CharButton btn btn-lg btn-primary" id = {char} key = {char} onClick = {this.onClick}
                    disabled={this.state.buttonStates[i]}>{char}</button>);
    });

    return (
      <div className="CharSelector" style={this.state.style}>
        {char_buttons}
      </div>
    );
  }
}

export default CharSelector;
