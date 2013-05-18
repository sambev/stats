from storm.locals import *
from stats import Stat
from program import Program, ProgramUserLink
from config.dbconfig import store



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
    
    programs = ReferenceSet(id,
                            ProgramUserLink.user_id,
                            ProgramUserLink.program_id,
                            Program.id)

