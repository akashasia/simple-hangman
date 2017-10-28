import React, { Component } from 'react';

class WinLossIndicator extends Component {

  headerBar(){
    return (
      <div className="header-container">
          <a title="New Game" href="../" className="header-title">HANGMAN </a>
        <div className="header-score-area">
          <ul className="header-scores">
            <li><i className="glyphicon glyphicon-thumbs-up"/> <span title="Games Won" className="badge">{this.props.won}</span></li>
            <li><i className="glyphicon glyphicon-thumbs-down"/> <span title="Games Lost" className="badge">{this.props.lost}</span></li>
          </ul>
        </div>
      </div>
      );
  }

  render() {
    let statusMessage = null;
    if (this.props.gameStatus === -1){
      statusMessage =  <div className="alert alert-danger"> <strong>Sorry!</strong> You lost. <strong>Try again by starting a new game </strong> </div>;
    }
    else if (this.props.gameStatus === 1){
      statusMessage = <div className="alert alert-success"> <strong> Congratulations! </strong> You won! </div>;
    }
    else{
      statusMessage = null
    }

    return (

      <div className="WinLossIndicator">
        {this.headerBar()}
        {statusMessage}
      </div>
    );
  }
}

export default WinLossIndicator;
