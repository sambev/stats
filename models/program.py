from storm.locals import *
from config.dbconfig import store


class Program(object):
    """
    I am a Program for stats
    """
    __storm_table__ = 'program'
    id = Int(primary=True)
    name = Unicode()

    def __init__(self, name):
        self.name = name



class ProgramUserLink(object):
    """
    I am a linking table for Programs and users
    """
    __storm_table__ = 'program_user_link'
    id = Int(primary=True)
    program_id = Int()
    user_id = Int()

    
    def __init__(self, program, user):
        """
        Instantiate me with a program_id and user_id
        """
        self.program_id = program
        self.user_id = user
