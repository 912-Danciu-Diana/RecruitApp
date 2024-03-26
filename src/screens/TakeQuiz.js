import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const TakeQuiz = () => {
    const { quiz } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div>
            {quiz && quiz.quiz_questions && quiz.quiz_questions.length > 0 ? (
                quiz.quiz_questions.map((quizQuestion, index) => (
                    <div key={quizQuestion.id}>
                        <h3>Question {index + 1}: {quizQuestion.question.question}</h3>
                        <ul>
                            {quizQuestion.question.answers.map((answer) => (
                                <li key={answer.id}>
                                    {answer.answer} 
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>No questions available for this quiz.</p>
            )}
            <button onClick={() => navigate(-1)}>Go back</button>
        </div>
    )
}

export default TakeQuiz;