from flask import Flask, request
from jconfig import render
from models.program import Program
from models.user import User
from dbconfig import store

app = Flask(__name__)


@app.route("/", methods=['GET'])
def main():
    """
    Render the index page and return the list of programs
    """
    if request.method == 'GET':
        programs = store.find(Program)
        users = store.find(User)

        return render('index.html', {
            'users': users
        })




if __name__ == "__main__":
    app.debug = True
    app.run()
