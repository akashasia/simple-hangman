import React, { Component } from 'react';

class WinLossIndicator extends Component {

  // constructor(props){
  //   super(props);
  // }

  headerBar(){
    return (
    <div className="navbar navbar-default navbar-fixed-top">
      <div className="container">

        <div className="navbar-header">
          <a href="../" className="navbar-brand">Hangman</a>
        </div>

        <div className="navbar-collapse collapse" id="navbar-main">
          <ul className="nav navbar-nav navbar-right">
            <li>Games Won : {this.props.won}</li>
            <li>Games Lost : {this.props.lost}</li>
          </ul>
        </div>

      </div>
    </div>);
  }

  // oldHeader(){
  //   <div className="header">
  //
  //     <div className="title align-left"> HANGMAN </div>
  //     <div className="statistics align-right">
  //       Games Won : {this.props.won}
  //       <br />
  //       Games Lost : {this.props.lost}
  //     </div>
  //   </div>
  // }

  render() {

    let statusMessage = null;
    if (this.props.gameStatus === -1){
      statusMessage =  <div className="alert alert-danger"> YOU LOST! </div>;
    }
    else if (this.props.gameStatus === 1){
      statusMessage = <div className="alert alert-success">  YOU WIN! </div>;
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
