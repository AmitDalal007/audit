# To start frontend app

In the project directory, you can run:

### `npm i`
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

# To start backend

In the project directory, you can run:

### `cd backend`

### `pip install -r requirements.txt`

### `python3 -m venv .venv`
### `source .venv/bin/activate`  # For Linux/macOS
or
### `env\Scripts\activate`

### `uvicorn index:app --reload`

Runs the app in the development mode.\
Open [http://localhost:8000/docs](http://localhost:8000/docs) to view it in your browser.

## to add data in mongo db
### `python3 insert_data.py`
