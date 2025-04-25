'use client';
import React, { useState } from 'react';

const questions = [
  {
    question: "What house at Hogwarts does Harry belong to?",
    options: ["Slytherin", "Ravenclaw", "Gryffindor", "Hufflepuff"],
    answer: "Gryffindor"
  },
  {
    question: "What position does Harry play on his Quidditch team?",
    options: ["Beater", "Chaser", "Seeker", "Keeper"],
    answer: "Seeker"
  },
  {
    question: "What is the name of Harry’s owl?",
    options: ["Hedwig", "Crookshanks", "Scabbers", "Fang"],
    answer: "Hedwig"
  },
  {
    question: "Who is NOT a member of the Weasley family?",
    options: ["Ron", "Ginny", "Draco", "Fred"],
    answer: "Draco"
  },
  {
    question: "What platform at King’s Cross does the Hogwarts Express leave from?",
    options: ["9 3/4", "10 1/2", "9", "8 3/4"],
    answer: "9 3/4"
  },
  {
    question: "What is Voldemort’s real name?",
    options: ["Tom Riddle", "Salazar Slytherin", "Gellert Grindelwald", "Lucius Malfoy"],
    answer: "Tom Riddle"
  },
  {
    question: "What subject does Snape teach?",
    options: ["Potions", "Defense Against the Dark Arts", "Charms", "Transfiguration"],
    answer: "Potions"
  },
  {
    question: "What magical creature pulls the carriages to Hogwarts?",
    options: ["Hippogriff", "Thestral", "Centaur", "Boggart"],
    answer: "Thestral"
  },
  {
    question: "What does the Imperius Curse do?",
    options: ["Kills instantly", "Tortures", "Controls actions", "Disarms"],
    answer: "Controls actions"
  },
  {
    question: "Who kills Dumbledore?",
    options: ["Bellatrix", "Draco", "Snape", "Voldemort"],
    answer: "Snape"
  },
  {
    question: "Who will win ipl this century?",
    options: ["riyal challengers bengaluru", "RRRcb", "ರಾಯಲ್ ಚಾಲೆಂಜರ್ಸ್ ಬೆಂಗಳೂರು", "rcb"],
    answer: "rcb"
  },
];

export default function QuizApp() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizOver, setQuizOver] = useState(false);

  const handleOptionClick = (option) => {
    if (showAnswer) return;
    setSelected(option);
    setShowAnswer(true);
    if (option === questions[current].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    setShowAnswer(false);
    setSelected(null);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setQuizOver(true);
    }
  };

  return (
    <div style={styles.container}>
      <h1>🧙 Harry Potter Quiz</h1>
      {quizOver ? (
        <div>
          <h2>Quiz Completed!</h2>
          <p>Your Score: {score} / {questions.length}</p>
        </div>
      ) : (
        <>
          <h2>Q{current + 1}: {questions[current].question}</h2>
          <div style={styles.optionsContainer}>
            {questions[current].options.map((option, idx) => {
              let bg = "#eee";
              if (showAnswer) {
                if (option === questions[current].answer) bg = "#4CAF50"; // correct = green
                else if (option === selected) bg = "#f44336"; // incorrect = red
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  style={{ ...styles.optionButton, backgroundColor: bg }}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {showAnswer && (
            <button onClick={nextQuestion} style={styles.nextBtn}>
              {current + 1 < questions.length ? "Next →" : "Finish"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    fontFamily: 'Arial, sans-serif',
    padding: 20,
    backgroundColor: '#fefefe',
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginTop: 20,
    marginBottom: 20
  },
  optionButton: {
    padding: '12px 20px',
    border: 'none',
    fontSize: 16,
    borderRadius: 5,
    cursor: 'pointer',
    transition: '0.3s all',
  },
  nextBtn: {
    padding: '10px 20px',
    fontSize: 16,
    borderRadius: 5,
    border: 'none',
    backgroundColor: '#0070f3',
    color: 'white',
    cursor: 'pointer',
  }
};
