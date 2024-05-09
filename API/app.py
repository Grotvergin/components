from flask import Flask,jsonify, request
from flask_cors import CORS

import config
import db
import calc

server = Flask(__name__)
server.debug = config.DEBUG

CORS(
    server,
    resources={r"/*": {"origins": "*"}},
    headers=['Content-Type', 'X-Requested-With', 'Authorization']
)

@server.route("/components/<string:name>", methods=['GET'])
def getComponents(name):
    data=[component for component in db.findComponent(name)]
    print(data)
    return jsonify(data=[component for component in db.findComponent(name)])

@server.route("/component/<string:id>", methods=['DELETE'])
def removeComponent(id):
    try:
        db.removeComponent(id)
        return jsonify({ 'result': 'ok' })
    except:
        return jsonify({ 'result': 'error' })

@server.route("/component", methods=['POST'])
def addComponent():
    name = request.json.get('name')
    params = request.json.get('params')
    result = request.json.get('result')

    if name == "" or params == "" or params == "{}" or result == "" or result == "{}":
        return jsonify({ 'result': 'error', 'message': 'Неверные входные параметры' })
    print("Запись в базу данных")
    try:
        db.saveComponent(name, params, result)
        return jsonify({ 'result': 'ok' })
    except:
        return jsonify({ 'result': 'error' })

@server.route("/component", methods=['PUT'])
def addComponentWithEdit(): 
    name = request.json.get('name')
    params = request.json.get('params')
    result = request.json.get('result')

    if name == "" or params == "" or params == "{}" or result == "" or result == "{}":
        return jsonify({ 'result': 'error', 'message': 'Неверные входные параметры' })
    print("запись в базу данных")
    try: 
        db.saveWithEditComponent(name, params, result)
        return jsonify({ 'result': 'ok' })
    except:
        return jsonify({ 'result': 'error' })

@server.route("/calc/va", methods=['POST'])
def calculateVoltAmpere():
    print("App.py -> request.form", {**request.json})
    try:
        retVal = calc.CalculateVoltAmpere({**request.json})
        print("app.py -> calculateVoltAmpere", retVal)
        return jsonify(retVal)
    except:
        return jsonify({ 'result': 'error' })

@server.route("/calc/vc", methods=['POST'])
def calculateVoltCapacitance():
    try:
        retVal = calc.CalculateVoltCapacitance({**request.json})
        print("app.py -> calculateVoltCapacite", retVal)
        return jsonify(retVal)
    except:
        return jsonify({ 'result': 'error' })
    
@server.route("/calc/rrt", methods=['POST'])
def calculateReverseRecoveryTime():
    try:
        retVal = calc.CalculateReverseRecoveryTime({**request.json})
        return jsonify(retVal)
    except:
        return jsonify({ 'result': 'error' })
    
@server.route("/calc/tc", methods=['POST'])
def calculateTempratureСoefficient():
    try:
        retVal = calc.CalculateTempratureСoefficient({**request.json})
        print("app.py -> calculateVoltCapacite", retVal)
        return jsonify(retVal)
    except:
        return jsonify({ 'result': 'error' })

if __name__ == '__main__':
    server.run(host=config.HOST, port=config.PORT)