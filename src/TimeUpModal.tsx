
import './TimeUpModal.css';

type Props = {
  onRestart: () => {};
  message: string;
};

export function TimeUpModal({ onRestart, message }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <button onClick={onRestart}>Restart</button>
      </div>
    </div>
  );
}