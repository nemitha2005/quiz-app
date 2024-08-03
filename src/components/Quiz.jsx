import React, { useRef, useState, useEffect } from 'react';
import './quiz.css';
import { data as initialData } from '../../src/assets/data';

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const Quiz = () => {
    const shuffledData = shuffleArray([...initialData]);
    const [data, setData] = useState(shuffledData);
    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState(data[index]);
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15); // Timer state
    const [timeout, setTimeout] = useState(false); // Timeout state
    const timerRef = useRef(null);

    const Answer1 = useRef(null);
    const Answer2 = useRef(null);
    const Answer3 = useRef(null);
    const Answer4 = useRef(null);

    const answer = [Answer1, Answer2, Answer3, Answer4];

    useEffect(() => {
        // Set up timer
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === 1) {
                    clearInterval(timerRef.current);
                    setTimeout(true);
                    next();
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [index]);

    const checkAnswer = (e, ans) => {
        if (!lock) {
            if (question.ans === ans) {
                e.target.classList.add('correct');
                setScore(prev => prev + 1);
            } else {
                e.target.classList.add('wrong');
                if (answer[question.ans - 1] && answer[question.ans - 1].current) {
                    answer[question.ans - 1].current.classList.add('correct');
                }
            }
            setLock(true);
            setSubmitted(true);
            setShowError(false);
        }
    };

    const next = () => {
        if (!submitted) {
            setShowError(true);
        } else {
            if (index < data.length - 1) {
                setIndex(prevIndex => {
                    const newIndex = prevIndex + 1;
                    setQuestion(data[newIndex]);
                    setLock(false);
                    setSubmitted(false);
                    setTimeout(false);
                    setTimeLeft(15);
                    answer.forEach(ref => {
                        if (ref.current) {
                            ref.current.classList.remove('correct', 'wrong');
                        }
                    });
                    return newIndex;
                });
            } else {
                setShowResult(true);
            }
        }
    };

    const resubmit = () => {
        const shuffledData = shuffleArray([...initialData]);
        setData(shuffledData);
        setIndex(0);
        setQuestion(shuffledData[0]);
        setLock(false);
        setScore(0);
        setSubmitted(false);
        setShowResult(false);
        setTimeout(false);
        setTimeLeft(15);
        answer.forEach(ref => {
            if (ref.current) {
                ref.current.classList.remove('correct', 'wrong');
            }
        });
    };

    return (
        <div>
            {showResult ? (
                <div className='common-container result-container'>
                    <h1 className='heading'>Quiz Completed</h1>
                    <hr />
                    <h2 className='score'>Your Score: {score} / {data.length}</h2>
                    <button onClick={resubmit} className='nav-button'>Resubmit</button>
                </div>
            ) : (
                <div className='common-container container'>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${((index + 1) / data.length) * 100}%` }}></div>
                    </div>
                    <h1 className='heading'>Quiz App</h1>
                    <hr />

                    <h2 className='question' role="heading" aria-level="2">{index + 1}. {question.question}</h2>

                    <ul className='answers' role="list">
                        <li ref={Answer1} onClick={(e) => { checkAnswer(e, 1) }} role="listitem" tabIndex="0" aria-label={question.answer1}>{question.answer1}</li>
                        <li ref={Answer2} onClick={(e) => { checkAnswer(e, 2) }} role="listitem" tabIndex="0" aria-label={question.answer2}>{question.answer2}</li>
                        <li ref={Answer3} onClick={(e) => { checkAnswer(e, 3) }} role="listitem" tabIndex="0" aria-label={question.answer3}>{question.answer3}</li>
                        <li ref={Answer4} onClick={(e) => { checkAnswer(e, 4) }} role="listitem" tabIndex="0" aria-label={question.answer4}>{question.answer4}</li>
                    </ul>

                    {showError && <p className="error">*please answer the question</p>}
                    {timeout && <p className="timeout">Time is up! Moving to next question...</p>}

                    <div className="timer" aria-live="polite">Time left: {timeLeft} seconds</div>

                    <button onClick={next} className='nav-button'>
                        {index < data.length - 1 ? 'Next' : 'Submit Quiz'}
                    </button>

                    <div className='count'>{index + 1} of {data.length} questions</div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
