#!/usr/bin/env python3

from flask import Flask, request, jsonify, render_template, url_for
import pickle
import numpy as np
import time
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV, ShuffleSplit, learning_curve, train_test_split, cross_val_score
from sklearn import preprocessing
from sklearn.metrics import r2_score, make_scorer, mean_squared_error, mean_absolute_error
from sklearn.feature_selection import SelectFromModel
import pyfireconnect
from whitenoise import WhiteNoise

config = {
  "apiKey": "AIzaSyAal-QcuayT4d32G-6YJLw8m7Um5b1BPrg",
  "authDomain": "raspberrypi-6b521.firebaseapp.com",
  "databaseURL": "https://raspberrypi-6b521.firebaseio.com",
  "storageBucket": "raspberrypi-6b521.appspot.com"
}

firebase = pyfireconnect.initialize(config)
datab = firebase.database()
data = datab.child("sensor/data").get()
# .order_by_child("name").limit_to_first(1).get()
for data in data.each():
    key = data.key()
#     print(user.val())
    break

data_split = []
data_key = datab.child("sensor/data/"+key).get()
# print(users2.val())
for data in data_key.each():
#     print(user.key())
#     print(user.val())
    data_split.append(data.val())


app = Flask(__name__)
app.wsgi_app = WhiteNoise(app.wsgi_app)
my_static_folders = (
    'static/assets/js/',
    'static/bower_components/'
)
for static in my_static_folders:
    app.wsgi_app.add_files(static)


@app.route('/', methods=['GET', 'POST'])
def home():

    return render_template('index.html', temp=data_split[0])

@app.route('/predict', methods=['GET', 'POST'])
def predict():

    return render_template('index.html', predictions=result)

# ROUTE
@app.route('/myProfile.html')
def profile():
    return render_template('myProfile.html')

@app.route('/helpcenter.html')
def helpcenter():
    return render_template('helpcenter.html')

@app.route('/MyTasks.html')
def mytasks():
    return render_template('MyTasks.html')

@app.route('/registerasset.html')
def registerasset():
    return render_template('registerasset.html')

@app.route('/timeline.html')
def timeline():
    return render_template('timeline.html')

@app.route('/asset.html')
def asset():
    return render_template('asset.html')


@app.route('/assets.html')
def assets():
    return render_template('assets.html')

@app.route('/asset-edited.html')
def assetedited():
    return render_template('asset-edited.html')


if __name__ == "__main__":
    app.run(port=8060, debug=True)
