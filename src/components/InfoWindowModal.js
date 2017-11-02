import React, { Component } from 'react';
import ReactModal from 'react-modal';

class InfoWindowModal extends Component {

  constructor () {
    super();

    this.state = {
      showModal: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal () {
    this.setState({ showModal: true });
  }

  handleCloseModal () {
    this.setState({ showModal: false });
  }

  render () {
    return (
        <ReactModal
           isOpen={this.state.showModal}
           contentLabel="Info"
           closeTimeoutMS={200}>

            <div className="modal-dialog">
              <div className="modal-content">

                <div className="modal-header">
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
                   If the word is completed before this, the game is won.
                  </p>
                  <p> P.S. <strong> The keyboard can also be used as a valid input method </strong> </p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" onClick={this.handleCloseModal}>Back to Game</button>
                </div>
              </div>
            </div>

        </ReactModal>
    );
  }
}

export default InfoWindowModal;
