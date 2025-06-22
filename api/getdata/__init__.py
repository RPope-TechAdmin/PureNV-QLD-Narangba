import logging
import pyodbc
import azure.functions as func
import os
import json

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        server = os.environ["SQL_SERVER"]
        database = os.environ["SQL_DATABASE"]
        username = os.environ["SQL_USERNAME"]
        password = os.environ["SQL_PASSWORD"]
        driver = os.environ["SQL_DRIVER"]

        conn_str = f"DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}"
        with pyodbc.connect(conn_str) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT column1, column2 FROM your_table")
            rows = cursor.fetchall()
            data = [{"x": row[0], "y": row[1]} for row in rows]

        return func.HttpResponse(json.dumps(data), mimetype="application/json")

    except Exception as e:
        logging.error(f"Error: {e}")
        return func.HttpResponse("Error connecting to database", status_code=500)
