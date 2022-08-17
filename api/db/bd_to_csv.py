from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///spinners.db"
db = SQLAlchemy(app)


class Spinners(db.Model):
    key = db.Column(db.String(80), unique=True, nullable=False, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    twitter = db.Column(db.String(128), nullable=True)
    youtube = db.Column(db.String(128), nullable=True)


db.create_all()

spinners = Spinners.query.all()

with open("spinners.csv", "w") as csv:
    for spinner in spinners:
        csv.write(f"{spinner.name},{spinner.twitter},{spinner.youtube}\n")
