from flask import Flask, request, session, redirect, jsonify
from config.jconfig import render
from models.program import Program
from models.user import User
from models.stats import Stat, StatType
from config.dbconfig import store
from util.pbkdf2 import pbkdf2_hex
from util.salts import getRandomSalt

app = Flask(__name__)


def getUser():
    """
    get User with user_id
    """
    user = store.find(User, User.id == session['userid']).one()
    return user



@app.route("/", methods=['GET', 'POST'])
def creatuser():
    """
    GET: Render the create account form
    POST: Create the user
    """
    print dir(session)
    if request.method == 'GET':
        return render('index.html')

    
    elif request.method == 'POST':
        salt =  getRandomSalt(16)
        thehash = pbkdf2_hex(request.form['password'].encode('utf-8'), salt.encode('utf-8'))

        # Make a new user out of the info
        new_user = store.add(User())
        new_user.username = request.form['username']
        new_user.salt = unicode(salt)
        new_user.hash = unicode(thehash)
        store.commit()

        # store user id in the session
        session['userid'] = new_user.id

        return redirect('/home')



@app.route("/login", methods=['GET', 'POST'])
def login():
    """
    GET: Render the login form
    POST: try to verify the user
    """
    if request.method == 'GET':
        return render('login.html')


    elif request.method == 'POST':
        # Get the user information
        name = request.form['username']
        passwd = request.form['password']

        # Find a user with that username and compare passwords
        user = store.find(User, User.username == unicode(name)).one()
        salt = user.salt
        thehash = pbkdf2_hex(passwd.encode('utf-8'), salt.encode('utf-8'))

        # store user id in the session
        session['userid'] = new_user.id

        if thehash == user.hash:
            return redirect('/home')
        else:
            return 'login failed'



@app.route('/home', methods=['GET'])
def home():
    """
    Return the home page
    """
    if request.method == 'GET':
        user = getUser()
        if user:
            return render('home.html', {
                'user': user
            })
        else:
            return 'no user found, login'



@app.route('/programs', methods=['GET'])
def getAllPrograms():
    """
    Return all programs for the current user
    """
    user = getUser()
    if user:
        if request.method == 'GET':
            user_programs = [program.name for program in user.programs]
            return jsonify(programs=user_programs)
    else:
        'no user found, login'



@app.route('/stats/<string:program_name>', methods=['GET', 'POST'])
def programs(program_name):
    """
    GET: return all programs for the logged in user
    POST: create a new <program>
    """
    user = getUser()
    if user:
        if request.method == 'GET':
            user_program = user.programs.find(Program.name == program_name).one()
            user_stats = user.stats.find(Stat.program_id == user_program.id)
            stats_json = {}
            for stat in user_stats:
                stats_json[stat.type.name] = {
                    'stat_id': stat.id,
                    'program_id':stat.program_id,
                    'user_id':stat.user_id,
                    'value':stat.value,
                }
            print user_stats
            return jsonify(
                program=user_program.name,
                stats=stats_json
            )

        if request.method == 'POST':
            print "create a program yo"

    else:
        return 'no user found, login'



@app.route('/stats/<int:stat_id>', methods=['GET'])
def programStats(stat_id):
    """
    GET: return the info for that particular stat
    POST: create a new stat for the particular program
    PUT: updatea a stat for the particular program
    DELETE: delete a stat for the particular program
    """
    user = getUser()
    if user:
        if request.method == 'GET':
            the_stat = user.stats.find(Stat.id == stat_id).one()
            return jsonify(
                program=the_stat.program.name,
                stat={
                    'type': the_stat.type.name,
                    'id': the_stat.id,
                    'user_id': the_stat.user_id,
                    'value': the_stat.value
                }
            )




# Run the app
if __name__ == "__main__":
    app.debug = True
    app.secret_key = '9|VMb1z5NXry#bOy'
    app.run()
