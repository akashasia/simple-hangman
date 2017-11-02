# simple-hangman
A hangman clone using React.js and Bootstrap and with Flask providing the API. All business
logic is performed in the back-end to prevent cheating.

The instructions assume the current directory to be the project directory.

## For the back-end API
Requires Python3 and the following python libraries to function:
- Flask (`pip install flask`)
- Flask-CORS (`pip install flask-cors`)

After installing the above, run `python hangman_api.py` to start the service.
It should be running on port 5000.

## For the front-end
Requires Node.js and NPM to be installed(http://nodejs.org)

Once installed, execute `npm install` to install all the dependencies required.

Run `npm start` to start the development web server. It should serve the website
at http://localhost:3000

## Running the Test Cases

Run `python test_hangman_api.py` to run the tests.
