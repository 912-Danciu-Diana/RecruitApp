import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import '../styles/view-quiz.css';

const ViewQuiz = () => {
    const { quiz } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(quiz);
    })

    return (
        <div className="viewQuizContainer">
            <h2 className="header">Quiz Questions</h2>
            {quiz && quiz.quiz_questions && quiz.quiz_questions.length > 0 ? (
                quiz.quiz_questions.map((quizQuestion, index) => (
                    <div key={quizQuestion.id} className="quizQuestion">
                        <h3 className="quizHeader">Question {index + 1}: {quizQuestion.question.question}</h3>
                        <ul className="answerList">
                            {quizQuestion.question.answers.map((answer) => (
                                <li key={answer.id} className={`answerItem ${answer.is_correct ? 'correctAnswer' : 'incorrectAnswer'}`}>
                                    {answer.answer}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>No questions available for this quiz.</p>
            )}
            <div className="buttonContainer">
                <button className="goBackButton" onClick={() => navigate(-1)}>Go back</button>
            </div>
        </div>
    );
}

export default ViewQuiz;