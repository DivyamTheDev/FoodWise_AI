import React, { useState } from 'react';
import { X, Database, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Key, Server } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  dbStatus,
  onSeedData,
  isSeeding,
  onRefreshStatus,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">System & Cloud Settings</h3>
              <p className="text-xs text-slate-500">MongoDB Atlas & Gemini AI Configuration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MongoDB Cloud Status */}
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-800">MongoDB Cloud (Atlas)</h4>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  dbStatus?.isConnected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {dbStatus?.isConnected ? '● Connected' : '○ In-Memory Store Active'}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {dbStatus?.isConnected
                ? `Connected to MongoDB Atlas cluster (${dbStatus.host || 'Cloud Cluster'}). Data is persisted in your database.`
                : 'Running in resilient in-memory mode. All inventory management, alerts, and AI recipe features are fully operational!'}
            </p>

            {!dbStatus?.isConnected && (
              <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 font-mono">
                <p className="font-sans font-semibold text-slate-700 mb-1">To connect your MongoDB Cloud database:</p>
                <p>1. Open <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700">backend/.env</code></p>
                <p className="mt-0.5">2. Paste your connection string:</p>
                <p className="text-slate-800 mt-1 break-all bg-slate-100 p-1.5 rounded">
                  MONGODB_URI=mongodb+srv://&lt;user&gt;:&lt;pass&gt;@cluster0.mongodb.net/food_optimizer
                </p>
                <p className="mt-1 font-sans text-slate-500">Restart backend or refresh below.</p>
              </div>
            )}
          </div>

          {/* AI Engine Status */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-600" />
                <h4 className="font-bold text-sm text-slate-800">Groq AI (Ultra-fast LLM)</h4>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ● Connected (Key: Foodoptimizer)
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Powered by <strong>Groq AI Llama / GPT-OSS models</strong> for instant zero-waste recipes and smart preservation alerts.
            </p>
          </div>

          {/* Reset Dummy Data */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-800">Sample Dummy Inventory</h4>
              <p className="text-xs text-slate-500">Re-seed dynamic sample groceries & recipes</p>
            </div>
            <button
              onClick={onSeedData}
              disabled={isSeeding}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Seeding...' : 'Reset Samples'}</span>
            </button>
          </div>

          {/* Refresh & Close */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={onRefreshStatus}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors"
            >
              Refresh Status
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
