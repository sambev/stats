from storm.locals import *
from dbconfig import store


class Program(object):
    """
    I am a Program for stats
    """
    __storm_table__ = 'program'
    id = Int(primary=True)
    name = Unicode()

    
    def addUser(self, user):
        """
        Add a user to this program
        """
        store.add(ProgramUserLink(self.id, user.id));
    



class ProgramUserLink(object):
    """
    I am a linking table for Programs and users
    """
    __storm_table__ = 'program_user_link'
    id = Int(Primary=True)
    program_id = Int()
    user_id = Int()

    
    def __init__(self, program, user):
        """
        Instantiate me with a program_id and user_id
        """
        self.program_id = program
        self.user_id = user
