# from flask_restful import Resource, Api


# Standard flask session stores session variables in cookies on client-side
# We need a little more security
# from flask_session import Session



def add_to_wrong(c):
    if 'wrong_chars' in session:
        session['wrong_chars'].append(c)
    else:
        session['wrong_chars'] = [c]

def add_to_correct(c):
    if 'correct_chars' in session:
        session['correct_chars'].append(c)
    else:
        session['correct_chars'] = [c]


# api = Api(app)

# SESSION_TYPE = 'redis'
# SESSION_TYPE = 'filesystem'
# app.config.from_object(__name__)
# Session(app)

# class HelloWorld(Resource):
#     def get(self):
#         session[random.randint(1,10)] = '5'
#         return {'hello': 'world'}
#
# api.add_resource(HelloWorld, '/sayhello')


# Session Examples
# @app.route('/set/')
# def set():
#     session['key'] = 'value'
#     return 'ok'
#
# @app.route('/get/')
# def get():
#     return session.get('key', 'not set')
