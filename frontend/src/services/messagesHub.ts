import * as signalR from '@microsoft/signalr';

const HUB_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5106/api').replace(/\/api$/, '');

let connection: signalR.HubConnection | null = null;

export type HubEvents = {
  messageReceived: (payload: any) => void;
  messageSent: (payload: any) => void;
  messageRead: (payload: any) => void;
  conversationRead: (payload: any) => void;
  paymentIntentCreated: (payload: any) => void;
  paymentConfirmed: (payload: any) => void;
  paymentReceived: (payload: any) => void;
};

export const messagesHub = {
  start: async (events: Partial<HubEvents> = {}) => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) return connection;

    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${HUB_BASE_URL}/hubs/message`, {
        accessTokenFactory: () => localStorage.getItem('authToken') || ''
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // register handlers
    if (events.messageReceived) connection.on('messageReceived', events.messageReceived);
    if (events.messageSent) connection.on('messageSent', events.messageSent);
    if (events.messageRead) connection.on('messageRead', events.messageRead);
    if (events.conversationRead) connection.on('conversationRead', events.conversationRead);
    if (events.paymentIntentCreated) connection.on('paymentIntentCreated', events.paymentIntentCreated);
    if (events.paymentConfirmed) connection.on('paymentConfirmed', events.paymentConfirmed);
    if (events.paymentReceived) connection.on('paymentReceived', events.paymentReceived);

    await connection.start();
    return connection;
  },

  stop: async () => {
    if (connection) {
      try {
        await connection.stop();
      } finally {
        connection = null;
      }
    }
  }
};


