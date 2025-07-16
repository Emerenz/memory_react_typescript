
import './App.css'
import cardback from './assets/cardback.png'

function Card() {
 

  return (
    <>
      <div className='card' >
         <img src={cardback} className="image-class" alt="cardback" />
        <div className='layer'></div>
      </div>
       
    </>
  )
}

export default Card
