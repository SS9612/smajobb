import React, { useState, useEffect } from 'react';
import { paymentsApi, PaymentIntent } from '../services/paymentsApi';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  amount: number;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  amount,
  onSuccess
}) => {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('confirm');
      setError(null);
      setPaymentIntent(null);
    }
  }, [isOpen]);

  const handleConfirmPayment = async () => {
    try {
      setStep('processing');
      setError(null);

      // Create payment intent
      const intent = await paymentsApi.createIntent(bookingId, amount * 100);
      setPaymentIntent(intent);

      // Simulate payment processing (in real app, integrate with PSP)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Confirm payment
      const result = await paymentsApi.confirm(intent.paymentIntentId);
      
      if (result.success) {
        setStep('success');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setStep('error');
        setError(result.message || 'Betalning misslyckades');
      }
    } catch (err: any) {
      setStep('error');
      setError('Ett fel uppstod vid betalningen');
    }
  };

  const handleCancel = () => {
    if (paymentIntent) {
      paymentsApi.cancel(paymentIntent.paymentIntentId);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Bekräfta betalning</h3>
          <button onClick={handleCancel} className="modal-close">×</button>
        </div>

        <div className="modal-body">
          {step === 'confirm' && (
            <div>
              <div className="payment-summary">
                <h4>Betalningssammanfattning</h4>
                <div className="payment-details">
                  <div className="payment-row">
                    <span>Belopp:</span>
                    <span>{amount.toFixed(2)} SEK</span>
                  </div>
                  <div className="payment-row">
                    <span>Plattformsavgift (10%):</span>
                    <span>{(amount * 0.1).toFixed(2)} SEK</span>
                  </div>
                  <div className="payment-row payment-total">
                    <span>Totalt:</span>
                    <span>{amount.toFixed(2)} SEK</span>
                  </div>
                </div>
              </div>
              <p className="payment-note">
                Genom att bekräfta godkänner du betalningen för denna bokning.
              </p>
            </div>
          )}

          {step === 'processing' && (
            <div className="payment-processing">
              <div className="spinner"></div>
              <h4>Bearbetar betalning...</h4>
              <p>Vänligen vänta medan vi behandlar din betalning.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="payment-success">
              <div className="success-icon">✓</div>
              <h4>Betalning genomförd!</h4>
              <p>Din betalning har bekräftats och bokningen är nu betald.</p>
            </div>
          )}

          {step === 'error' && (
            <div className="payment-error">
              <div className="error-icon">✗</div>
              <h4>Betalning misslyckades</h4>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step === 'confirm' && (
            <>
              <button onClick={handleCancel} className="btn btn-secondary">
                Avbryt
              </button>
              <button onClick={handleConfirmPayment} className="btn btn-primary">
                Bekräfta betalning
              </button>
            </>
          )}
          {step === 'error' && (
            <button onClick={handleCancel} className="btn btn-primary">
              Stäng
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
