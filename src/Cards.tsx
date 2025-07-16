
import './App.css'
import cardback from './assets/cardback.png'

import { useState } from 'react';



type Card = {
  id: number;
  animal: string;
  isFlipped: boolean;
};

type Props = {
  displayedCards: Card[];
   onFlip: (id: number) => void;
};


const Cards = ({ displayedCards,  onFlip }: Props) => {
  return (
    <div className='cards'>
      {displayedCards.map((card, index) => (
        <div  className={card.isFlipped? 'card-flipped':'card' } key={index} onClick={() => onFlip(card.id)}>
            <img src={
            card.isFlipped ? `src/assets/${card.animal}_emoji.png` :
            cardback} className= {card.isFlipped? "image-flipped-class": "image-class"} alt="cardback" />
            <div className='layer'></div>
        </div>
      ))}
    </div>
  );
};

export default Cards
