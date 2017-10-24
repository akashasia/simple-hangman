import React, { Component } from 'react';

class CharSelector extends Component {

  static defaultProps = {
    chars : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  }

  constructor(props){
    super(props);
    this.onclick = this.onclick.bind(this);
    this.buttonstates = []

    for(var i = 0; i < this.props.chars.length; i++){
      this.buttonstates[i] = false
    }
  }

  onclick(e){
    var target = e.target;

    fetch('http://localhost:5000/checkchar?c=' + e.target.id, {credentials : 'include'})
    .then(results => {
      results.json().then(json => {
        console.log(json)
        this.props.onCharSelected(json)
        target.disabled = true; //disable the button
      });
    });
  }

  render() {
    let char_buttons = this.props.chars.map((char, i) => {
      return (<button className = "CharButton" id = {char} key = {char} onClick = {this.onclick}>{char}</button>);
    });

    return (
      <div className="CharSelector">
        {char_buttons}
      </div>
    );
  }
}

export default CharSelector;
