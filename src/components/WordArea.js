import React, { Component } from 'react';

class WordArea extends Component {

  constructor(props){
    super(props);
  } 

  render() {
    return (
      <div className="WordArea">
        {this.props.blanks}
      </div>
    );
  }
}

export default WordArea;
