from flask import Flask
from jconfig import render
from models.stats import Program
from dbconfig import store

app = Flask(__name__)


@app.route("/")
def main():
    """
    Render the index page and return the list of programs
    """
    programs = store.find(Program)
    print programs
    return render('index.html', {
        'name': 'Sam', 
        'programs': programs,
    })


if __name__ == "__main__":
    app.debug = True
    app.run()
