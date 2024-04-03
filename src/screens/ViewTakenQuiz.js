import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

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
        <div>
            <h2>Quiz Questions</h2>
            {quizDetails.quiz_questions.map((quizQuestion, index) => (
                <div key={index}>
                    <p>{quizQuestion.question}</p>
                    {quizQuestion.user_answers.map((userAnswer, answerIndex) => (
                        <div key={answerIndex}>
                            <span>{userAnswer.answer}</span>
                            {userAnswer.user_marked_correct ? (
                                <span style={{ color: 'green' }}>✓ </span>
                            ) : (
                                <span style={{ color: 'red' }}>✗</span>
                            )}
                            {userAnswer.actual_is_correct && (
                                <span style={{ color: 'green' }}> [Correct Answer]</span>
                            )}
                            {userAnswer.actual_is_correct === false && (
                                <span style={{ color: 'red' }}> [Wrong Answer]</span>
                            )}
                        </div>
                    ))}
                </div>
            ))}
            <p>Total score: {score}%</p>
            <button onClick={() => navigate(-1)}>Go back</button>
        </div>
    );
};

export default ViewTakenQuiz;
