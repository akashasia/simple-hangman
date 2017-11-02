from flask import Flask, session, jsonify, request, make_response
from flask_cors import CORS
import random
import re
from functools import wraps, update_wrapper
from datetime import datetime

# Create our flask app
app = Flask(__name__)
# Set our secret key for session management
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

# Allow cross-origin resource sharing between app and front-end
CORS(app, resources = {'*' : {'origins' : 'http://localhost:3000'}}, supports_credentials = True)

words = []
letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

def nocache(view):
    """Decorator to explicitly state that a response to the API call should
    not be cached by the client
    """
    @wraps(view)
    def no_cache(*args, **kwargs):
        response = make_response(view(*args, **kwargs))
        response.headers['Last-Modified'] = datetime.now()
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '-1'
        return response

    return update_wrapper(no_cache, view)

def load_words(file_path):
    """ Loads words from a file to be used
    for Hangman
    """

    with open(file_path) as word_file:
        words = []

        for word in word_file.readlines():
            word = word.strip().upper()

            # Only keep characters in the alphabet
            # Useful for removing hypens and other special characters
            word = ''.join(char for char in word if char.isalpha())

            if word:
                words.append(word)

        return words

def reset_session():
    """Resets the current session to prepare for a new game/word
    Statistics are not cleared and are maintained between games
    """

    session['tries'] = [] # Incorrect guesses
    session['correct_chars'] = [] # Correct guesses
    session['gameStatus'] = 0 # -1,0 or 1 for lost, in progress or won

@app.route('/getword')
@nocache # Make sure we're not reusing old cached words (reopen closed tab issue)
def get_word():
    """API call to fetch a new word or return the current word if a game
    was left while in progress (to allow resuming that game)
    """
    new_game = bool(request.args.get('newgame'))
    response_dict = {}

    if new_game or not session or session['gameStatus'] != 0:
        # Explicit new game requested or
        # App being opened for the first time (or cookies cleared)
        # or gameStatus != 0 i.e. no game is in progress

        word = random.choice(words)
        reset_session()
        session['word'] = word

        if 'gamesWon' not in session:
            session['gamesWon'] = 0
            session['gamesLost'] = 0
        elif new_game and session['gameStatus'] == 0:
            # Starting a new game without finishing previous
            session['gamesLost'] = session['gamesLost'] + 1

        response_dict['resume_game'] = False

    else:
        # Game is in progress, return saved game state so that player may continue

        response_dict['tries'] = session['tries']
        correct_chars = {}

        for char in session['correct_chars']:
            correct_chars[char] = get_char_positions(char, session['word'])

        response_dict['correct_chars'] = correct_chars

        # Indicator to show that old game was resumed
        response_dict['resumed_game'] = True

    response_dict['word_length'] = len(session['word'])
    return jsonify(response_dict)


def get_char_positions(char, word):
    """Returns all indices of occurances of a particular character in a word"""
    return [match.start() for match in re.finditer(char, word)]

@app.route('/getstats')
def get_statistics():
    """Simple API call to get updated statistics for the player"""
    response = jsonify({'gamesWon' : session['gamesWon'] , 'gamesLost' : session['gamesLost']})
    return response

@app.route('/checkchar')
def check_char():
    """API call that accepts a character as an input and returns all positions
    where that character appears in the current word
    """

    c = request.args.get('c')
    responseObj = {}

    if 'word' not in session:
        responseObj['errorCode'] = -1
        responseObj['errorMsg'] = 'No Session Initialized. Use getword first.'

    elif c in session['word']:
        correct_chars = session['correct_chars']
        correct_chars.append(c)
        session['correct_chars'] = correct_chars

        responseObj['character'] = c
        responseObj['positions'] = get_char_positions(c, session['word'])
    else:
        tries = session['tries']
        tries.append(c)
        session['tries'] = tries
        responseObj['character'] = c
        responseObj['positions'] = None

    # Check if the game is lost
    if len(session['tries']) >= 10:
        responseObj['gameStatus'] = -1
        session['gameStatus'] = -1
        responseObj['word'] = session['word']
        session['gamesLost'] = session['gamesLost'] + 1

    # Check if the game is won
    elif len(session['correct_chars']) == len(set(session['word'])):
        responseObj['gameStatus'] = 1
        session['gameStatus'] = 1
        session['gamesWon'] = session['gamesWon'] + 1

    # If neither, game is still in progress
    else:
        responseObj['gameStatus'] = 0

    response = jsonify(responseObj)
    return response

if __name__ == '__main__':
    words = load_words('nounlist.txt')
    app.run(debug = True)
