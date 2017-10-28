import React, { Component } from 'react';
import WordArea from './components/WordArea'
import CharSelector from './components/CharSelector'
import HangmanView from './components/HangmanView'
import HeaderView from './components/HeaderView'
import './App.css';

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
    console.log(this.state.blanks)
    fetch('http://localhost:5000/getword', {credentials : 'include'}) //same-origin, include
    .then(results => {
      this.updateStatistics()

      results.json().then(json => {
        let blanks = []
        for(var i = 0; i < json.word_length; i++){
          blanks[i] = ' _ ';
        }
        console.log(json)
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
    var blanks = this.state.blanks

    for(var i in responseJson.positions){
      blanks[responseJson.positions[i]] = ' ' + responseJson.character + ' ';
    }

    if (responseJson.gameStatus !== 0){
       this.updateStatistics();

       if (responseJson.gameStatus === -1){
         // If the player has lost, show the actual word
         var chars = responseJson.word.split("");
         for(i = 0; i < chars.length; i++ ){
             blanks[i] = ' ' + chars[i] + ' ';
         }
       }
    }

    if (responseJson.positions === null){
      // No positions means the character selected was incorrect
      this.hangmanview.updateCanvas()
    }

    this.setState({blanks : blanks, gameStatus : responseJson.gameStatus});
  }

  footer(){
    return (<footer className="footer">
      <div className="container">
        <p className="text">@akashasia</p>
      </div>
    </footer>);
  }

  infoWindow(){
    return(
      <div id="myModal" className="modal fade" role="dialog">
      <div className="modal-dialog">

        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal">&times;</button>
            <h4 className="modal-title">Hangman</h4>
          </div>
          <div className="modal-body">
            <p>The word to guess is represented by a row of dashes, representing
             each letter of the word. If the guessing player suggests a letter
             which occurs in the word, it shall appear in all its correct
             positions. If the suggested letter does not occur in the word,
             one element of a hanged man stick figure shall be drawn
             as a tally mark.</p>
             <p>
             After 10 tries, if the word is incomplete, the game is lost.
             If the word is completed before this, that game is won.
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" data-dismiss="modal">Back to Game</button>
          </div>
        </div>

      </div>
    </div>
  );
  }

  render() {
    return (
      <div className = "App" >
        <HeaderView gameStatus={this.state.gameStatus} won={this.state.gamesWon} lost={this.state.gamesLost}/>
          <div className="container">
          {this.infoWindow()}

            <div className="col-md-6 text-center">
              <HangmanView ref={instance => {this.hangmanview = instance;}}/>
            </div>
            <div className="col-md-6 text-center">
                <a className="btn btn-default" onClick={this.getNewWord}>
                  <i className="glyphicon glyphicon-repeat"></i> New Game
                </a>
                <a className="btn btn-default"  data-toggle="modal" data-target="#myModal">
                  <i className="glyphicon glyphicon-info-sign"></i> How to Play
                </a>
                <WordArea blanks={this.state.blanks} gameStatus={this.state.gameStatus}/>
                <CharSelector ref={instance => {this.charselector = instance;}} onCharSelected={this.charSelected} />
            </div>
          </div>
          {this.footer()}
      </div>
    );
  }
}

export default App;
