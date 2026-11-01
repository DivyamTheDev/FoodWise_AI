import store from '../services/store.js';
import { generateSmartAlertAdviceWithAI } from '../services/geminiService.js';

export const getAlerts = async (req, res) => {
  try {
    const alertsData = await store.getAlerts();
    const urgentItems = [...alertsData.expiringToday, ...alertsData.expiringSoon, ...alertsData.expired];

    // Fetch AI preservation advice for these expiring items
    let aiAdvice = null;
    try {
      aiAdvice = await generateSmartAlertAdviceWithAI(urgentItems);
    } catch (err) {
      console.warn('AI advice fallback:', err.message);
    }

    res.json({
      success: true,
      alerts: alertsData,
      aiAdvice: aiAdvice || {
        urgencyLevel: alertsData.totalAlerts > 0 ? 'Moderate' : 'Low',
        summary: `You have ${alertsData.totalAlerts} items needing attention.`,
        tips: ['Plan meals around items expiring within 3 days.'],
      },
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
