import { useState, useEffect } from 'react';
import { Utensils, Coffee, Sun, Moon, Sparkles, Clock } from 'lucide-react';

interface MenuItem {
  Date: string;
  Meal_Type: string;
  Item_Name: string;
  Price: string;
}

function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState('');

  const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS8DeSZU_HNJzfbB9PjwaBB1DQbeKdAA7Aeng6jIJbb9coUkaWwyOSBM3j_Bxgp6la5mYkfOawWrp5W/pub?output=csv';

  const parseCSVToJSON = (csv: string): MenuItem[] => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    const data: MenuItem[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length === headers.length) {
        data.push({
          Date: values[0],
          Meal_Type: values[1],
          Item_Name: values[2],
          Price: values[3]
        });
      }
    }
    return data;
  };

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(GOOGLE_SHEETS_CSV_URL);
      if (!response.ok) throw new Error('Failed to fetch menu');

      const csvText = await response.text();
      const data = parseCSVToJSON(csvText);

      const today = new Date().toISOString().split('T')[0];
      const todaysMenu = data.filter(item => item.Date === today);

      setMenuItems(todaysMenu);
      setCurrentDate(new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    } catch (err) {
      setError('Unable to load menu. Please try again later.');
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
    const interval = setInterval(fetchMenuData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const groupByMealType = () => {
    const grouped: Record<string, MenuItem[]> = {};
    menuItems.forEach(item => {
      if (!grouped[item.Meal_Type]) {
        grouped[item.Meal_Type] = [];
      }
      grouped[item.Meal_Type].push(item);
    });
    return grouped;
  };

  const mealTypeOrder = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
  const groupedMenu = groupByMealType();
  const sortedMealTypes = Object.keys(groupedMenu).sort((a, b) => {
    const aIndex = mealTypeOrder.indexOf(a);
    const bIndex = mealTypeOrder.indexOf(b);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  const getMealIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return <Sun className="w-10 h-10" />;
      case 'lunch':
        return <Utensils className="w-10 h-10" />;
      case 'snacks':
        return <Coffee className="w-10 h-10" />;
      case 'dinner':
        return <Moon className="w-10 h-10" />;
      default:
        return <Sparkles className="w-10 h-10" />;
    }
  };

  const getMealGradient = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return 'from-orange-50 to-amber-50';
      case 'lunch':
        return 'from-red-50 to-orange-50';
      case 'snacks':
        return 'from-amber-50 to-yellow-50';
      case 'dinner':
        return 'from-slate-50 to-gray-50';
      default:
        return 'from-pink-50 to-rose-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmYjkyM2MiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLTEuOS0yLTMtMnMtMyAuOS0zIDIgMS45IDIgMyAyIDMtLjkgMy0yem0wIDI4YzAtMS4xLTEuOS0yLTMtMnMtMyAuOS0zIDIgMS45IDIgMyAyIDMtLjkgMy0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

      <header className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white py-10 px-6 shadow-2xl relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-900/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center justify-center gap-5 mb-4">
            <div className="bg-amber-400 p-4 rounded-2xl shadow-xl animate-bounce-slow">
              <Utensils className="w-14 h-14 text-red-900" />
            </div>
            <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent drop-shadow-lg">
              SRM Canteen
            </h1>
          </div>
          <div className="text-center space-y-2">
            <p className="text-3xl text-amber-300 font-bold flex items-center justify-center gap-2">
              <Clock className="w-6 h-6" />
              {currentDate}
            </p>
            <p className="text-xl text-amber-200/90 font-medium">Delicious Meals, Affordable Prices</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-12 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-3xl text-red-800 font-semibold animate-pulse">
                Loading today's menu...
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-3xl text-red-600 font-semibold">{error}</div>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-3xl text-red-800 font-semibold">
                Menu not updated yet.
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {sortedMealTypes.map((mealType, index) => (
                <div
                  key={mealType}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`bg-gradient-to-br ${getMealGradient(mealType)} p-5 rounded-2xl shadow-xl border-2 border-amber-300 text-red-900`}>
                      {getMealIcon(mealType)}
                    </div>
                    <div>
                      <h2 className="text-5xl font-bold bg-gradient-to-r from-red-900 via-red-800 to-red-900 bg-clip-text text-transparent">
                        {mealType}
                      </h2>
                      <div className="h-1.5 w-32 bg-gradient-to-r from-amber-400 to-red-500 rounded-full mt-2"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groupedMenu[mealType].map((item, idx) => (
                      <div
                        key={idx}
                        className="group relative bg-gradient-to-br from-white to-amber-50/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border-2 border-amber-300 hover:border-amber-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-200/20 to-transparent rounded-tr-full -ml-6 -mb-6 transition-transform duration-500 group-hover:scale-150"></div>

                        <div className="relative z-10">
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <h3 className="text-3xl font-bold text-gray-900 flex-1 leading-tight group-hover:text-red-900 transition-colors duration-300">
                              {item.Item_Name}
                            </h3>
                            <div className="bg-gradient-to-br from-red-900 to-red-800 text-white px-5 py-3 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                              <span className="text-3xl font-black">
                                {item.Price}
                              </span>
                            </div>
                          </div>
                          <div className="h-1 w-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 py-6 overflow-hidden border-t-4 border-amber-400 shadow-2xl relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-900/20 to-transparent"></div>
        <div className="ticker-wrapper relative z-10">
          <div className="ticker-content">
            <span className="text-3xl font-bold text-amber-300 drop-shadow-lg">
              Welcome to SRM Canteen! Enjoy your meal • Fresh Food Daily • Quality Service • Affordable Prices • Hygienic Kitchen • Student Friendly •
            </span>
            <span className="text-3xl font-bold text-amber-300 drop-shadow-lg">
              Welcome to SRM Canteen! Enjoy your meal • Fresh Food Daily • Quality Service • Affordable Prices • Hygienic Kitchen • Student Friendly •
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
