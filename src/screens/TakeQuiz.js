import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const TakeQuiz = () => {
    const { quiz, addUsersAnswer } = useContext(AuthContext);
    const navigate = useNavigate();
    const [userAnswers, setUserAnswers] = useState(
        quiz?.quiz_questions?.map((quizquestion) => ({
            id: quizquestion.id,
            questionId: quizquestion.question.id,
            answers: quizquestion.question.answers.map((answer) => ({
                answerId: answer.id,
                isCorrect: false,
            })),
        })) || []
    );

    const [showSuccessMessage, setShowSuccessMessage] = useState(false); 
    const handleAnswerChange = (questionId, answerId, isCorrect) => {
        setUserAnswers(userAnswers.map(question =>
            question.questionId === questionId ? {
                ...question,
                answers: question.answers.map(answer =>
                    answer.answerId === answerId ? { ...answer, isCorrect } : answer
                )
            } : question
        ));
    };

    const handleSubmitQuiz = async () => {
        try {
            for (const quizquestion of userAnswers) {
                for (const answer of quizquestion.answers) {
                    await addUsersAnswer(quizquestion.id, answer.answerId, answer.isCorrect);
                }
            }
            setShowSuccessMessage(true);
        } catch (error) {
            console.error("Failed to submit quiz:", error);
        }
    };

    return (
        <div>
            {showSuccessMessage === false && quiz && quiz.quiz_questions && quiz.quiz_questions.length > 0 ? (
                quiz.quiz_questions.map((quizQuestion, index) => (
                    <div key={quizQuestion.id}>
                        <h3>Question {index + 1}: {quizQuestion.question.question}</h3>
                        <ul>
                            {quizQuestion.question.answers.map((answer) => (
                                <li key={answer.id}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={userAnswers.find(q => q.questionId === quizQuestion.question.id)?.answers.find(a => a.answerId === answer.id)?.isCorrect || false}
                                            onChange={(e) => handleAnswerChange(quizQuestion.question.id, answer.id, e.target.checked)}
                                        />
                                        {answer.answer}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>No questions available for this quiz.</p>
            )}
            {showSuccessMessage === false && <button onClick={handleSubmitQuiz}>Submit Quiz</button>}
            {showSuccessMessage && <p>Quiz submitted successfully!</p>} 
            <button onClick={() => navigate(-1)}>Go back</button>
        </div>
    );
};

export default TakeQuiz;
