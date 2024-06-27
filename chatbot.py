import json
import pickle
import random
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model

from training import get_wordnet_pos

# Initialization of components
lemmatizer = WordNetLemmatizer()
intents = json.loads(open('intents.json').read())
words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))
model = load_model('./chatbot_model.keras')
pos_tags = []


def clean_up_sentence(sentence):
    """Tokenizes and lemmatizes the sentence."""
    sentence_words = nltk.word_tokenize(sentence)
    pos_tags = nltk.pos_tag(sentence_words)
    sentence_words = [lemmatizer.lemmatize(word.lower(), get_wordnet_pos(tag)) for word, tag in pos_tags]
    return sentence_words


def bag_of_words(sentence):
    """Converts a sentence into a bag of words."""
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)


def predict_class(sentence):
    """Predicts the class for a given sentence."""
    bow = bag_of_words(sentence)
    res = model.predict(np.array([bow]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({'intent': classes[r[0]], 'probability': str(r[1])})
    return return_list


def get_response(intents_list):
    """Gets a response from the predicted intent."""
    if not intents_list:
        return "I'm not sure how to respond to that. Can you please rephrase your question?"

    tag = intents_list[0]['intent']
    list_of_intents = intents['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            return random.choice(i['responses'])
    return ""
