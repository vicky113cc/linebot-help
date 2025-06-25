
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle, Cloud, Wind, RefreshCw } from 'lucide-react';
import { useDisasterStore } from '@/store/disasterStore';
import { WeatherOverlay } from '@/components/WeatherOverlay';
import { WeatherMapLayer } from '@/components/WeatherMapLayer';
import { weatherService, TyphoonInfo, WeatherStation } from '@/services/weatherService';

export const DisasterMap = () => {
  const { disasterReports } = useDisasterStore();
  const [showWeather, setShowWeather] = useState(false);
  const [typhoons, setTyphoons] = useState<TyphoonInfo[]>([]);
  const [stations, setStations] = useState<WeatherStation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const [typhoonsData, stationsData] = await Promise.all([
        weatherService.getTyphoonInfo(),
        weatherService.getWeatherStations()
      ]);
      setTyphoons(typhoonsData);
      setStations(stationsData);
    } catch (error) {
      console.error('Failed to load weather data for map:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-500';
      case 'in-progress': return 'bg-orange-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待救援';
      case 'in-progress': return '救援中';
      case 'completed': return '已完成';
      default: return '未知';
    }
  };

  // 台灣主要城市位置 (相對位置)
  const taiwanCities = [
    { name: '台北', x: 52, y: 25, isCapital: true },
    { name: '新北', x: 50, y: 28, isCapital: false },
    { name: '桃園', x: 48, y: 32, isCapital: false },
    { name: '台中', x: 45, y: 45, isCapital: false },
    { name: '台南', x: 42, y: 70, isCapital: false },
    { name: '高雄', x: 45, y: 80, isCapital: false },
    { name: '花蓮', x: 65, y: 50, isCapital: false },
    { name: '台東', x: 62, y: 75, isCapital: false },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <MapPin className="w-6 h-6" />
              災情與天氣整合地圖
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadWeatherData}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                重新整理
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowWeather(!showWeather)}
                className="flex items-center gap-2"
              >
                <Cloud className="w-4 h-4" />
                {showWeather ? '隱藏' : '顯示'}天氣
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 台灣地圖 */}
          <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-[500px] relative mb-6 overflow-hidden border-2 border-blue-200">
            {/* 台灣島嶼輪廓 */}
            <div className="absolute inset-0">
              {/* 台灣本島 */}
              <div 
                className="absolute bg-green-200 opacity-80 border-2 border-green-300 shadow-lg"
                style={{
                  left: '35%',
                  top: '20%',
                  width: '30%',
                  height: '65%',
                  clipPath: 'polygon(20% 0%, 80% 5%, 95% 25%, 85% 45%, 90% 65%, 75% 85%, 60% 95%, 40% 90%, 25% 80%, 15% 60%, 10% 40%, 5% 20%)',
                }}
              >
                {/* 台灣標示 */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="text-green-800 font-bold text-lg text-center">
                    台灣
                  </div>
                </div>
              </div>

              {/* 澎湖群島 */}
              <div 
                className="absolute w-3 h-3 bg-green-200 rounded-full border border-green-300"
                style={{ left: '25%', top: '55%' }}
                title="澎湖"
              />

              {/* 金門 */}
              <div 
                className="absolute w-2 h-2 bg-green-200 rounded-full border border-green-300"
                style={{ left: '15%', top: '60%' }}
                title="金門"
              />

              {/* 主要城市標示 */}
              {taiwanCities.map((city) => (
                <div
                  key={city.name}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${city.x}%`,
                    top: `${city.y}%`,
                  }}
                >
                  <div className={`w-3 h-3 rounded-full border-2 border-white shadow-lg ${
                    city.isCapital ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 bg-white/80 px-1 rounded">
                    {city.name}
                  </div>
                </div>
              ))}

              {/* 周邊海域標示 */}
              <div className="absolute top-2 left-2 text-blue-600 text-sm font-medium">
                台灣海峽
              </div>
              <div className="absolute top-2 right-12 text-blue-600 text-sm font-medium">
                太平洋
              </div>
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-blue-600 text-sm font-medium">
                巴士海峽
              </div>

              {/* 方位指標 */}
              <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-2 shadow-lg">
                <div className="text-center text-xs font-bold">N</div>
                <div className="w-6 h-6 border-2 border-gray-400 rounded-full relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-red-500"></div>
                </div>
              </div>
            </div>
            
            {/* 災情點位 */}
            {disasterReports.slice(0, 8).map((report, index) => (
              <div
                key={report.id}
                className={`absolute w-5 h-5 rounded-full ${getStatusColor(report.status)} border-2 border-white shadow-lg z-30 cursor-pointer hover:scale-110 transition-transform`}
                style={{
                  left: `${35 + (index % 4) * 8}%`,
                  top: `${30 + Math.floor(index / 4) * 15}%`,
                }}
                title={`${report.type} - ${report.address} (${getStatusText(report.status)})`}
              >
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white opacity-80 animate-ping"></div>
              </div>
            ))}

            {/* 天氣圖層 */}
            <WeatherMapLayer
              typhoons={typhoons}
              stations={stations}
              mapWidth={800}
              mapHeight={500}
              showWeather={showWeather}
            />
          </div>

          {/* 增強版圖例 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">災情狀態</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm">待救援</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span className="text-sm">救援中</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm">已完成</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">地圖圖例</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm">直轄市</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="text-sm">縣市</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 border border-green-300"></div>
                  <span className="text-sm">台灣本島</span>
                </div>
              </div>
            </div>
            
            {showWeather && (
              <>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700">颱風資訊</h4>
                  <div className="space-y-1">
                    {typhoons.map((typhoon) => (
                      <div key={typhoon.id} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-600"></div>
                        <span className="text-sm">{typhoon.name} ({typhoon.level}級)</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700">觀測統計</h4>
                  <div className="text-sm space-y-1">
                    <div>測站: {stations.length} 個</div>
                    <div>颱風: {typhoons.length} 個</div>
                    <div>最高溫: {Math.max(...stations.map(s => s.temperature))}°C</div>
                    <div>最大風速: {Math.max(...stations.map(s => s.windSpeed))} km/h</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 天氣資訊浮動視窗 */}
      <WeatherOverlay 
        isVisible={showWeather} 
        onToggle={() => setShowWeather(!showWeather)} 
      />

      {/* 最新災情動態 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            最新災情動態
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {disasterReports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`}></div>
                  <div>
                    <div className="font-medium">{report.address}</div>
                    <div className="text-sm text-gray-600">{report.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{getStatusText(report.status)}</Badge>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(report.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 天氣警報摘要 */}
      {showWeather && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Wind className="w-5 h-5" />
              天氣警報與建議
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-yellow-800 space-y-2">
              {typhoons.length > 0 && (
                <div className="flex items-center gap-2">
                  <span>🌀</span>
                  <span>目前有 {typhoons.length} 個颱風系統影響台灣地區，請特別注意強風豪雨</span>
                </div>
              )}
              
              {stations.some(s => s.rainfall > 10) && (
                <div className="flex items-center gap-2">
                  <span>🌧️</span>
                  <span>部分地區有強降雨，山區請注意土石流風險</span>
                </div>
              )}
              
              {stations.some(s => s.windSpeed > 25) && (
                <div className="flex items-center gap-2">
                  <span>💨</span>
                  <span>強風地區請避免戶外作業，確保救援人員安全</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <span>💡</span>
                <span>建議在執行救援任務時，優先考慮天氣狀況良好的區域</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
