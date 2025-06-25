
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle, Cloud, Eye, Wind } from 'lucide-react';
import { useDisasterStore } from '@/store/disasterStore';
import { WeatherOverlay } from '@/components/WeatherOverlay';
import { weatherService, TyphoonInfo, WeatherStation } from '@/services/weatherService';

export const DisasterMap = () => {
  const { disasterReports } = useDisasterStore();
  const [showWeather, setShowWeather] = useState(false);
  const [typhoons, setTyphoons] = useState<TyphoonInfo[]>([]);
  const [stations, setStations] = useState<WeatherStation[]>([]);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      const [typhoonsData, stationsData] = await Promise.all([
        weatherService.getTyphoonInfo(),
        weatherService.getWeatherStations()
      ]);
      setTyphoons(typhoonsData);
      setStations(stationsData);
    } catch (error) {
      console.error('Failed to load weather data for map:', error);
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

  const getWeatherIconColor = (temperature: number, rainfall: number, windSpeed: number) => {
    if (rainfall > 5) return 'text-blue-600';
    if (windSpeed > 20) return 'text-purple-600';
    if (temperature > 30) return 'text-red-500';
    if (temperature < 15) return 'text-blue-400';
    return 'text-green-500';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <MapPin className="w-6 h-6" />
              災情地圖總覽
            </CardTitle>
            <div className="flex gap-2">
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
          {/* 整合天氣資訊的地圖區域 */}
          <div className="bg-gray-100 rounded-lg h-96 relative mb-6 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-medium">災情與天氣整合地圖</p>
                <p className="text-sm">顯示災情點位置與即時天氣資訊</p>
              </div>
            </div>
            
            {/* 災情點 */}
            {disasterReports.slice(0, 5).map((report, index) => (
              <div
                key={report.id}
                className={`absolute w-4 h-4 rounded-full ${getStatusColor(report.status)} border-2 border-white shadow-lg z-20`}
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 10}%`,
                }}
                title={`${report.type} - ${report.address}`}
              />
            ))}

            {/* 颱風位置 */}
            {showWeather && typhoons.map((typhoon, index) => (
              <div
                key={typhoon.id}
                className="absolute flex items-center justify-center w-8 h-8 z-30"
                style={{
                  left: `${60 + index * 10}%`,
                  top: `${20 + index * 5}%`,
                }}
                title={`颱風 ${typhoon.name} - 風速 ${typhoon.maxWind}km/h`}
              >
                <Eye className="w-6 h-6 text-red-600 animate-pulse" />
                <div className={`absolute w-12 h-12 rounded-full border-2 border-red-500 opacity-50 ${weatherService.getTyphoonLevelColor(typhoon.level)}`}></div>
              </div>
            ))}

            {/* 氣象站 */}
            {showWeather && stations.map((station, index) => (
              <div
                key={station.id}
                className="absolute flex items-center justify-center w-6 h-6 z-25"
                style={{
                  left: `${15 + index * 25}%`,
                  top: `${60 + index * 8}%`,
                }}
                title={`${station.name} - ${station.temperature}°C, 風速${station.windSpeed}km/h`}
              >
                <Cloud 
                  className={`w-4 h-4 ${getWeatherIconColor(station.temperature, station.rainfall, station.windSpeed)}`} 
                />
              </div>
            ))}
          </div>

          {/* 圖例 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
            {showWeather && (
              <>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-red-600" />
                  <span className="text-sm">颱風</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">氣象站</span>
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
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
              天氣注意事項
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-yellow-800">
              {typhoons.length > 0 && (
                <div className="mb-2">
                  🌀 目前有 {typhoons.length} 個颱風系統影響台灣地區
                </div>
              )}
              <div>
                💡 建議在執行救援任務時，特別注意當地天氣狀況，確保救援人員安全
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
