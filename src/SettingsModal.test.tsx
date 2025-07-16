import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsModal } from './SettingsModal';

describe('SettingsModal', () => {
  const setup = () => {
    const onSave = jest.fn();
    const onClose = jest.fn();

    render(
      <SettingsModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
        startCardCount={8}
        startTime={60}
      />
    );

    return { onSave, onClose };
  };

  it('renders correctly with initial values', () => {
    setup();

    expect(screen.getByText('Game Settings')).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of cards/i)).toHaveValue(8);
    expect(screen.getByLabelText(/Countdown time/i)).toHaveValue(60);
  });

  it('calls onSave with updated values', () => {
    const { onSave } = setup();

    fireEvent.change(screen.getByLabelText(/Number of cards/i), {
      target: { value: '12' }
    });

    fireEvent.change(screen.getByLabelText(/Countdown time/i), {
      target: { value: '90' }
    });

    fireEvent.click(screen.getByText('Save'));

    expect(onSave).toHaveBeenCalledWith(12, 90);
  });

  it('calls onClose when Cancel is clicked', () => {
    const { onClose } = setup();

    fireEvent.click(screen.getByText('Cancel'));

    expect(onClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    const { queryByText } = render(
      <SettingsModal
        isOpen={false}
        onClose={jest.fn()}
        onSave={jest.fn()}
        startCardCount={4}
        startTime={30}
      />
    );

    expect(queryByText('Game Settings')).toBeNull();
  });
});
