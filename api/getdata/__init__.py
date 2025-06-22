import logging
import azure.functions as func
import pandas as pd
import io

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        file = req.files.get('file')
        if not file:
            return func.HttpResponse("No file uploaded", status_code=400)

        in_memory_file = io.BytesIO(file.read())

        # Read Excel file into pandas DataFrame
        df = pd.read_excel(in_memory_file)

        # Example filtering (modify as needed)
        filtered = df[df['Status'] == 'Active']

        # Convert result to JSON
        result_json = filtered.to_json(orient='records')

        return func.HttpResponse(result_json, mimetype="application/json")

    except Exception as e:
        logging.exception("Error processing Excel file")
        return func.HttpResponse(str(e), status_code=500)
