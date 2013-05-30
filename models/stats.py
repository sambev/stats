from storm.locals import *
from program import Program



class Stat(object):
    """
    I am the actual stat value for a type
    """
    __storm_table__ = 'stat'
    id = Int(primary=True)
    name = Unicode()
    program_id = Int()
    user_id = Int()
    value = Unicode()

    program = Reference(program_id, Program.id)



