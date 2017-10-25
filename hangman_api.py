from flask import Flask, session, jsonify, request
import random
import re
from string import ascii_letters

app = Flask(__name__)

words = []
letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

def load_words(file_path):
    with open(file_path) as word_file:
        global words
        for word in word_file.readlines():
            word = word.strip().upper()

            # Only keep characters in the alphabet
            # Useful for removing hypens and other special characters
            word = ''.join(char for char in word if char.isalpha())

            if word:
                words.append(word)

def init_session():
    session['tries'] = 0
    session['correct_chars'] = 0
    if 'gamesWon' not in session:
        session['gamesWon'] = 0
        session['gamesLost'] = 0


@app.route('/getword')
def get_word():
    word = random.choice(words)
    # session.clear()
    session['word'] = word
    init_session()
    response = jsonify({'word_length' : len(word)})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Credentials', 'true')

    return response

@app.route('/getstats')
def get_statistics():
    response = jsonify({'gamesWon' : session['gamesWon'] , 'gamesLost' : session['gamesLost']})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Credentials', 'true')

    return response

@app.route('/checkchar')
def check_char():
    c = request.args.get('c')
    responseObj = {}

    if 'word' not in session:
        responseObj['errorCode'] = -1
        responseObj['errorMsg'] = 'No Session Initialized. Use getword first.'

    elif c in session['word']:
        session['correct_chars'] = session['correct_chars'] + 1
        responseObj['character'] = c
        responseObj['positions'] = [match.start() for match in re.finditer(c, session['word'])]
    else:
        session['tries'] = session['tries'] + 1
        responseObj['character'] = c
        responseObj['positions'] = None

    if session['tries'] >= 5:
        responseObj['gameStatus'] = -1
        session['gamesLost'] = session['gamesLost'] + 1
    elif session['correct_chars'] == len(set(session['word'])):
        responseObj['gameStatus'] = 1
        session['gamesWon'] = session['gamesWon'] + 1
    else:
        responseObj['gameStatus'] = 0

    response = jsonify(responseObj)
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

if __name__ == '__main__':
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

    load_words('nounlist.txt')
    app.run(debug = True)
