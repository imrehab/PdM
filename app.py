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
import pandas as pd
import random
from sklearn.utils import shuffle
from sklearn.model_selection import ShuffleSplit, learning_curve, train_test_split
from sklearn.neighbors import KNeighborsClassifier


# cloud database
THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))
my_file = os.path.join(THIS_FOLDER, 'raspberrypi-6b521-firebase-adminsdk-rb94u-fa953a6467.json')
cred= credentials.Certificate('raspberrypi-6b521-firebase-adminsdk-rb94u-fa953a6467.json')
default_app = initialize_app(cred)
db = firestore.client()



# realtime database
config = {
  "apiKey": "AIzaSyAal-QcuayT4d32G-6YJLw8m7Um5b1BPrg",
  "authDomain": "raspberrypi-6b521.firebaseapp.com",
  "databaseURL": "https://raspberrypi-6b521.firebaseio.com",
  "storageBucket": "raspberrypi-6b521.appspot.com"
}
#
firebase = pyfireconnect.initialize(config)
datab = firebase.database()
data = datab.child("sensor/MPU0001").get()
for data in data.each():
    key = data.key()
    break

data_split = []
data_key = datab.child("sensor/MPU0001/"+key).get()
for data in data_key.each():
    data_split.append(data.val())

# data_split[0] -> acc -> data_split[0][0] , data_split[0][1], data_split[0][2]
# data_split[1] -> asset id
# data_split[2] -> Temp
# data_split[3] -> time

# get engineer info
def user_prifile(email):

   doc_ref = db.collection(u'engineers').document(email)
   #doc_ref = db.collection(u'engineers').document(u'malahmad@um.sa')
   try:
       doc = doc_ref.get()
       user = doc.to_dict()
       return user
   except google.cloud.exceptions.NotFound:
       print(u'No such document!')
       
def updateAssetLists(id,abnormality): 
   """
    this function should be called everytime:
      the abnormality status changed
   """
   try:
 
       asset = db.collection(u'Models').document(u'IPOWERFAN').collection(u'Assets').document(id)
       asset.update({ u'abnormality': abnormality , u'issues.timestamp': firestore.SERVER_TIMESTAMP  })
       return ''
 
   except google.cloud.exceptions.NotFound:
         return ''
 

def AssetLists():
  
   try:
       
       assets=[]
       docs=db.collection(u'Models').document(u'IPOWERFAN').collection(u'Assets').stream()
       for doc in docs:
           dic= doc.to_dict()
           dic['id']=doc.id
           assets.append(dic)
 
       return assets
   except google.cloud.exceptions.NotFound:
       return 'error'
        



 
updateAssetLists('IPOWERFAN001MPU',True)

app = Flask(__name__)
app.wsgi_app = WhiteNoise(app.wsgi_app)
my_static_folders = (
    'static/assets/js/',
    'static/bower_components/'
)
for static in my_static_folders:
    app.wsgi_app.add_files(static)

data = pd.read_csv("data.csv")
data = data.drop(columns=['||__time'])
data = shuffle(data)
feature_cols = data.drop(['Normality'], axis = 1).columns
X = data[feature_cols]
y = data.Normality

# split the data into test/train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20)
neigh = KNeighborsClassifier(n_neighbors=7)
neigh.fit(X_train, y_train)
pred = neigh.predict([[data_split[0][0],data_split[0][1], data_split[0][2], data_split[2]]])
prob = neigh.predict_proba([[data_split[0][0],data_split[0][1], data_split[0][2], data_split[2]]])
str = str(prob).strip('[]').split()
    

@app.route('/', methods=['GET', 'POST'])
def home():


    return render_template('index.html', prob=float(str[1])*100, normality=pred)




@app.route('/predict', methods=['GET', 'POST'])
def predict():

    return render_template('index.html', predictions=result)

# ROUTE
@app.route('/myProfile.html')
def profile():
    return render_template('myProfile.html',data=user_prifile('malahmad@um.sa'))

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
    return render_template('timeline.html',data=AssetLists())

@app.route('/asset.html')
def asset():
    return render_template('asset.html',  prob=float(str[1])*100)


@app.route('/assets.html')
def assets():
    return render_template('assets.html')

@app.route('/asset-edited.html')
def assetedited():
    return render_template('asset-edited.html')


if __name__ == "__main__":
    app.run(port=8060, debug=True)
