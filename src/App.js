import React, { Component } from 'react';
import WordArea from './components/WordArea'
import CharSelector from './components/CharSelector'
import WinLossIndicator from './components/WinLossIndicator'
import './App.css';
// import logo from './logo.svg';
// Allow keyboard input?

class App extends Component {


  constructor(){
    super();
    this.charSelected = this.charSelected.bind(this);
    this.getNewWord = this.getNewWord.bind(this);
    this.updateStatistics = this.updateStatistics.bind(this);

    this.state = {
      blanks : [],
      gameStatus : 0,
      gamesWon : 0,
      gamesLost : 0
    }

    this.updateStatistics()
  }

  updateStatistics(){
    fetch('http://localhost:5000/getstats', {credentials : 'include'}) //same-origin
    .then(results => {
      results.json().then(json => {
        this.setState({gamesWon:json.gamesWon, gamesLost:json.gamesLost});
      });
    });
  }

  getNewWord(){
    fetch('http://localhost:5000/getword', {credentials : 'include'}) //same-origin
    .then(results => {
      results.json().then(json => {
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

    if (responseJson.gameStatus !== 0){
       this.updateStatistics();
    }

    this.setState({blanks : blanks, gameStatus : responseJson.gameStatus});
  }

  render() {
    return (
      <div className = "App" >
        <WordArea blanks={this.state.blanks} onBlanksChange={this.updateBlanks} />
        <button disableall={this.state.disableAll} onClick={this.getNewWord}>Restart</button>
        <CharSelector onCharSelected={this.charSelected} />
        <WinLossIndicator gameStatus={this.state.gameStatus} won={this.state.gamesWon} lost={this.state.gamesLost}/>
      </div>
    );
  }
}

export default App;
