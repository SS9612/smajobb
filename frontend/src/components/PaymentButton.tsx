import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import PaymentModal from './PaymentModal';

interface PaymentButtonProps {
  bookingId: string;
  amount: number;
  onPaymentSuccess?: () => void;
  disabled?: boolean;
  className?: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  bookingId,
  amount,
  onPaymentSuccess,
  disabled = false,
  className = ''
}) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handlePaymentSuccess = () => {
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={disabled}
        className={`btn btn-primary ${className}`}
      >
        Betala {amount.toFixed(2)} SEK
      </button>

      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        bookingId={bookingId}
        amount={amount}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default PaymentButton;
