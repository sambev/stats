from storm.locals import *
from program import Program



class StatType(object):
    """
    I am a type of stat. ie 'Wins' or 'Loss'
    """
    __storm_table__ = 'stat_type'
    id = Int(primary=True)
    name = Unicode()
            


class Stat(object):
    """
    I am the actual stat value for a type
    """
    __storm_table__ = 'stat'
    id = Int(primary=True)
    type_id = Int()
    program_id = Int()
    user_id = Int()
    value = Unicode()

    type = Reference(type_id, StatType.id)
    program = Reference(program_id, Program.id)



