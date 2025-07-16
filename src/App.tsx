import { useEffect, useState } from 'react';
import logo from './assets/logo.png'
import cogwheel from './assets/cogwheel.png'
import './App.css'
import Cards from './Cards.tsx'
import { TimeUpModal } from './TimeUpModal';
import { SettingsModal } from './SettingsModal.tsx';

const animals = [
  'cat',
  'dog',
  'frog',
  'lion',
  'panda',
  'rabbit',
  'bear',
  'tiger',
  'pig',
  'fox',
];

type Card = {
  id: number;
  animal: string;
  isFlipped: boolean;
   isMatched: boolean;
};

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}


const createCardDeck = (x: number): Card[] => {
  if (x % 2 !== 0 || x > 20) throw new Error('x must be even and ≤ 20');
  let count = 0;
  const neededAnimals = animals.slice(0, x / 2);
  const duplicated = [...neededAnimals, ...neededAnimals];
  const shuffled = shuffle(duplicated);
  return shuffled.map(animal => ({
    id: count++,
    animal,
    isFlipped: false,
    isMatched: false
  }));
};

function App() {

  const defaultStartTime = 30;
  const defaultCardCount = 12;

  const [cardCount, setCardCount] = useState(defaultCardCount);
  const [displayedCards, setDisplayedCards] = useState<Card[]>(() => createCardDeck(cardCount));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [seconds, setSeconds] = useState(defaultStartTime);
  const [isRunning, setIsRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  let matchedCount = (displayedCards.filter(card => card.isMatched).length)/2;
  const [mistakesCount, setMistakesCount] = useState(0); // Placeholder for mistakes count
  const [gameWon, setGameWon] = useState(false);


   const [settingsOpen, setSettingsOpen] = useState(false);
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [timerKey, setTimerKey] = useState(0);

   const handleFlip = (id: number) => {
    if (seconds <= 0) return; 
    const alreadyFlipped = flippedIndices.includes(id);
    const card = displayedCards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched || alreadyFlipped || flippedIndices.length === 2) return;

    const newFlipped = [...flippedIndices, id];
    setDisplayedCards(prev =>
      prev.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedIndices(newFlipped);
  };

 const handleSaveSettings = (cards: number, countdown: number) => {
  setCardCount(cards);
  setStartTime(countdown);
  setSettingsOpen(false);
  restartGame(cards, countdown); 
};

const restartGame = (newCardCount: number, newStartTime: number) => {
  setIsRunning(false);
  setDisplayedCards(createCardDeck(newCardCount));
  setFlippedIndices([]);
  setSeconds(newStartTime);
  setGameOver(false);
  setGameWon(false);
  setMistakesCount(0);
  matchedCount = 0;

  setTimerKey(prev => prev + 1);
  setIsRunning(true);
};

   useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstId, secondId] = flippedIndices;
      const firstCard = displayedCards.find(c => c.id === firstId);
      const secondCard = displayedCards.find(c => c.id === secondId);

      if (!firstCard || !secondCard) return;

      if (firstCard.animal === secondCard.animal) {
        matchedCount++;
        // Match: mark as matched, keep flipped
        setDisplayedCards(prev =>
          prev.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setFlippedIndices([]);
      } else {
        // Not a match: flip back after delay
        setMistakesCount(mistakesCount + 1);

        setTimeout(() => {
          setDisplayedCards(prev =>
            prev.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedIndices([]);
        }, 1500); // 1 second delay
      }
    }
  }, [flippedIndices, displayedCards]);

useEffect(() => {
  if (!isRunning) return;

  const interval = setInterval(() => {
    setSeconds(prev => {
      if (prev <= 1) {
        clearInterval(interval);
        setGameOver(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [isRunning, timerKey]);

  useEffect(() => {
    if (matchedCount === cardCount / 2) {
      setIsRunning(false);
      setGameWon(true);
      setGameOver(true); 
    }
  }, [matchedCount]);

  useEffect(() => {
    const allMatched = displayedCards.every(card => card.isMatched);
    if (allMatched) {
      setIsRunning(false);
    }
  }, [displayedCards]);

  // Format time as MM:SS
  const formatTime = (total: number) => {
  
    return `${total.toString()}`;
  };

 
  return (
    <>
      <div className="memory-header"> 
          <img src={logo} className="logo" alt="Vite logo" />
          <p className='timer'>
              {formatTime(seconds)}
          </p>   
           <div className="memory-data" style={{
                borderLeft: '1px solid #ddd',
                paddingLeft: '1rem',
                fontFamily: 'sans-serif',
              }}>
                <div style={{ fontWeight: 600 }}>{matchedCount} matches</div>
                <div style={{ fontWeight: 600 }}>{mistakesCount} mistakes</div>
          </div>
          
          <button
            className="settings-button"
            onClick={() => setSettingsOpen(true)}
            title="Settings"
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
          ><img src={cogwheel} className="cogwheel-img" alt="Vite logo" />
            <i className="fas fa-cog"></i>
          </button>
          
      </div>
     
      <div className='card_container'>
     
        <Cards displayedCards={displayedCards} onFlip={handleFlip} />
      
      </div>

      {gameOver && (
            <TimeUpModal
              message={gameWon ? "🎉 You found all pairs!" : "⏰ Time is up!"}
              onRestart={async () => restartGame(cardCount, startTime)}
            />
          )}
     
      <SettingsModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                onSave={handleSaveSettings}
                startTime={startTime}
                startCardCount={cardCount}
              />
    </>
  )
}

export default App;
