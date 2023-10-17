import openai
import re

from RecruitApp.settings import OPENAI_API_KEY

openai.api_key = OPENAI_API_KEY


def generate_quiz(topic):
    prompt = (f'Please provide 10 questions each with four answers (one or more can be correct) in the form:\n'
              f'In Java, which of the following methods is used to compare two strings for equality?\n'
              f'A. == CORRECT\nB. equals() CORRECT\nC. equal() FALSE\nD. compareTo() FALSE\n'
              f'Please only provide the questions and the answers exactly like in the answer '
              f'above and nothing else. Thank you. The question should regard the following topic please: {topic}.')

    response = openai.Completion.create(
        engine="davinci",
        prompt=prompt,
        max_tokens=90000
    )

    return response.choices[0].text.strip()


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
            current_question['answers'].append({'answer': answer, 'is_correct': correctness == "CORRECT"})

    if current_question:
        questions.append(current_question)

    return questions
