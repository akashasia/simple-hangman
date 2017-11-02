import React, { Component } from 'react';
import WordArea from './components/WordArea'
import CharSelector from './components/CharSelector'
import HangmanView from './components/HangmanView'
import HeaderView from './components/HeaderView'
import InfoWindowModal from './components/InfoWindowModal'
import ConfirmNewGameModal from './components/ConfirmNewGameModal'
import Footer from './components/Footer'

import './App.css';

class App extends Component {

  constructor(){
    super();

    this.charSelected = this.charSelected.bind(this);
    this.getWord = this.getWord.bind(this);
    this.getNewWord = this.getNewWord.bind(this);
    this.updateStatistics = this.updateStatistics.bind(this);
    this.onNewGameRequested = this.onNewGameRequested.bind(this);
    this.showInfo = this.showInfo.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.state = {
      blanks : [],
      gameStatus : 0,
      gamesWon : 0,
      gamesLost : 0,
      keyboardAllowed : true,
      usedChars : [],
    };
  }

  onKeyDown(event){
    if (this.state.keyboardAllowed){
      const keyPressed = event.key.toUpperCase();
      //Check if a valid button is pressed i.e. characters A to Z
      if (keyPressed.length === 1){
         let charCode = keyPressed.charCodeAt(0);
         if (charCode >= 65 && charCode <= 90){
           //Make sure we dont try a character that's already used
           if (this.state.usedChars.indexOf(keyPressed) === -1){
             // Disable further keybaord input until request complete
             this.setState({keyboardAllowed : false});
             this.charselector.onCharSelected(keyPressed);
            }
         }
      }
    }
  }

  updateStatistics(){
    fetch('http://localhost:5000/getstats', {credentials : 'include'})
    .then(results => {
      results.json().then(json => {
        this.setState({gamesWon:json.gamesWon, gamesLost:json.gamesLost});
      });
    });
  }

  onNewGameRequested(){
    if (this.state.gameStatus === 0){
      // Game is in progress, inform the user that this will count as a loss
      this.refs.newGameModal.handleOpenModal();
    }
    else {
      this.getWord(false);
    }
  }

  getWord(newWord){
    var url = 'http://localhost:5000/getword';

    if (newWord)
      url = url + '?newgame=True';

    fetch(url, {credentials : 'include'})
    .then(results => {
      this.updateStatistics();

      results.json().then(json => {
        let blanks = [];
        let usedChars = [];

        for(var i = 0; i < json.word_length; i++){
          blanks[i] = ' _ ';
        }

        if (json.resumed_game === true){
          // load saved game state

          usedChars = json.tries.slice();

          // load correctly guessed chars for display
          for (var char in json.correct_chars){

            //add correctly guessed characters to usedChars as well
            usedChars.push(char);

            for(i = 0; i < json.correct_chars[char].length; i++){
              var index = json.correct_chars[char][i]
              blanks[index] = char;
            }
          }
        }

        this.setState({
          blanks : blanks,
          gameStatus : 0,
          usedChars : usedChars,
        });

        // update button states
        this.charselector.resetButtonStates();

        // update hangman stick figure
        if (usedChars.length === 0) {
          this.hangmanview.clearCanvas();
        }
        else {
          this.hangmanview.updateCanvasExplicit(json.tries.length);
        }

      });
    });
  }

  componentWillMount(){
    this.getWord(false);
  }

  componentDidMount(){
    document.addEventListener("keydown", this.onKeyDown);
  }

  charSelected(responseJson){
    var blanks = this.state.blanks;

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
      this.hangmanview.updateCanvas();
    }

    var usedChars = this.state.usedChars;
    usedChars.push(responseJson.character);

    this.setState({
      blanks : blanks,
      gameStatus : responseJson.gameStatus,
      usedChars : usedChars,
      keyboardAllowed : true,
    });
  }

  showInfo(){
    this.refs.infoWindow.handleOpenModal();
  }

  getNewWord(){
    this.getWord(true);
  }

  render() {
    return (
      <div ref="appContainer" className = "App" >
        <HeaderView gameStatus={this.state.gameStatus} won={this.state.gamesWon} lost={this.state.gamesLost}/>

          <div className="container">
            <InfoWindowModal ref="infoWindow"/>
            <ConfirmNewGameModal ref="newGameModal" onConfirm={this.getNewWord}/>

            <div className="col-md-6 text-center">
              <HangmanView ref={instance => {this.hangmanview = instance;}}/>
            </div>

            <div className="col-md-6 text-center">
                <a className="btn btn-default" onClick={this.onNewGameRequested}>
                  <i className="glyphicon glyphicon-repeat"></i> New Game
                </a>
                <a className="btn btn-default"  data-toggle="modal" data-target="#infoWindow" onClick={this.showInfo}>
                  <i className="glyphicon glyphicon-info-sign" ></i> How to Play
                </a>
                <WordArea blanks={this.state.blanks} gameStatus={this.state.gameStatus}/>
                <CharSelector usedChars = {this.state.usedChars} ref={instance => {this.charselector = instance;}}
                    onCharSelected={this.charSelected} />
            </div>

          </div>

          <Footer />
      </div>
    );
  }
}

export default App;
