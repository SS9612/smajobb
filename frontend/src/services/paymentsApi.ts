import { apiService } from './api';

export interface PaymentIntent {
  paymentIntentId: string;
  clientSecret: string;
  amountCents: number;
  currency: string;
  status: string;
}

export interface PaymentItem {
  id: string;
  bookingId: string;
  amountCents: number;
  currency: string;
  platformFeeCents: number;
  providerPaymentId?: string;
  status: string;
  createdAt: string;
}

export const paymentsApi = {
  createIntent: async (bookingId: string, amountCents: number): Promise<PaymentIntent> => {
    const res = await apiService.post<PaymentIntent>('/payment/intent', { bookingId, amountCents });
    return res.data;
  },

  confirm: async (paymentIntentId: string): Promise<{ success: boolean; message?: string }> => {
    const res = await apiService.post<{ Success: boolean; Message?: string }>('/payment/confirm', { paymentIntentId });
    return { success: res.data.Success, message: res.data.Message };
  },

  cancel: async (paymentIntentId: string): Promise<{ success: boolean; message?: string }> => {
    const res = await apiService.post<{ Success: boolean; Message?: string }>('/payment/cancel', { paymentIntentId });
    return { success: res.data.Success, message: res.data.Message };
  },

  getByUser: async (userId: string): Promise<PaymentItem[]> => {
    const res = await apiService.get<PaymentItem[]>(`/payment/user/${userId}`);
    return res.data;
  },

  getByBooking: async (bookingId: string): Promise<PaymentItem[]> => {
    const res = await apiService.get<PaymentItem[]>(`/payment/booking/${bookingId}`);
    return res.data;
  },
};


