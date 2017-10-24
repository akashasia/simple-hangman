import React, { Component } from 'react';
import WordArea from './components/WordArea'
import CharSelector from './components/CharSelector'
import './App.css';
// import logo from './logo.svg';


// Allow keyboard input?

class App extends Component {
  constructor(){
    super();
    this.charSelected = this.charSelected.bind(this);
    this.getNewWord = this.getNewWord.bind(this);
    this.state = {
      blanks : [],
      disableAll : 'false',
    }
  }

  getNewWord(){
    fetch('http://localhost:5000/getword', {credentials : 'include'}) //same-origin
    .then(results => {
      results.json().then(json => {
        console.log(json);
        let blanks = []
        for(var i = 0; i < json.word_length; i++){
          blanks[i] = ' _ ';
        }
        this.setState({blanks:blanks})

      });
    });
  }

  componentWillMount(){
    this.getNewWord()
  }

  charSelected(responseJson){
    console.log('Selected ' + responseJson.positions);
    var blanks = this.state.blanks

    // for(var i = 0; i < responseJson.positions.length; i++){
    for(var i in responseJson.positions){
      blanks[responseJson.positions[i]] = ' ' + responseJson.character + ' ';
    }

    this.setState({blanks : blanks});
  }

  render() {
    return (
      <div className = "App" >
        <WordArea blanks={this.state.blanks} onBlanksChange={this.updateBlanks} />
        <button disableall={this.state.disableAll} onClick={this.getNewWord}>Restart</button>
        <CharSelector onCharSelected={this.charSelected} />
      </div>
    );
  }
}

export default App;
