import openai
import re

from RecruitApp.settings import OPENAI_API_KEY

openai.api_key = OPENAI_API_KEY


def generate_quiz(topic):
    messages = [
        {"role": "user", "content": (f'Generate 10 questions, each with 4 answers (one or more correct). Format:\n'
                                     f'Which method compares two strings for equality?\n'
                                     f'A. == CORRECT\nB. equals() CORRECT\nC. equal() FALSE\nD. compareTo() FALSE\n'
                                     f'Only provide questions and answers. Topic: {topic}.')}
    ]

    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=messages,
        max_tokens=1500
    )

    return response.choices[0].message['content'].strip()


def parse_quiz(quiz_text):
    lines = quiz_text.split("\n")
    questions = []
    current_question = None

    for line in lines:
        if any([line.startswith(str(i)+".") for i in range(1, 11)]):
            if current_question:
                questions.append(current_question)
            cleaned_question = re.sub(r'^\d+\.\s*', '', line)
            current_question = {'question': cleaned_question, 'answers': []}
        elif line.startswith("A.") or line.startswith("B.") or line.startswith("C.") or line.startswith("D."):
            correctness = line.split()[-1]
            answer = line.rsplit(' ', 1)[0]
            answer = answer.split('. ', 1)[-1]
            answer = re.sub(r'\s+(CORRECT|FALSE)$', '', answer)
            current_question['answers'].append({'answer': answer, 'is_correct': correctness == "CORRECT"})

    if current_question:
        questions.append(current_question)

    return questions

