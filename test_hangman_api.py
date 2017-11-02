import unittest
import hangman_api
import json

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
        self.assertCountEqual(positions, [0, 3, 5,  7, 10])


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


    def tearDown(self):
        pass


if __name__ == '__main__':
    unittest.main()
