from storm.locals import *

db = create_database("mysql://sambev:trackstat87@192.168.0.199:3306/trackstat")
store = Store(db)
