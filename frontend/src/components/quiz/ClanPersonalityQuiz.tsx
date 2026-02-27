import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Sparkles, LogIn } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { quizQuestions } from '../../data/quizQuestions';
import { calculateClanResult, normalizeScores } from '../../utils/clanScoring';
import { clanResultData } from '../../data/clanDescriptions';
import { useBadgeUnlockLogic } from '../../hooks/useBadgeUnlockLogic';
import { useGetUnlockedBadges, useUnlockBadge } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { getBadgeById } from '../../data/badges';
import BadgeUnlockToast from '../BadgeUnlockToast';
import QuizResultCard from './QuizResultCard';
import BalanceUnlockAnimation from './BalanceUnlockAnimation';
import type { ClanId, QuizAnswer } from '../../data/quizQuestions';
import type { ClanScores } from '../../utils/clanScoring';
import type { Badge } from '../../data/badges';

type QuizPhase = 'intro' | 'questions' | 'results';

const CLAN_HOVER_COLORS: Record<ClanId, string> = {
  moon: '168, 200, 240',
  fire: '255, 69, 0',
  water: '0, 191, 255',
  sun: '245, 200, 66',
  balance: '224, 64, 251',
};

export default function ClanPersonalityQuiz() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [phase, setPhase] = useState<QuizPhase>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [scores, setScores] = useState<ClanScores>({ moon: 0, fire: 0, water: 0, sun: 0, balance: 0 });
  const [resultClanId, setResultClanId] = useState<ClanId | null>(null);
  const [isBalanceUnlock, setIsBalanceUnlock] = useState(false);
  const [toasts, setToasts] = useState<Badge[]>([]);
  const [questionVisible, setQuestionVisible] = useState(true);
  const hasProcessedBadges = useRef(false);

  const { data: alreadyUnlocked = [] } = useGetUnlockedBadges();
  const unlockBadge = useUnlockBadge();

  // Badge logic — only runs when we have a result
  const badgeResult = useBadgeUnlockLogic(
    resultClanId
      ? {
          matchedClanId: resultClanId,
          traitScores: normalizeScores(scores),
        }
      : {}
  );

  // Process badge unlocks when result is ready
  useEffect(() => {
    if (!resultClanId || !isAuthenticated || hasProcessedBadges.current) return;
    if (badgeResult.length === 0) return;

    hasProcessedBadges.current = true;
    const newBadges: Badge[] = [];

    badgeResult.forEach(badgeId => {
      if (!alreadyUnlocked.includes(badgeId)) {
        const badge = getBadgeById(badgeId);
        if (badge) {
          newBadges.push(badge);
          unlockBadge.mutate(badgeId);
        }
      }
    });

    if (newBadges.length > 0) {
      setToasts(newBadges);
    }
  }, [resultClanId, isAuthenticated, badgeResult, alreadyUnlocked]);

  const handleStart = () => {
    setPhase('questions');
    setCurrentQ(0);
    setSelectedAnswer(null);
    setScores({ moon: 0, fire: 0, water: 0, sun: 0, balance: 0 });
    hasProcessedBadges.current = false;
  };

  const handleSelectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const answer: QuizAnswer = quizQuestions[currentQ].answers[selectedAnswer];

    // Accumulate scores
    const newScores = { ...scores };
    for (const [clanId, pts] of Object.entries(answer.weights) as [ClanId, number][]) {
      newScores[clanId] = (newScores[clanId] ?? 0) + pts;
    }
    setScores(newScores);

    if (currentQ < quizQuestions.length - 1) {
      // Animate question transition
      setQuestionVisible(false);
      setTimeout(() => {
        setCurrentQ(prev => prev + 1);
        setSelectedAnswer(null);
        setQuestionVisible(true);
      }, 300);
    } else {
      // Last question — calculate result
      const result = calculateClanResult(newScores);
      setResultClanId(result.winnerClanId);
      setIsBalanceUnlock(result.isBalanceClanUnlock);
      setPhase('results');
    }
  };

  const handleRetake = () => {
    setPhase('intro');
    setCurrentQ(0);
    setSelectedAnswer(null);
    setScores({ moon: 0, fire: 0, water: 0, sun: 0, balance: 0 });
    setResultClanId(null);
    setIsBalanceUnlock(false);
    setToasts([]);
    hasProcessedBadges.current = false;
    setQuestionVisible(true);
  };

  const dismissToast = (badgeId: string) => {
    setToasts(prev => prev.filter(b => b.id !== badgeId));
  };

  const question = quizQuestions[currentQ];
  const progress = ((currentQ) / quizQuestions.length) * 100;

  return (
    <>
      {/* Toast stack */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 items-end">
        {toasts.map((badge, i) => (
          <BadgeUnlockToast
            key={badge.id}
            badge={badge}
            index={i}
            onDismiss={() => dismissToast(badge.id)}
          />
        ))}
      </div>

      {/* ── INTRO PHASE ─────────────────────────────────────────────────────── */}
      {phase === 'intro' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-16">
          {/* Floating clan emblems */}
          <div className="relative mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              {(['moon', 'fire', 'water', 'sun'] as ClanId[]).map((id, i) => (
                <div
                  key={id}
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle, rgba(${CLAN_HOVER_COLORS[id]},0.2) 0%, rgba(10,10,25,0.8) 70%)`,
                    border: `1px solid rgba(${CLAN_HOVER_COLORS[id]},0.4)`,
                    boxShadow: `0 0 15px rgba(${CLAN_HOVER_COLORS[id]},0.3)`,
                    animation: `float ${2.5 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                >
                  <img
                    src={clanResultData[id].iconPath}
                    alt={clanResultData[id].name}
                    className="w-8 h-8 object-contain"
                    style={{ filter: `drop-shadow(0 0 6px rgba(${CLAN_HOVER_COLORS[id]},0.7))` }}
                  />
                </div>
              ))}
            </div>
            {/* Balance clan center */}
            <div className="flex justify-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, rgba(224,64,251,0.2) 0%, rgba(10,5,20,0.8) 70%)',
                  border: '1px solid rgba(224,64,251,0.4)',
                  boxShadow: '0 0 20px rgba(224,64,251,0.3), 0 0 40px rgba(245,200,66,0.15)',
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                <img
                  src={clanResultData.balance.iconPath}
                  alt="Balance Clan"
                  className="w-10 h-10 object-contain"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(224,64,251,0.8))' }}
                />
              </div>
            </div>
          </div>

          <div
            className="font-rajdhani text-xs tracking-[0.4em] uppercase mb-3"
            style={{ color: 'rgba(168,200,240,0.7)' }}
          >
            Whispers of the White Moon
          </div>

          <h1
            className="font-cinzel text-3xl sm:text-5xl font-black tracking-wider mb-4"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a8c8f0 40%, #f5c842 70%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(168,200,240,0.4))',
            }}
          >
            CLAN PERSONALITY QUIZ
          </h1>

          <p className="font-rajdhani text-base sm:text-lg text-white/60 tracking-wide max-w-xl mb-3">
            Answer 10 questions to discover which clan your soul truly belongs to.
          </p>
          <p className="font-rajdhani text-sm text-white/40 tracking-widest mb-10">
            A rare few may unlock the secret Balance Clan…
          </p>

          <button
            onClick={handleStart}
            className="group relative flex items-center gap-3 px-10 py-4 rounded-lg font-cinzel font-bold text-sm tracking-widest uppercase transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(168,200,240,0.15) 0%, rgba(168,200,240,0.08) 100%)',
              border: '1px solid rgba(168,200,240,0.4)',
              color: '#a8c8f0',
              boxShadow: '0 0 20px rgba(168,200,240,0.2), 0 0 40px rgba(168,200,240,0.1)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(168,200,240,0.5), 0 0 60px rgba(168,200,240,0.2)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,200,240,0.7)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(168,200,240,0.2), 0 0 40px rgba(168,200,240,0.1)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,200,240,0.4)';
            }}
          >
            <Sparkles className="w-4 h-4" />
            Begin Your Journey
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* ── QUESTIONS PHASE ──────────────────────────────────────────────────── */}
      {phase === 'questions' && (
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="font-rajdhani text-xs tracking-widest uppercase text-white/40">
                Question {currentQ + 1} of {quizQuestions.length}
              </span>
              <span className="font-rajdhani text-xs tracking-widest uppercase text-white/40">
                {Math.round(progress)}%
              </span>
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: 'rgba(168,200,240,0.1)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #a8c8f0, #f5c842)',
                  boxShadow: '0 0 8px rgba(168,200,240,0.6)',
                }}
              />
            </div>
          </div>

          {/* Question card */}
          <div
            className="rounded-2xl p-6 sm:p-8 mb-6"
            style={{
              opacity: questionVisible ? 1 : 0,
              transform: questionVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              background: 'linear-gradient(135deg, rgba(168,200,240,0.06) 0%, rgba(10,10,25,0.95) 50%, rgba(168,200,240,0.04) 100%)',
              border: '1px solid rgba(168,200,240,0.2)',
              boxShadow: '0 0 30px rgba(168,200,240,0.1), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Question number badge */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-cinzel text-xs font-bold"
                style={{
                  background: 'rgba(168,200,240,0.15)',
                  border: '1px solid rgba(168,200,240,0.3)',
                  color: '#a8c8f0',
                }}
              >
                {currentQ + 1}
              </div>
              <div
                className="h-px flex-1"
                style={{ background: 'linear-gradient(90deg, rgba(168,200,240,0.3), transparent)' }}
              />
            </div>

            <h2 className="font-cinzel text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">
              {question.question}
            </h2>

            {/* Answer options */}
            <div className="flex flex-col gap-3">
              {question.answers.map((answer, i) => {
                const isSelected = selectedAnswer === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelectAnswer(i)}
                    className="text-left px-5 py-4 rounded-xl font-rajdhani text-sm sm:text-base font-medium tracking-wide transition-all duration-250"
                    style={{
                      background: isSelected
                        ? 'rgba(168,200,240,0.15)'
                        : 'rgba(255,255,255,0.03)',
                      border: isSelected
                        ? '1px solid rgba(168,200,240,0.6)'
                        : '1px solid rgba(255,255,255,0.08)',
                      color: isSelected ? '#a8c8f0' : 'rgba(255,255,255,0.7)',
                      boxShadow: isSelected
                        ? '0 0 15px rgba(168,200,240,0.25), inset 0 0 15px rgba(168,200,240,0.05)'
                        : 'none',
                      transform: isSelected ? 'translateX(4px)' : 'translateX(0)',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(168,200,240,0.07)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,200,240,0.3)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
                        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)';
                      }
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mr-3 flex-shrink-0"
                      style={{
                        background: isSelected ? 'rgba(168,200,240,0.3)' : 'rgba(255,255,255,0.08)',
                        border: isSelected ? '1px solid rgba(168,200,240,0.6)' : '1px solid rgba(255,255,255,0.15)',
                        color: isSelected ? '#a8c8f0' : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {answer.text}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next button */}
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="flex items-center gap-2 px-8 py-3 rounded-lg font-cinzel font-bold text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: selectedAnswer !== null
                  ? 'linear-gradient(135deg, rgba(168,200,240,0.2) 0%, rgba(168,200,240,0.1) 100%)'
                  : 'rgba(255,255,255,0.05)',
                border: selectedAnswer !== null
                  ? '1px solid rgba(168,200,240,0.5)'
                  : '1px solid rgba(255,255,255,0.1)',
                color: selectedAnswer !== null ? '#a8c8f0' : 'rgba(255,255,255,0.3)',
                boxShadow: selectedAnswer !== null ? '0 0 20px rgba(168,200,240,0.2)' : 'none',
              }}
            >
              {currentQ < quizQuestions.length - 1 ? (
                <>Next <ChevronRight className="w-4 h-4" /></>
              ) : (
                <>Reveal My Clan <Sparkles className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── RESULTS PHASE ────────────────────────────────────────────────────── */}
      {phase === 'results' && resultClanId && (
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Balance Clan special animation */}
          {isBalanceUnlock && (
            <div className="mb-8">
              <BalanceUnlockAnimation />
            </div>
          )}

          {/* Result card */}
          <QuizResultCard
            clanId={resultClanId}
            isBalanceUnlock={isBalanceUnlock}
            onRetake={handleRetake}
          />

          {/* Login prompt for unauthenticated users */}
          {!isAuthenticated && (
            <div
              className="mt-6 rounded-xl p-5 text-center"
              style={{
                background: 'rgba(168,200,240,0.05)',
                border: '1px solid rgba(168,200,240,0.15)',
              }}
            >
              <p className="font-rajdhani text-sm text-white/50 mb-3 tracking-wide">
                Log in to save your clan result and unlock achievement badges!
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-rajdhani font-semibold text-sm tracking-widest uppercase transition-all duration-300"
                style={{
                  background: 'rgba(168,200,240,0.1)',
                  border: '1px solid rgba(168,200,240,0.3)',
                  color: '#a8c8f0',
                }}
              >
                <LogIn className="w-4 h-4" />
                Login to Save Badges
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
