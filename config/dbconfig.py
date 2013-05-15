from storm.locals import *
from config import config

db = create_database(config.get('database', 'uri'))
store = Store(db)
