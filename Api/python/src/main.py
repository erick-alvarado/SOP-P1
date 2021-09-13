from flask import Flask, jsonify, request

app = Flask(__name__)

# Get Data Routes
@app.route('/', methods=['GET'])
def getThing():
    return jsonify({'response': 'pong!'})


# Create Data Routes
@app.route('/', methods=['POST'])
def addThing():
    new_product = {
        'name': request.json['name'],
        'price': request.json['price'],
        'quantity': 10
    }
    return jsonify({'message': 'Thing created'})


# Update Data Route
@app.route('/<string:product_name>', methods=['PUT'])
def editThing(product_name):
    
    return jsonify({'message': 'Thing added'})

# DELETE Data Route
@app.route('/<string:product_name>', methods=['DELETE'])
def deleteThing(product_name):
    return jsonify({'message': 'Thing deleted'})
    

if __name__ == '__main__':
    
    app.run(debug=True, port=4000)