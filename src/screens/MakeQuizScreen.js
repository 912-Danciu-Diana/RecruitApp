import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MakeQuizScreen = () => {
    const { quiz, addQuestion, addQuizQuestion, addAnswer } = useContext(AuthContext);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [answers, setAnswers] = useState(Array(4).fill({ answer: '', isCorrect: false }));
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const navigate = useNavigate();

    const handleAnswerChange = (index, value, isCorrect = false) => {
        const newAnswers = answers.map((answer, i) => i === index ? { ...answer, answer: value, isCorrect } : answer);
        setAnswers(newAnswers);
    };

    const addCurrentQuestion = () => {
        setQuestions([...questions, { question: currentQuestion, answers }]);
        setCurrentQuestion('');
        setAnswers(Array(4).fill({ answer: '', isCorrect: false }));
    };

    const handleSubmitQuiz = async () => {
        for (const q of questions) {
            try {
                const questionResponse = await addQuestion(q.question);
                const questionId = questionResponse.id;

                for (const a of q.answers) {
                    await addAnswer(a.answer, a.isCorrect, questionId);
                }

                await addQuizQuestion(quiz.id, questionId);
            } catch (error) {
                console.error('Error submitting question and answers:', error);
            }
        }
        setSubmissionSuccess(true);
    };

    if (submissionSuccess) {
        return (
            <div>
                <p>Quiz submitted successfully!</p>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    return (
        <div>
            {questions.map((q, index) => (
                <div key={index}>
                    <p>Q: {q.question}</p>
                    {q.answers.map((a, aIndex) => (
                        <p key={aIndex}>{`A${aIndex + 1}: ${a.answer} ${a.isCorrect ? '(Correct)' : ''}`}</p>
                    ))}
                </div>
            ))}
            <input
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                placeholder="Enter your question here"
            />
            {answers.map((answer, index) => (
                <div key={index}>
                    <input
                        value={answer.answer}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder={`Answer ${index + 1}`}
                    />
                    <input
                        type="checkbox"
                        checked={answer.isCorrect}
                        onChange={(e) => handleAnswerChange(index, answer.answer, e.target.checked)}
                    />
                    Correct
                </div>
            ))}
            <button onClick={addCurrentQuestion}>Add question</button>
            <button onClick={handleSubmitQuiz}>Submit Quiz</button>
        </div>
    );
};

export default MakeQuizScreen;
