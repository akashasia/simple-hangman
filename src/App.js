import React, { Component } from 'react';
import WordArea from './components/WordArea'
import CharSelector from './components/CharSelector'
import HangmanView from './components/HangmanView'
import WinLossIndicator from './components/WinLossIndicator'
import './App.css';

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
        this.setState({blanks:blanks, gameStatus : 0})
        this.charselector.resetButtonStates();
        this.hangmanview.clearCanvas();
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

    if (responseJson.positions === null){
      console.log('Hi')
      this.hangmanview.updateCanvas()
    }

    this.setState({blanks : blanks, gameStatus : responseJson.gameStatus});
  }

  footer(){
    return (<footer className="footer">
      <div className="container">
        <p className="text-muted">@akashasia</p>
      </div>
    </footer>);
    // <button className="btn btn-default btn-primary icon-repeat" onClick={this.getNewWord}>&nbsp;New Game</button>

  }



  render() {
    return (
      <div className = "App" >
        <WinLossIndicator gameStatus={this.state.gameStatus} won={this.state.gamesWon} lost={this.state.gamesLost}/>
          <div className="container">

            <div className="col-md-6 text-center">
              <HangmanView ref={instance => {this.hangmanview = instance;}}/>
            </div>
            <div className="col-md-6 text-center">
            <a className="btn btn-default" onClick={this.getNewWord}>
              <i className="fa fa-refresh fa-lg"></i> New Game</a>
                <WordArea blanks={this.state.blanks} onBlanksChange={this.updateBlanks} />
                <CharSelector ref={instance => {this.charselector = instance;}} onCharSelected={this.charSelected} />
            </div>
          </div>
          {this.footer()}
      </div>
    );
  }
}

export default App;
