
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle, RefreshCw } from 'lucide-react';
import { useDisasterStore } from '@/store/disasterStore';
import { WeatherMapLayer } from '@/components/WeatherMapLayer';
import { weatherService, TyphoonInfo, WeatherStation, WeatherAlert } from '@/services/weatherService';
import { ZoomableMap } from '@/components/ZoomableMap';
import { CollapsibleWeatherPanel } from '@/components/CollapsibleWeatherPanel';

export const DisasterMap = () => {
  const { disasterReports } = useDisasterStore();
  const [typhoons, setTyphoons] = useState<TyphoonInfo[]>([]);
  const [stations, setStations] = useState<WeatherStation[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const [typhoonsData, stationsData, alertsData] = await Promise.all([
        weatherService.getTyphoonInfo(),
        weatherService.getWeatherStations(),
        weatherService.getWeatherAlerts()
      ]);
      setTyphoons(typhoonsData);
      setStations(stationsData);
      setAlerts(alertsData);
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
    { name: '新竹', x: 46, y: 35, isCapital: false },
    { name: '台中', x: 45, y: 45, isCapital: false },
    { name: '彰化', x: 44, y: 50, isCapital: false },
    { name: '雲林', x: 43, y: 55, isCapital: false },
    { name: '嘉義', x: 42, y: 60, isCapital: false },
    { name: '台南', x: 42, y: 70, isCapital: false },
    { name: '高雄', x: 45, y: 80, isCapital: false },
    { name: '屏東', x: 46, y: 85, isCapital: false },
    { name: '宜蘭', x: 58, y: 30, isCapital: false },
    { name: '花蓮', x: 65, y: 50, isCapital: false },
    { name: '台東', x: 62, y: 75, isCapital: false },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <MapPin className="w-6 h-6" />
              台灣災情與天氣整合地圖
            </CardTitle>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={loadWeatherData}
              disabled={loading}
              className="flex items-center gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              重新整理
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* 可縮放的台灣地圖 */}
          <ZoomableMap className="h-[600px]">
            <div className="bg-gradient-to-br from-sky-200 via-blue-100 to-emerald-100 rounded-lg h-full relative overflow-hidden">
              {/* 台灣島嶼輪廓 - 更精緻的設計 */}
              <div className="absolute inset-0">
                {/* 台灣本島 - 更精細的形狀 */}
                <div 
                  className="absolute bg-gradient-to-br from-emerald-200 to-green-300 opacity-90 shadow-2xl"
                  style={{
                    left: '35%',
                    top: '20%',
                    width: '30%',
                    height: '65%',
                    clipPath: 'polygon(20% 0%, 80% 5%, 95% 25%, 90% 35%, 85% 45%, 90% 65%, 85% 75%, 75% 85%, 60% 95%, 50% 92%, 40% 90%, 30% 85%, 25% 80%, 20% 70%, 15% 60%, 10% 45%, 8% 35%, 5% 20%, 10% 10%)',
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))',
                    border: '2px solid rgba(34, 197, 94, 0.3)'
                  }}
                >
                  {/* 台灣標示 */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="text-emerald-800 font-bold text-lg text-center drop-shadow-sm">
                      TAIWAN
                    </div>
                    <div className="text-emerald-700 text-sm text-center font-medium">
                      台灣
                    </div>
                  </div>
                </div>

                {/* 離島群 - 更精緻的設計 */}
                {/* 澎湖群島 */}
                <div 
                  className="absolute w-4 h-4 bg-gradient-to-br from-emerald-200 to-green-300 rounded-full shadow-lg border-2 border-emerald-300"
                  style={{ left: '25%', top: '55%' }}
                  title="澎湖群島"
                >
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-emerald-700">
                    澎湖
                  </div>
                </div>

                {/* 金門 */}
                <div 
                  className="absolute w-3 h-3 bg-gradient-to-br from-emerald-200 to-green-300 rounded-full shadow-lg border border-emerald-300"
                  style={{ left: '15%', top: '60%' }}
                  title="金門"
                >
                  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-emerald-700">
                    金門
                  </div>
                </div>

                {/* 馬祖 */}
                <div 
                  className="absolute w-2 h-2 bg-gradient-to-br from-emerald-200 to-green-300 rounded-full shadow-lg border border-emerald-300"
                  style={{ left: '18%', top: '35%' }}
                  title="馬祖"
                >
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs font-medium text-emerald-700">
                    馬祖
                  </div>
                </div>

                {/* 主要城市標示 - 更精緻的設計 */}
                {taiwanCities.map((city) => (
                  <div
                    key={city.name}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                    style={{
                      left: `${city.x}%`,
                      top: `${city.y}%`,
                    }}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-125 ${
                      city.isCapital 
                        ? 'bg-gradient-to-br from-red-400 to-red-600' 
                        : 'bg-gradient-to-br from-blue-400 to-blue-600'
                    }`} />
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-800 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm transition-all duration-200 group-hover:bg-white group-hover:scale-105">
                      {city.name}
                    </div>
                  </div>
                ))}

                {/* 周邊海域標示 - 更美觀的設計 */}
                <div className="absolute top-6 left-6 text-blue-700 text-sm font-semibold bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-md">
                  台灣海峽
                </div>
                <div className="absolute top-6 right-16 text-blue-700 text-sm font-semibold bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-md">
                  太平洋
                </div>
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-blue-700 text-sm font-semibold bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-md">
                  巴士海峽
                </div>
                <div className="absolute top-1/3 left-8 text-blue-700 text-sm font-semibold bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-md rotate-90">
                  東海
                </div>

                {/* 精緻的指南針 */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-gray-200">
                  <div className="text-center text-xs font-bold text-gray-700 mb-1">北</div>
                  <div className="w-8 h-8 border-2 border-gray-300 rounded-full relative bg-gradient-to-br from-white to-gray-50">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-6 border-transparent border-b-red-500"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-400"></div>
                  </div>
                </div>
              </div>
              
              {/* 災情點位 - 更醒目的設計 */}
              {disasterReports.slice(0, 10).map((report, index) => (
                <div
                  key={report.id}
                  className={`absolute w-6 h-6 rounded-full ${getStatusColor(report.status)} border-3 border-white shadow-xl z-30 cursor-pointer hover:scale-125 transition-all duration-200 animate-pulse`}
                  style={{
                    left: `${35 + (index % 5) * 6}%`,
                    top: `${30 + Math.floor(index / 5) * 12}%`,
                  }}
                  title={`${report.type} - ${report.address} (${getStatusText(report.status)})`}
                >
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white opacity-80 animate-ping"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AlertTriangle className="w-3 h-3 text-white" />
                  </div>
                </div>
              ))}

              {/* 天氣圖層 */}
              <WeatherMapLayer
                typhoons={typhoons}
                stations={stations}
                mapWidth={800}
                mapHeight={600}
                showWeather={true}
              />
            </div>
          </ZoomableMap>
        </CardContent>
      </Card>

      {/* 可收合的天氣資訊面板 */}
      <CollapsibleWeatherPanel
        typhoons={typhoons}
        stations={stations}
        alerts={alerts}
      />

      {/* 增強版圖例 */}
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                災情狀態
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div>
                  <span className="text-sm text-gray-700">待救援</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-orange-500 shadow-sm"></div>
                  <span className="text-sm text-gray-700">救援中</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                  <span className="text-sm text-gray-700">已完成</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                地區標示
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-sm"></div>
                  <span className="text-sm text-gray-700">直轄市</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm"></div>
                  <span className="text-sm text-gray-700">縣市</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-br from-emerald-200 to-green-300 border border-emerald-300 rounded shadow-sm"></div>
                  <span className="text-sm text-gray-700">台灣本島</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">統計摘要</h4>
              <div className="text-sm space-y-1 text-gray-600">
                <div>災情通報: {disasterReports.length} 件</div>
                <div>活躍颱風: {typhoons.length} 個</div>
                <div>觀測站: {stations.length} 個</div>
                <div>天氣警報: {alerts.length} 個</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">操作說明</h4>
              <div className="text-sm space-y-1 text-gray-600">
                <div>• 滾輪縮放地圖</div>
                <div>• 拖拽移動視角</div>
                <div>• 點擊查看詳情</div>
                <div>• 右上角天氣面板</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 最新災情動態 */}
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <AlertTriangle className="w-5 h-5" />
            最新災情動態
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {disasterReports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border border-gray-200 hover:border-blue-200">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(report.status)} shadow-sm`}></div>
                  <div>
                    <div className="font-medium text-gray-800">{report.address}</div>
                    <div className="text-sm text-gray-600">{report.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">{getStatusText(report.status)}</Badge>
                  <div className="text-xs text-gray-500">
                    {new Date(report.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
