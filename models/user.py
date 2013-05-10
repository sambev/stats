from storm.locals import *
from stats import Stat



class User(object):
    """
    I am the user that stats are tied to
    """
    __storm_table__ = 'user'
    id = Int(primary=True)
    username = Unicode()
    hash = Unicode()
    salt = Unicode()

    stats = ReferenceSet(id, Stat.user_id)
