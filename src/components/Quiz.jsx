import React, { useRef, useState, useEffect } from 'react';
import './quiz.css';
import { data as initialData } from '../../src/assets/data';

// Function to shuffle the array of questions
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const Quiz = () => {
    const shuffledData = shuffleArray([...initialData]); // Shuffle initial data
    const [data, setData] = useState(shuffledData); // State for shuffled data
    const [index, setIndex] = useState(0); // Current question index
    const [question, setQuestion] = useState(data[index]); // Current question
    const [lock, setLock] = useState(false); // Lock state to prevent multiple answers
    const [score, setScore] = useState(0); // User's score
    const [submitted, setSubmitted] = useState(false); // Whether the user has submitted an answer
    const [showError, setShowError] = useState(false); // Error state for unanswered question
    const [showResult, setShowResult] = useState(false); // State to show final result
    const [timeLeft, setTimeLeft] = useState(15); // Timer state
    const timerRef = useRef(null); // Reference to the timer interval
    const [quizStarted, setQuizStarted] = useState(false); // State to track if quiz has started

    // References for answer elements
    const Answer1 = useRef(null);
    const Answer2 = useRef(null);
    const Answer3 = useRef(null);
    const Answer4 = useRef(null);

    // Array of answer references
    const answerRefs = [Answer1, Answer2, Answer3, Answer4];

    // Effect to handle timer
    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current); // Clear existing timer if any

        // Set up new timer
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === 1) {
                    clearInterval(timerRef.current); // Clear timer when it reaches 1 second
                    next(true); // Auto move to next question
                }
                return prev - 1;
            });
        }, 1000);

        // Cleanup timer on component unmount or index change
        return () => clearInterval(timerRef.current);
    }, [index]);

    // Function to check the answer
    const checkAnswer = (e, ans) => {
        if (!lock) { // Proceed only if not locked
            if (question.ans === ans) {
                e.target.classList.add('correct'); // Mark as correct
                setScore(prev => prev + 1); // Increment score
            } else {
                e.target.classList.add('wrong'); // Mark as wrong
                if (answerRefs[question.ans - 1] && answerRefs[question.ans - 1].current) {
                    answerRefs[question.ans - 1].current.classList.add('correct'); // Highlight correct answer
                }
            }
            setLock(true); // Lock to prevent multiple answers
            setSubmitted(true); // Mark as submitted
            setShowError(false); // Hide error message
        }
    };

    // Function to move to the next question
    const next = (isTimeout = false) => {
        if (!submitted && !isTimeout) {
            setShowError(true); // Show error if question not answered
        } else {
            if (index < data.length - 1) {
                setIndex(prevIndex => {
                    const newIndex = prevIndex + 1;
                    setQuestion(data[newIndex]); // Set new question
                    setLock(false); // Unlock for new question
                    setSubmitted(false); // Reset submitted state
                    setTimeLeft(15); // Reset timer
                    answerRefs.forEach(ref => {
                        if (ref.current) {
                            ref.current.classList.remove('correct', 'wrong'); // Reset answer classes
                        }
                    });
                    return newIndex; // Return new index
                });
            } else {
                setShowResult(true); // Show final result
            }
        }
    };

    // Function to resubmit the quiz
    const resubmit = () => {
        const shuffledData = shuffleArray([...initialData]); // Reshuffle data
        setData(shuffledData); // Reset data
        setIndex(0); // Reset index
        setQuestion(shuffledData[0]); // Set first question
        setLock(false); // Unlock
        setScore(0); // Reset score
        setSubmitted(false); // Reset submitted state
        setShowResult(false); // Hide result
        setTimeLeft(15); // Reset timer
        answerRefs.forEach(ref => {
            if (ref.current) {
                ref.current.classList.remove('correct', 'wrong'); // Reset answer classes
            }
        });
    };

    // Function to start the quiz
    const startQuiz = () => {
        setQuizStarted(true); // Set quiz started state
    };

    return (
        <div>
            {/* Conditional rendering for start screen, quiz screen, and result screen */}
            {!quizStarted ? (
                <div className='common-container start-container'> {/* Start container */}
                    <h1 className='heading'>Welcome to the Quiz</h1>
                    <button onClick={startQuiz} className='nav-button'>Start Quiz</button>
                </div>
            ) : showResult ? (
                <div className='common-container result-container'> {/* Result container */}
                    <h1 className='heading'>Quiz Completed</h1>
                    <hr />
                    <h2 className='score'>Your Score: {score} / {data.length}</h2>
                    <button onClick={resubmit} className='nav-button'>Resubmit</button>
                </div>
            ) : (
                <div className='common-container container'> {/* Quiz container */}
                    <div className="progress-bar"> {/* Progress bar */}
                        <div className="progress" style={{ width: `${((index + 1) / data.length) * 100}%` }}></div>
                    </div>
                    <h1 className='heading'>Quiz App</h1>
                    <hr />
                    <h2 className='question' role="heading" aria-level="2">{index + 1}. {question.question}</h2>
                    <ul className='answers' role="list"> {/* List of answers */}
                        <li ref={Answer1} onClick={(e) => { checkAnswer(e, 1) }} role="listitem" tabIndex="0" aria-label={question.answer1}>{question.answer1}</li>
                        <li ref={Answer2} onClick={(e) => { checkAnswer(e, 2) }} role="listitem" tabIndex="0" aria-label={question.answer2}>{question.answer2}</li>
                        <li ref={Answer3} onClick={(e) => { checkAnswer(e, 3) }} role="listitem" tabIndex="0" aria-label={question.answer3}>{question.answer3}</li>
                        <li ref={Answer4} onClick={(e) => { checkAnswer(e, 4) }} role="listitem" tabIndex="0" aria-label={question.answer4}>{question.answer4}</li>
                    </ul>
                    {showError && <p className="error">*please answer the question</p>}
                    {timeLeft === 0 && <p className="timeout">Time is up! Moving to next question...</p>}
                    <div className="timer" aria-live="polite">Time left: {timeLeft} seconds</div>
                    <button onClick={() => next(false)} className='nav-button'>
                        {index < data.length - 1 ? 'Next' : 'Submit Quiz'}
                    </button>
                    <div className='count'>{index + 1} of {data.length} questions</div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
