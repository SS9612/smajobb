import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { paymentsApi, PaymentItem } from '../services/paymentsApi';
import { messagesHub } from '../services/messagesHub';

const Payments: React.FC = () => {
  const { user: authUser, isLoading } = useAuth();
  const [items, setItems] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (isLoading) return;
    if (!authUser) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const list = await paymentsApi.getByUser(authUser.id);
        setItems(list);
      } catch (e: any) {
        setError('Kunde inte hämta betalningar');
      } finally {
        setLoading(false);
      }
    };
    load();

    // Start SignalR hub for real-time payment updates
    messagesHub.start({
      paymentConfirmed: (payload: any) => {
        console.log('Payment confirmed:', payload);
        // Refresh payments list
        load();
      },
      paymentReceived: (payload: any) => {
        console.log('Payment received:', payload);
        // Refresh payments list
        load();
      }
    });

    return () => {
      messagesHub.stop();
    };
  }, [isLoading, authUser]);

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = searchTerm === '' || 
      item.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="container-wide">
        <div className="dashboard-content">Laddar betalningar...</div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="container-wide">
        <div className="dashboard-content">Du måste vara inloggad för att se betalningar.</div>
      </div>
    );
  }

  return (
    <div className="container-wide">
      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Mina transaktioner</h2>
            <div className="payment-filters">
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Alla statusar</option>
                <option value="pending">Väntande</option>
                <option value="completed">Genomförda</option>
                <option value="failed">Misslyckade</option>
                <option value="cancelled">Avbrutna</option>
              </select>
              <input
                type="text"
                placeholder="Sök efter booking ID eller status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="table">
            <div className="table-row table-header">
              <div>Datum</div>
              <div>Status</div>
              <div>Belopp</div>
              <div>Avgift</div>
              <div>Nettobelopp</div>
              <div>Booking</div>
            </div>
            {filteredItems.map(item => (
              <div key={item.id} className="table-row">
                <div>{new Date(item.createdAt).toLocaleString('sv-SE')}</div>
                <div>{item.status}</div>
                <div>{(item.amountCents / 100).toFixed(2)} {item.currency}</div>
                <div>{(item.platformFeeCents / 100).toFixed(2)} {item.currency}</div>
                <div>{((item.amountCents - item.platformFeeCents) / 100).toFixed(2)} {item.currency}</div>
                <div>{item.bookingId}</div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="table-row">
                <div>Inga transaktioner ännu.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;


