import React, { useState } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Sparkles, 
  ChefHat, 
  Check, 
  Trash2, 
  Clock, 
  BellRing, 
  Lightbulb, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function ExpiryAlerts({ 
  alertsData, 
  aiAdvice, 
  onGenerateForIngredients, 
  onConsumeItem, 
  onDeleteItem,
  onRefreshAlerts
}) {
  const [filter, setFilter] = useState('all');
  const [notificationStatus, setNotificationStatus] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const requestNotification = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationStatus(perm);
      if (perm === 'granted') {
        new Notification('🥗 Food Optimizer Alerts Enabled!', {
          body: `You currently have ${alertsData?.totalAlerts || 0} items nearing expiration. We'll help you prevent food waste!`,
        });
      }
    }
  };

  const expired = alertsData?.expired || [];
  const expiringToday = alertsData?.expiringToday || [];
  const expiringSoon = alertsData?.expiringSoon || [];

  let displayedItems = [];
  if (filter === 'all') {
    displayedItems = [...expiringToday, ...expiringSoon, ...expired];
  } else if (filter === 'today') {
    displayedItems = expiringToday;
  } else if (filter === 'soon') {
    displayedItems = expiringSoon;
  } else if (filter === 'expired') {
    displayedItems = expired;
  }

  const handleCookAllUrgent = () => {
    const ids = [...expiringToday, ...expiringSoon].map((i) => i.id || i._id);
    onGenerateForIngredients(ids);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Call to action */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <AlertTriangle className="w-64 h-64 -mr-16" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-3">
            <BellRing className="w-3.5 h-3.5" />
            <span>Smart Waste Prevention Center</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {alertsData?.totalAlerts > 0
              ? `${alertsData.totalAlerts} Items Require Immediate Attention`
              : 'Everything looks fresh and safe!'}
          </h2>

          <p className="mt-2 text-white/90 text-sm sm:text-base leading-relaxed">
            {alertsData?.totalAlerts > 0
              ? `You have ~$${alertsData?.totalAtRiskCost || 0} of groceries near expiration. Turn them into delicious meals before they spoil!`
              : 'None of your groceries are in critical expiration danger. Great job managing your pantry!'}
          </p>

          {alertsData?.totalAlerts > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={handleCookAllUrgent}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-orange-700 hover:bg-orange-50 font-bold rounded-xl shadow transition-all active:scale-95"
              >
                <ChefHat className="w-4 h-4 text-orange-600" />
                <span>Create Recipes for All Expiring Items</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {notificationStatus !== 'granted' && (
                <button
                  onClick={requestNotification}
                  className="flex items-center gap-2 px-4 py-2.5 bg-black/20 hover:bg-black/30 backdrop-blur-md text-white font-medium text-sm rounded-xl transition-all"
                >
                  <BellRing className="w-4 h-4" />
                  <span>Enable Browser Alerts</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Preservation Tips & Food Saving Advice */}
      {aiAdvice && (
        <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-slate-50 border border-indigo-100/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-600/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3>AI Food Preservation & Salvage Guidance</h3>
                <span className="text-[11px] font-normal text-indigo-600">
                  {aiAdvice.provider || 'AI Analysis Engine'} • Urgency: {aiAdvice.urgencyLevel || 'Moderate'}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-700 font-medium">
            {aiAdvice.summary}
          </p>

          {aiAdvice.tips && aiAdvice.tips.length > 0 && (
            <div className="mt-3 grid sm:grid-cols-2 gap-2.5">
              {aiAdvice.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white/90 p-3 rounded-xl border border-indigo-100 text-xs text-slate-700">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Alerts ({alertsData?.totalAlerts || 0})
          </button>
          <button
            onClick={() => setFilter('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'today'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Expiring Today ({expiringToday.length})
          </button>
          <button
            onClick={() => setFilter('soon')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'soon'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            In 1-3 Days ({expiringSoon.length})
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'expired'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Expired ({expired.length})
          </button>
        </div>

        <button
          onClick={onRefreshAlerts}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
        >
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* List of Alert Items */}
      {displayedItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800">No items match this alert filter</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You're all set for now. Check the main inventory list to browse non-expiring goods.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {displayedItems.map((item) => {
            const isExp = item.status === 'expired';
            const isToday = item.status === 'expiring_today';
            const isSoon = item.status === 'expiring_soon';

            return (
              <div
                key={item.id || item._id}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-sm hover:shadow ${
                  isExp
                    ? 'border-rose-300 bg-rose-50/10'
                    : isToday
                    ? 'border-orange-300 bg-orange-50/10 ring-1 ring-orange-200'
                    : 'border-amber-200 bg-amber-50/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-slate-800">{item.name}</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span>Qty: <strong>{item.quantity} {item.unit}</strong></span>
                      <span>•</span>
                      <span>Location: <strong>{item.storageLocation}</strong></span>
                      {item.estimatedCost > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">${item.estimatedCost.toFixed(2)}</span>
                        </>
                      )}
                    </div>

                    {item.notes && (
                      <p className="mt-2 text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        "{item.notes}"
                      </p>
                    )}
                  </div>

                  {/* Urgency Badge */}
                  <div className="shrink-0 text-right">
                    {isToday && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-500 text-white shadow-sm animate-pulse">
                        <Clock className="w-3 h-3" />
                        Expires TODAY!
                      </span>
                    )}
                    {isSoon && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                        <Clock className="w-3 h-3" />
                        In {item.daysUntilExpiry} days
                      </span>
                    )}
                    {isExp && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-white">
                        <AlertCircle className="w-3 h-3 text-rose-400" />
                        Expired {Math.abs(item.daysUntilExpiry)}d ago
                      </span>
                    )}
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(item.expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onGenerateForIngredients([item.id || item._id])}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Get Recipe</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onConsumeItem(item.id || item._id, item.quantity)}
                      title="Mark as used / consumed"
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Used</span>
                    </button>

                    <button
                      onClick={() => onDeleteItem(item.id || item._id)}
                      title="Discard item"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
