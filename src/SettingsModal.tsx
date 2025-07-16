import React, { useState } from 'react';
import './SettingsModal.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cards: number, countdown: number) => void;
  startTime: number; // Optional prop for initial countdown time
  startCardCount: number; // Optional prop for initial card count
};

export function SettingsModal({ isOpen, onClose, onSave, startTime, startCardCount }: Props) {
  const [cardCount, setCardCount] = useState(startCardCount);
  const [countdown, setCountdown] = useState(startTime);

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <h2>Game Settings</h2>

        <label>
          Number of cards (even, max 16):
          <input
            type="number"
            min={2}
            max={20}
            step={2}
            value={cardCount}
            onChange={e => setCardCount(Number(e.target.value))}
          />
        </label>

        <label>
          Countdown time (seconds):
          <input
            type="number"
            min={10}
            max={300}
            value={countdown}
            onChange={e => setCountdown(Number(e.target.value))}
          />
        </label>

        <div className="modal-buttons">
          <button onClick={() => onSave(cardCount, countdown)}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
