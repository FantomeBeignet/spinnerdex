from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--db", type=str, help="Database name", required=True)
parser.add_argument("--csv", type=str, help="CSV file name", required=True)
args = parser.parse_args()

print(args.db, args.csv)

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = args.db
db = SQLAlchemy(app)


class Spinners(db.Model):
    key = db.Column(db.String(80), unique=True, nullable=False, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    twitter = db.Column(db.String(128), nullable=True)
    youtube = db.Column(db.String(128), nullable=True)


db.create_all()

spinners = Spinners.query.all()

with open(args.csv, "w") as csv:
    for spinner in spinners:
        csv.write(f"{spinner.name},{spinner.twitter},{spinner.youtube}\n")
