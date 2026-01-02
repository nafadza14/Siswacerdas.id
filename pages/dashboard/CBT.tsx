import React, { useState, useEffect, useCallback } from 'react';
import { MOCK_EXAM } from '../../constants';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const CBT: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(MOCK_EXAM.durationMinutes * 60);
  const [warnings, setWarnings] = useState(0);

  // Anti-Cheat: Visibility & Focus Logic
  useEffect(() => {
    if (!started || finished) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerWarning("Tab switch detected!");
      }
    };

    const handleBlur = () => {
      triggerWarning("Window focus lost!");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [started, finished]);

  // Timer Logic
  useEffect(() => {
    if (!started || finished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, finished]);

  const triggerWarning = (reason: string) => {
    setWarnings(prev => prev + 1);
    alert(`CHEAT GUARD ALERT: ${reason}\n\nWarning ${warnings + 1}/3. If you reach 3, the exam will auto-submit.`);
    if (warnings >= 2) {
      finishExam();
    }
  };

  const finishExam = () => {
    setFinished(true);
  };

  const handleAnswer = (questionId: string, optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!started) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-primary w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2">{MOCK_EXAM.title}</h2>
          <p className="text-gray-500 mb-6">{MOCK_EXAM.subject} • {MOCK_EXAM.durationMinutes} Minutes</p>
          
          <div className="bg-orange-50 p-4 rounded-xl text-left mb-6">
            <h3 className="font-bold text-secondary text-sm mb-2 flex items-center gap-2">
              <AlertTriangle size={16} /> Exam Rules
            </h3>
            <ul className="text-sm text-gray-600 list-disc ml-4 space-y-1">
              <li>Do not switch tabs.</li>
              <li>Do not minimize the browser.</li>
              <li>Warnings will be issued for violations.</li>
              <li>3 Warnings = Auto Fail.</li>
            </ul>
          </div>

          <button 
            onClick={() => setStarted(true)}
            className="w-full bg-primary hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition"
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const score = MOCK_EXAM.questions.reduce((acc, q) => {
      return acc + (answers[q.id] === q.correctOptionIndex ? 1 : 0);
    }, 0);
    const percentage = Math.round((score / MOCK_EXAM.questions.length) * 100);

    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Exam Completed</h2>
          <div className="text-6xl font-extrabold text-primary mb-2">{percentage}%</div>
          <p className="text-gray-500 mb-6">You answered {score} out of {MOCK_EXAM.questions.length} correctly.</p>
          <div className="text-sm text-red-500 mb-6">Warnings Triggered: {warnings}</div>
          <button onClick={() => window.location.hash = '#/dashboard'} className="text-gray-500 hover:text-dark">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  const currentQ = MOCK_EXAM.questions[currentQuestionIdx];

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 sticky top-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
            {currentQuestionIdx + 1}
          </div>
          <span className="text-sm text-gray-500">of {MOCK_EXAM.questions.length} Questions</span>
        </div>
        
        <div className={`flex items-center gap-2 font-mono font-bold text-xl ${timeLeft < 300 ? 'text-red-500' : 'text-primary'}`}>
          <Clock size={20} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border-b-4 border-gray-100 mb-6">
        <h3 className="text-xl font-medium text-dark mb-8">{currentQ.text}</h3>
        
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(currentQ.id, idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                answers[currentQ.id] === idx 
                  ? 'border-primary bg-primary/5 text-primary font-semibold' 
                  : 'border-gray-100 hover:border-gray-300 text-gray-600'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                 answers[currentQ.id] === idx ? 'bg-primary border-primary text-white' : 'border-gray-300'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button 
          onClick={() => setCurrentQuestionIdx(p => Math.max(0, p - 1))}
          disabled={currentQuestionIdx === 0}
          className="px-6 py-2 text-gray-500 font-medium disabled:opacity-50 hover:bg-white rounded-lg transition"
        >
          Previous
        </button>
        
        {currentQuestionIdx === MOCK_EXAM.questions.length - 1 ? (
          <button 
            onClick={finishExam}
            className="px-8 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 transition"
          >
            Submit Exam
          </button>
        ) : (
          <button 
            onClick={() => setCurrentQuestionIdx(p => Math.min(MOCK_EXAM.questions.length - 1, p + 1))}
            className="px-8 py-3 bg-dark text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
};

export default CBT;
