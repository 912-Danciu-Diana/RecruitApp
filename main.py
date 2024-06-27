from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import predict_class, get_response

app = Flask(__name__)
CORS(app)


@app.route('/chat', methods=['POST'])
def chat():
    """Endpoint to receive messages from the user and return responses."""
    message = request.json.get('message', '')
    if not message:
        return jsonify({'error': 'No message provided'}), 400
    ints = predict_class(message)
    response = get_response(ints)
    return jsonify({'response': response})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
