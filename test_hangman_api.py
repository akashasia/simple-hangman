import hangman_api
import unittest
import json
import flask

class HangmanTest(unittest.TestCase):

    def test_load_words(self):
        words = hangman_api.load_words('nounlist.txt')

        # Check if we loaded all 4554 words in the file
        self.assertEqual(len(words), 4554)

        # Check if the first word was read properly
        self.assertEqual(words[0], 'AARDVARK')

    def test_get_char_positions(self):
        positions = hangman_api.get_char_positions('A','ABRACADABRA')

        # Check if we got the correct positions for 'A'
        self.assertCountEqual(positions, [0, 3, 5, 7, 10])


class HangmanAPITest(unittest.TestCase):

    def setUp(self):
        # Load words
        hangman_api.words = hangman_api.load_words('nounlist.txt')
        # Enable testing
        hangman_api.app.testing = True
        # Get test client
        self.app = hangman_api.app.test_client()

    def test_get_word(self):
        response = self.app.get('/getword')
        json_data = json.loads(response.data.decode())

        # Check if we got a non-zero word length
        self.assertTrue(json_data['word_length'] > 0)

        # This should be a new game, not resumed
        self.assertEqual(json_data['resume_game'], False)

    def test_check_char(self):
        with hangman_api.app.test_client() as client:
            # Get a word to init the session
            client.get('/getword')

            # Cheat and get the word from the session
            word = flask.session['word']

            # Guess the first char of the word
            response = client.get('/checkchar?c=' + word[0])
            json_data = json.loads(response.data.decode())

            # Check if all the positions were correct
            actual_positions = hangman_api.get_char_positions(word[0], word)
            self.assertCountEqual(json_data['positions'], actual_positions)


    def test_get_statistics(self):
        # Get a word so the app/session is Initialized
        self.app.get('/getword')

        response = self.app.get('/getstats')
        json_data = json.loads(response.data.decode())

        # For a new session, stats should be 0
        self.assertEqual(json_data['gamesLost'], 0)
        self.assertEqual(json_data['gamesWon'], 0)

    def test_lose_scenario(self):
        with hangman_api.app.test_client() as client:
            response = client.get('/getword')
            json_data = json.loads(response.data.decode())

            tries = 0

            # Lose the game by guessing each character not in the word, one by one
            for char in hangman_api.letters:
                if char in set(flask.session['word']):
                    continue

                tries += 1
                response = client.get('/checkchar?c=' + char)
                data = json.loads(response.data.decode())

                if tries == 10:
                    # Stop after 10 wrong tries
                    break

            # The last response should have gameStatus as -1 indicating a loss
            self.assertEqual(data['gameStatus'], -1)

    def test_win_scenario(self):
        with hangman_api.app.test_client() as client:
            response = client.get('/getword')
            json_data = json.loads(response.data.decode())

            # Win the game by guessing each char in the word
            for char in set(flask.session['word']):
                response = client.get('/checkchar?c=' + char)
                data = json.loads(response.data.decode())

            # Last response should have gameStatus as 1 indicating a win
            self.assertEqual(data['gameStatus'], 1)


    def tearDown(self):
        pass


if __name__ == '__main__':
    unittest.main()
