import { GoogleGenerativeAI } from '@google/generative-ai';

// Intelligent fallback zero-waste rule engine
const generateFallbackRecipe = (ingredients, preferences = {}) => {
  const ingNames = ingredients.map((i) => (typeof i === 'string' ? i : i.name));
  const mainIng = ingNames.slice(0, 3).join(', ') || 'Leftover Ingredients';
  const diet = preferences.dietary || 'Flexible';

  return [
    {
      title: `Smart Pan-Tossed ${ingNames[0] || 'Market'} Stir-Fry with ${ingNames[1] || 'Fresh Herbs'}`,
      description: `A delicious, chef-inspired 15-minute skillet creation designed specifically to salvage ${mainIng} before they spoil.`,
      prepTime: '10 mins',
      cookTime: '12 mins',
      servings: 2,
      difficulty: 'Easy',
      usedIngredients: ingNames.slice(0, 4),
      additionalIngredients: [
        'Olive oil or sesame oil (1-2 tbsp)',
        'Minced garlic & grated ginger',
        'Soy sauce or pinch of sea salt',
        'Crushed black pepper or chili flakes',
      ],
      instructions: [
        `Wash and prep your expiring ingredients: chop ${ingNames.slice(0, 3).join(', ')} into bite-sized pieces.`,
        'Heat oil in a wide skillet or wok over medium-high heat. Add garlic and ginger, sizzling for 30 seconds until fragrant.',
        `Toss in the firmer ingredients first, cooking for 3-4 minutes until slightly tender.`,
        `Add leafy greens or softer ingredients like ${ingNames[0] || 'greens'} during the last 2 minutes so they retain color and vital nutrients.`,
        'Season with soy sauce, pepper, or herbs. Remove from heat and serve warm over rice, noodles, or enjoy as-is!',
      ],
      wastePreventionTip:
        'Stir-frying at medium-high heat seals in moisture and crisps up slightly softened produce, giving wilting vegetables a fresh, vibrant crunch.',
      dietaryTags: [diet, 'Zero-Waste', 'Under 20 Mins'],
      aiGenerated: true,
      provider: 'ByteBite Culinary Engine',
    },
    {
      title: `Hearty Baked Frittata with ${ingNames[0] || 'Vegetables'} & Pantry Melt`,
      description: `An easy one-pan oven bake that binds leftover ${mainIng} into a savory, protein-rich golden frittata.`,
      prepTime: '8 mins',
      cookTime: '18 mins',
      servings: 3,
      difficulty: 'Easy',
      usedIngredients: ingNames.slice(0, 4),
      additionalIngredients: [
        '4-6 Eggs (or chickpea flour batter for vegan)',
        '1/4 cup Milk or cream',
        'Shredded cheese or nutritional yeast',
        'Salt, pepper, dried oregano',
      ],
      instructions: [
        'Preheat oven to 375°F (190°C) or prepare a stovetop nonstick pan.',
        `Lightly sauté ${ingNames.slice(0, 2).join(' and ')} with a drizzle of oil for 3 minutes to release excess moisture.`,
        'In a bowl, whisk eggs with milk, a pinch of salt, pepper, and herbs until frothy.',
        'Pour egg mixture over the cooked ingredients in the pan. Scatter cheese on top.',
        'Cook on medium-low until the edges set, then bake or cover with a lid for 8-10 minutes until center is fluffy and set. Slice into wedges!',
      ],
      wastePreventionTip:
        'Eggs act as an all-purpose binder for nearly any surplus vegetable, cooked meat, or cheese ends in your fridge.',
      dietaryTags: ['High-Protein', 'Gluten-Free', 'Meal-Prep Friendly'],
      aiGenerated: true,
      provider: 'ByteBite Culinary Engine',
    },
  ];
};

export const generateRecipesWithAI = async (ingredients, preferences = {}) => {
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const ingredientList = ingredients
    .map((i) => {
      if (typeof i === 'string') return i;
      const days = i.daysUntilExpiry !== undefined ? ` (Expires in ${i.daysUntilExpiry} days)` : '';
      return `${i.name} - ${i.quantity} ${i.unit}${days}`;
    })
    .join(', ');

  const prompt = `You are a Michelin-star zero-food-waste chef and food sustainability expert.
I have the following ingredients available in my fridge/pantry, especially items expiring soon:
${ingredientList}

User Preferences:
- Dietary Restrictions: ${preferences.dietary || 'None / Flexible'}
- Meal Type: ${preferences.mealType || 'Any'}
- Desired Cook Time: ${preferences.cookTime || 'Quick / 30 mins max'}
- Additional Notes: ${preferences.customPrompt || 'Focus on minimizing food waste'}

Generate exactly 2 creative, practical, and delicious recipes that prioritize using the expiring ingredients first.
Return ONLY a valid JSON array of 2 recipes matching this exact format with no conversational markdown:
[
  {
    "title": "Recipe Name",
    "description": "Short tempting description highlighting how it uses expiring food",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 2,
    "difficulty": "Easy",
    "usedIngredients": ["Ingredient 1", "Ingredient 2"],
    "additionalIngredients": ["Pantry staple 1", "Pantry staple 2"],
    "instructions": [
      "Step 1...",
      "Step 2...",
      "Step 3..."
    ],
    "wastePreventionTip": "Specific practical food saving tip for these ingredients",
    "dietaryTags": ["Vegetarian", "Quick"]
  }
]`;

  // 1. Try Groq AI (Ultra-fast LLM)
  if (groqKey && groqKey.trim() !== '' && !groqKey.includes('placeholder')) {
    try {
      console.log('⚡ Generating recipes with Groq AI...');
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [
            {
              role: 'system',
              content: 'You are a culinary AI assistant. Always output only valid JSON without markdown fences.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        let content = data.choices[0]?.message?.content || '';
        content = content.replace(/```json/gi, '').replace(/```/g, '').trim();

        const jsonStart = content.indexOf('[');
        const jsonEnd = content.lastIndexOf(']');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          content = content.substring(jsonStart, jsonEnd + 1);
        }

        const parsed = JSON.parse(content);
        return parsed.map((r) => ({
          ...r,
          aiGenerated: true,
          provider: 'Groq AI (Ultra-fast LLM)',
        }));
      }
    } catch (err) {
      console.warn('Groq recipe generation error:', err.message);
    }
  }

  // 2. Try Google Gemini API
  if (geminiKey && geminiKey.trim() !== '' && !geminiKey.includes('your_gemini')) {
    try {
      console.log('🌟 Generating recipes with Google Gemini...');
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const cleaned = responseText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      return parsed.map((r) => ({
        ...r,
        aiGenerated: true,
        provider: 'Google Gemini AI',
      }));
    } catch (error) {
      console.warn('Gemini recipe generation error:', error.message);
    }
  }

  // 3. Fallback engine
  return generateFallbackRecipe(ingredients, preferences);
};

export const generateSmartAlertAdviceWithAI = async (expiringItems) => {
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!expiringItems || expiringItems.length === 0) {
    return {
      urgencyLevel: 'Low',
      summary: 'Your inventory looks healthy! No items are currently in danger of spoiling.',
      tips: [
        'Keep dairy products on middle shelves where temperatures remain most consistent.',
        'Store fruits and vegetables in separate crisper drawers to prevent ethylene gas ripening.',
      ],
      provider: 'ByteBite Intelligence',
    };
  }

  const itemsSummary = expiringItems
    .map((it) => `${it.name} (${it.quantity} ${it.unit}, status: ${it.status}, expires in ${it.daysUntilExpiry} days)`)
    .join('; ');

  const prompt = `You are a culinary preservation expert. Analyze these expiring food items:
${itemsSummary}

Provide a concise waste-prevention summary and 2-3 specific preservation actions (like freezing tricks, quick cures, or salvage techniques).
Return ONLY JSON with this format without markdown code blocks:
{
  "urgencyLevel": "High" | "Moderate" | "Low",
  "summary": "1-2 sentence overall situation summary",
  "tips": [
    "Tip 1...",
    "Tip 2..."
  ]
}`;

  // 1. Try Groq AI
  if (groqKey && groqKey.trim() !== '' && !groqKey.includes('placeholder')) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [
            {
              role: 'system',
              content: 'You are a culinary AI assistant. Always output only valid JSON without markdown fences.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.5,
          max_tokens: 500,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        let content = data.choices[0]?.message?.content || '';
        content = content.replace(/```json/gi, '').replace(/```/g, '').trim();

        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
          content = content.substring(jsonStart, jsonEnd + 1);
        }

        const parsed = JSON.parse(content);
        return {
          ...parsed,
          provider: 'Groq AI (Ultra-fast LLM)',
        };
      }
    } catch (err) {
      console.warn('Groq alert advice error:', err.message);
    }
  }

  // 2. Try Gemini
  if (geminiKey && geminiKey.trim() !== '' && !geminiKey.includes('your_gemini')) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return {
        ...parsed,
        provider: 'Google Gemini AI',
      };
    } catch (error) {
      console.warn('Gemini advice error:', error.message);
    }
  }

  // Fallback heuristics
  const tips = [];
  const names = expiringItems.map((i) => i.name.toLowerCase());
  if (names.some((n) => n.includes('spinach') || n.includes('lettuce') || n.includes('salad'))) {
    tips.push('Leafy Greens: Blend wilted greens into soups or freeze in an airtight bag for morning smoothies.');
  }
  if (names.some((n) => n.includes('banana') || n.includes('fruit') || n.includes('berries'))) {
    tips.push('Fruits: Peel and slice overripe fruit, then flash-freeze on a baking tray before bagging.');
  }
  if (names.some((n) => n.includes('milk') || n.includes('yogurt') || n.includes('cheese'))) {
    tips.push('Dairy: Cook milk into a creamy white sauce or rice pudding; use yogurt as a natural meat marinade.');
  }
  if (tips.length === 0) {
    tips.push('Batch Cook: Combine expiring items into a versatile sheet-pan roast or frittata.');
    tips.push('Freezer Prep: Label and freeze ingredients in portioned reusable containers before expiry.');
  }

  return {
    urgencyLevel: expiringItems.some((i) => i.daysUntilExpiry <= 0) ? 'High' : 'Moderate',
    summary: `You have ${expiringItems.length} item(s) requiring attention to avoid food waste.`,
    tips,
    provider: 'ByteBite Culinary Intelligence',
  };
};
