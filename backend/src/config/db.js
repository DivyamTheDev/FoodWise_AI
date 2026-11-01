import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

// Enable TLS resilience for local antivirus/proxy environments on Windows
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let isConnected = false;
let connectionError = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '' || uri.includes('<username>') || uri.includes('<db_username>')) {
    console.warn('⚠️  MONGODB_URI not set or contains placeholder. Running in dynamic in-memory store mode until connected.');
    isConnected = false;
    connectionError = 'No MongoDB URI configured in .env';
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 8000,
    });
    console.log(` MongoDB Cloud Atlas Connected! Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
    isConnected = true;
    connectionError = null;
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    isConnected = false;
    connectionError = error.message;
    return false;
  }
};

export const getDbStatus = () => ({
  isConnected: mongoose.connection.readyState === 1,
  uriConfigured: Boolean(process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<db_username>')),
  error: connectionError,
  host: mongoose.connection?.host || null,
  dbName: mongoose.connection?.name || null,
});
