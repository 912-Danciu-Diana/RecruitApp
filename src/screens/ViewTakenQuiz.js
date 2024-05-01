import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import '../styles/ViewTakenQuiz.css'; 

const ViewTakenQuiz = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { quiz_id, score } = location.state || {};
    const { quizDetailsFunc, quizDetails } = useContext(AuthContext);

    useEffect(() => {
        if (quiz_id) {
            quizDetailsFunc(quiz_id);
        }
    }, [quiz_id, quizDetailsFunc]);

    if (!quizDetails || !quizDetails.quiz_questions) {
        return <div>Loading quiz details...</div>;
    }

    return (
        <div className="container">
            <h2 className="header">Quiz Questions</h2>
            {quizDetails.quiz_questions.map((quizQuestion, index) => (
                <div key={index} className="question">
                    <p>{quizQuestion.question}</p>
                    {quizQuestion.user_answers.map((userAnswer, answerIndex) => (
                        <span key={answerIndex} className="answer">
                            {userAnswer.answer}
                            {userAnswer.user_marked_correct ? (
                                <span className="correct"> ✓ [Correct Answer]</span>
                            ) : (
                                <span className="incorrect"> ✗ [Wrong Answer]</span>
                            )}
                        </span>
                    ))}
                </div>
            ))}
            <p className="score">Total score: {score}%</p>
            <button className="goBackButton" onClick={() => navigate(-1)}>Go back</button>
        </div>
    );
};

export default ViewTakenQuiz;
