from storm.locals import *
import ConfigParser, os

# read in the config file
config = ConfigParser.ConfigParser()
config.readfp(open('config.ini'))


db = create_database(config.get('database', 'uri'))
store = Store(db)
