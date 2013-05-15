from flask import Flask, request
from jconfig import render
from models.program import Program
from models.user import User
from dbconfig import store
from util.pbkdf2 import pbkdf2_hex
from util.salts import getRandomSalt

app = Flask(__name__)


@app.route("/", methods=['GET', 'POST'])
def creatuser():
    """
    GET: Render the create account form
    POST: Create the user
    """
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

        return render('home.html', {
            'user': new_user   
        })



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
        print salt
        print thehash

        if thehash == user.hash:
            return render('home.html', {
                'user': user
            })
        else:
            return 'login failed'


if __name__ == "__main__":
    app.debug = True
    app.run()
