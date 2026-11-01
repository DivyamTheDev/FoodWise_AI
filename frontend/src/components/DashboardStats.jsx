import React from 'react';
import { Package, AlertCircle, AlertTriangle, CheckCircle2, DollarSign, Sparkles } from 'lucide-react';

export default function DashboardStats({ alertsData, onGoToAlerts, onGoToRecipes }) {
  const expiredCount = alertsData?.expired?.length || 0;
  const expiringTodayCount = alertsData?.expiringToday?.length || 0;
  const expiringSoonCount = alertsData?.expiringSoon?.length || 0;
  const freshCount = alertsData?.freshCount || 0;
  const totalItems = alertsData?.totalItems || 0;
  const atRiskCost = alertsData?.totalAtRiskCost || 0;

  const urgentTotal = expiredCount + expiringTodayCount + expiringSoonCount;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      
      {/* Total Items Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Stored</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalItems}</h3>
          <p className="text-xs text-slate-400 mt-0.5">items tracked</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
          <Package className="w-5 h-5" />
        </div>
      </div>

      {/* Expiring Soon / Urgent Card */}
      <div 
        onClick={onGoToAlerts}
        className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-amber-300 transition-all hover:shadow"
      >
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium text-amber-700 uppercase tracking-wider">Need Action</p>
            {urgentTotal > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-amber-700 mt-1">
            {expiringTodayCount + expiringSoonCount}
          </h3>
          <p className="text-xs text-amber-600 mt-0.5">
            {expiringTodayCount > 0 ? `${expiringTodayCount} today, ${expiringSoonCount} in 3 days` : 'within 3 days'}
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      {/* Expired Items Card */}
      <div 
        onClick={onGoToAlerts}
        className="bg-white p-4 rounded-2xl border border-rose-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-rose-300 transition-all hover:shadow"
      >
        <div>
          <p className="text-xs font-medium text-rose-700 uppercase tracking-wider">Expired</p>
          <h3 className="text-2xl font-bold text-rose-700 mt-1">{expiredCount}</h3>
          <p className="text-xs text-rose-500 mt-0.5">check or discard</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
          <AlertCircle className="w-5 h-5" />
        </div>
      </div>

      {/* Fresh & Value at Risk */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wider">Fresh Items</p>
          <h3 className="text-2xl font-bold text-emerald-700 mt-1">{freshCount}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            ${atRiskCost.toFixed(2)} at risk
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

    </div>
  );
}
