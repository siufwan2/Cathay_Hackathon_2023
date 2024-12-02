#External Function Importing
import openairelated
import ml
#Packages Importing
from flask import Flask, render_template, jsonify, request
import requests
import pandas as pd
import datetime
import numpy as np
import json
import threading

app = Flask(__name__)

#Default Landing page
@app.route('/')
def index():
    return render_template('AI.html')

#Home page
# @app.route('/index.html')
# def index1():
#     return render_template('index.html')

#AI assistant
@app.route('/AI.html')
def order():
    return render_template('AI.html')

@app.route('/cal.html')
def cal():
    return render_template('cal.html')

@app.route("/api/defaultchatgpt", methods=["POST"])
def initchatgpt():
    data = request.json
    #{'query': 'test'}
    print(data['query'])
    api = openairelated.settingAPIgpt35()
    history = openairelated.talkwithGPT(api, data['query'])
    currentresponse = history[0]
    chathist = history[1]
    print(currentresponse)
    print(chathist)
    response_data = {"GPTresp": currentresponse,
                     "ChatHist": chathist}
    return jsonify(response_data)

@app.route("/api/defaultcontinchatgpt", methods=["POST"])
def continchat():
    data = request.json
    api = openairelated.settingAPIgpt35()
    history = openairelated.continchat(api, data['query'],data['chatHist'])
    currentresponse = history[0]
    chathist = history[1]
    response_data = {"GPTresp": currentresponse,
                     "ChatHist": chathist}
    return jsonify(response_data)

@app.route("/api/TCinitchatgpt", methods=["POST"])
def TCinitchatgpt():
    data = request.json
    #{'query': 'test'}
    print(data['query'])
    api = openairelated.settingAPIgpt35()
    history = openairelated.vectorsearch(api, data['query'])
    currentresponse = history[0]
    chathist = history[1]
    print(currentresponse)
    print(chathist)
    response_data = {"GPTresp": currentresponse,
                     "ChatHist": chathist}
    return jsonify(response_data)


@app.route("/api/get_user_info", methods=["POST"])
def get_user_info():

    user = pd.read_csv("database/users.csv")
    rows = user.shape[0]

    # Generate a random index to select a row
    randnum = np.random.randint(0, rows)
    
    # Select the random row from the DataFrame
    sel = user.iloc[randnum]
    
    # Convert int64 to int for 'code' and 'age'
    response_data = {
        "uid": int(sel['code']),
        "ucamp": sel['company'],
        "uname": sel['name'],
        "ugender": sel['gender'],
        "uage": int(sel['age']),
        "mbal": int(sel['miles'])
    }

    #Append current user to cache
    cacherow = user[user['code']==randnum]
    mcal = pd.read_csv(r"database\cache.csv")

    mcal = pd.concat([mcal, cacherow])

    mcal.to_csv(r"database\cache.csv", index=False)
    

    return jsonify(response_data)

@app.route("/api/cal_get_user_info", methods=["POST"])
def cal_get_user_info():
    user = pd.read_csv(r"database\cache.csv")
    rows = user.shape[0]-1

    # Select the random row from the DataFrame
    sel = user.iloc[rows]
    print(sel)
    
    # Convert int64 to int for 'code' and 'age'
    response_data = {
        "uid": int(sel['code']),
        "ucamp": sel['company'],
        "uname": sel['name'],
        "ugender": sel['gender'],
        "uage": int(sel['age']),
        "mbal": int(sel['miles']),
        "mtar": int(sel['target']),
        "uloc": sel['cloc']
    }

    return jsonify(response_data)

@app.route("/api/flight_pred", methods=["POST"])
def flight_pred():
    data = request.json
    response_data = ml.flightpred(data)
    #{"first": predicted_destination, "second": maxi2[0], "third": maxi2[1]}
    return jsonify(response_data)


@app.route("/api/miles_cal_gpt_init", methods=["POST"])
def miles_cal_gpt_init():
    data = request.json

    #Get User Preferences
    preference = ml.getpattern()

    #Update Cache For Calculator
    mcal = pd.read_csv(r"database\cache.csv")

    if any(mcal['code'] == data['user']):
        mcal.loc[mcal['code'] == data['user'], ['target']] = data['miles']
        mcal.loc[mcal['code'] == data['user'], ['cloc']] = data['curloc']
    mcal.to_csv(r"database\cache.csv", index=False)


    #Throw the result to GPT
    api = openairelated.settingAPIgpt35()
    history = openairelated.mile_cal_init(api, data['user'], data['des'], data['miles'], preference)
    currentresponse = history[0]
    chathist = history[1]
    response_data = {"GPTresp": currentresponse,
                     "ChatHist": chathist,
                     "top3": preference}
    
    return jsonify(response_data)

@app.route("/api/get_reward_info", methods=["POST"])
def get_reward():
    pd_db = pd.read_excel('database/redproduct.xlsx', sheet_name='over4000')
    pd_db1 = pd.read_excel('database/redproduct.xlsx', sheet_name='daily_travel')
    pd_db2 = pd.read_excel('database/redproduct.xlsx', sheet_name='daily_dining')
    pd_db3 = pd.read_excel('database/redproduct.xlsx', sheet_name='daily_wellness')
    pd_db4 = pd.read_excel('database/redproduct.xlsx', sheet_name='daily_shopping')
    pd_db5= pd.read_excel('database/redproduct.xlsx', sheet_name='daily_payment')

     # Combine the DataFrames into a dictionary
    data = {
        'over4000': pd_db.to_dict(orient='records'),
        'daily_travel': pd_db1.to_dict(orient='records'),
        'daily_dining': pd_db2.to_dict(orient='records'),
        'daily_wellness': pd_db3.to_dict(orient='records'),
        'daily_shopping': pd_db4.to_dict(orient='records'),
        'daily_payment': pd_db5.to_dict(orient='records')
    }
    
    # Convert the dictionary to JSON
    response_data = json.dumps(data)
    
    # Return the JSON response
    return response_data
    
#Main Function
def run_flask_app():
    app.run()

if __name__ == "__main__":
    flask_thread = threading.Thread(target=run_flask_app)
    flask_thread.start()
