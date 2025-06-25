
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
          {/* 精確天氣資訊地圖 */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-[500px] relative mb-6 overflow-hidden border-2 border-blue-200">
            {/* 台灣輪廓背景 */}
            <div className="absolute inset-4 bg-gradient-to-se from-green-100 to-blue-100 rounded-lg opacity-60">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">台灣災情監控中心</p>
                  <p className="text-sm">即時災情・天氣預警・精準救援</p>
                </div>
              </div>
            </div>
            
            {/* 災情點位 */}
            {disasterReports.slice(0, 8).map((report, index) => (
              <div
                key={report.id}
                className={`absolute w-5 h-5 rounded-full ${getStatusColor(report.status)} border-2 border-white shadow-lg z-30 cursor-pointer hover:scale-110 transition-transform`}
                style={{
                  left: `${15 + (index % 4) * 20}%`,
                  top: `${25 + Math.floor(index / 4) * 25}%`,
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
                  <h4 className="font-semibold text-sm text-gray-700">天氣警戒</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <span className="text-sm">嚴重</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                      <span className="text-sm">中度</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">輕度</span>
                    </div>
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
