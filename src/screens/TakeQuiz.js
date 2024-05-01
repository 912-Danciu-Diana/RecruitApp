import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import '../styles/TakeQuiz.css';  

const TakeQuiz = () => {
    const { quiz, addUsersAnswer } = useContext(AuthContext);
    const navigate = useNavigate();
    const [userAnswers, setUserAnswers] = useState(
        quiz?.quiz_questions?.map(quizquestion => ({
            id: quizquestion.id,
            questionId: quizquestion.question.id,
            answers: quizquestion.question.answers.map(answer => ({
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
        <div className="takeQuizContainer">
            {showSuccessMessage === false && quiz && quiz.quiz_questions && quiz.quiz_questions.length > 0 ? (
                quiz.quiz_questions.map((quizQuestion, index) => (
                    <div key={quizQuestion.id} className="questionItem">
                        <h3 className="questionHeader">Question {index + 1}: {quizQuestion.question.question}</h3>
                        <ul className="questionList">
                            {quizQuestion.question.answers.map((answer) => (
                                <li key={answer.id} className="answerLabel">
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="inputCheckbox"
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
            {showSuccessMessage === false && <button className="submitButton" onClick={handleSubmitQuiz}>Submit Quiz</button>}
            {showSuccessMessage && <p className="successMessage">Quiz submitted successfully!</p>}
        </div>
    );
};

export default TakeQuiz;
