import React, { Component } from 'react';

class WordArea extends Component {

  render() {
    if (this.props.gameStatus === -1){
      return (
        <div className="WordArea lost">
          {this.props.blanks}
        </div>
      );
    }
    else{
      return (
        <div className="WordArea">
          {this.props.blanks}
        </div>
      );
    }
  }
}

export default WordArea;
