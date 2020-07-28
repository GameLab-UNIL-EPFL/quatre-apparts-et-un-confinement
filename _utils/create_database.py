import sqlite3

def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except ValueError as e:
        print(e)

    return None

def create_table(conn, create_table_sql):
    """ create a table from the create_table_sql statement
    :param conn: Connection object
    :param create_table_sql: a CREATE TABLE statement
    :return:
    """
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except ValueError as e:
        print(e)

def main():
    database = "../server/database.db"

    sql_create_choices_table = """CREATE TABLE IF NOT EXISTS player_choice(
id	INTEGER	PRIMARY KEY AUTOINCREMENT,
player_id   TEXT NOT NULL,
damien_stay_home	INTEGER	,
damien_food	INTEGER	,
damien_game_score_mean	REAL	,
damien_clothes	INTEGER	,
damien_see_grandma	INTEGER	,
mother_stay_home	INTEGER	,
mother_game_score	INTEGER	,
freelancer_food_set	TEXT	,
freelancer_food_amount	INTEGER	,
freelancer_love_advice	INTEGER	,
freelancer_game_score	INTEGER	,
grandma_books	TEXT	,
grandma_advice	INTEGER	,
UNIQUE(player_id)
  );"""

    conn = create_connection(database)
    if conn is not None:
        # create choice table
        create_table(conn, sql_create_choices_table)
    else:
        print("Error! cannot create the database connection.")

if __name__ == '__main__':
    main()
