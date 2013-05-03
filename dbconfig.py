from storm.locals import *

db = create_database("mysql://sambev:trackstat87@sambev.dlinkddns.com:3306/trackstat")
store = Store(db)
