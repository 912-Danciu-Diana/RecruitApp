import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/make-quiz.css';  

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
            <div className="container" style={{ textAlign: 'center' }}>
                <p>Quiz submitted successfully!</p>
                <button className="button" onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="container">
            {questions.map((q, index) => (
                <div key={index} className="questionContainer">
                    <p>Q: {q.question}</p>
                    {q.answers.map((a, aIndex) => (
                        <p key={aIndex}>{`A${aIndex + 1}: ${a.answer} ${a.isCorrect ? '(Correct)' : ''}`}</p>
                    ))}
                </div>
            ))}
            <input
                className="input"
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                placeholder="Enter your question here"
            />
            {answers.map((answer, index) => (
                <div key={index} className="checkboxContainer">
                    <input
                        className="input"
                        value={answer.answer}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder={`Answer ${index + 1}`}
                    />
                    <input
                        className="checkbox"
                        type="checkbox"
                        checked={answer.isCorrect}
                        onChange={(e) => handleAnswerChange(index, answer.answer, e.target.checked)}
                    />
                    Correct
                </div>
            ))}
            <button className="button" onClick={addCurrentQuestion}>Add question</button>
            <button className="button" onClick={handleSubmitQuiz}>Submit Quiz</button>
        </div>
    );
};

export default MakeQuizScreen;
