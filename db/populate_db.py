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
    board = db.Column(db.String(16), nullable=True)


db.create_all()

with open("spinners.csv") as spinners:
    for line in spinners.readlines():
        name, twitter, youtube, board = line.strip().split(",")
        key = name.lower()
        spinner = Spinners(
            key=key, name=name, twitter=twitter, youtube=youtube, board=board
        )
        db_spinner = Spinners.query.filter_by(name=name).first()
        if not db_spinner:
            db.session.add(spinner)
            db.session.commit()
