import React, { useState, useEffect } from 'react';
import CelebrationAnimation from './CelebrationAnimation';
import * as api from '../api';

interface Question {
  id: string;
  question: string;
  answers: string[];
}

interface MissionTabProps {
  updateTONBalance: (amount: number) => void;
  updateQuizEarnings: (amount: number) => void;
}

const MissionTab: React.FC<MissionTabProps> = ({ updateTONBalance, updateQuizEarnings }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [quizEarnings, setQuizEarnings] = useState<number>(0);

  const loadNewQuestion = async () => {
    try {
      const response = await api.getQuestion();
      setCurrentQuestion(response.data);
      setSelectedAnswer(null);
      setResult(null);
    } catch (error) {
      console.error('Error loading question:', error);
    }
  };

  useEffect(() => {
    loadNewQuestion();

    // Set up a timer to load a new question every 24 hours
    const timer = setInterval(loadNewQuestion, 24 * 60 * 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelection = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || !currentQuestion) return;

    try {
      const response = await api.submitAnswer(currentQuestion.id, selectedAnswer);
      if (response.data.correct) {
        const reward = response.data.reward;
        setResult(`Correct! You earned ${reward} TON.`);
        updateTONBalance(reward);
        updateQuizEarnings(reward);
        setQuizEarnings(prevEarnings => prevEarnings + reward);
        setShowCelebration(true);
        
        // Set a timeout to hide the celebration, show the result, and then load a new question
        setTimeout(() => {
          setShowCelebration(false);
          setTimeout(() => {
            loadNewQuestion();
          }, 1500); // Wait 1.5 seconds after hiding celebration before loading new question
        }, 3000); // Celebration lasts for 3 seconds
      } else {
        setResult(`Incorrect. The correct answer was: ${response.data.correctAnswer}`);
        // Load new question after 3 seconds for incorrect answers
        setTimeout(loadNewQuestion, 3000);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setResult('An error occurred. Please try again.');
    }
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-white">Daily Quiz</h2>
      <div className="mb-4 text-yellow-400">Quiz Earnings: {quizEarnings.toFixed(2)} TON</div>
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <h3 className="text-xl mb-2 text-white">{currentQuestion.question}</h3>
        {currentQuestion.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelection(index)}
            className={`block w-full text-left p-2 mb-2 rounded ${
              selectedAnswer === index ? 'bg-blue-600' : 'bg-gray-700'
            } text-white`}
          >
            {answer}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selectedAnswer === null}
        className={`w-full p-2 rounded ${
          selectedAnswer === null ? 'bg-gray-600' : 'bg-green-600'
        } text-white`}
      >
        Submit Answer
      </button>
      {result && (
        <div className={`mt-4 p-2 rounded ${
          result.startsWith('Correct') ? 'bg-green-700' : 'bg-red-700'
        } text-white`}>
          {result}
        </div>
      )}
      {showCelebration && <CelebrationAnimation />}
    </div>
  );
};

export default MissionTab;