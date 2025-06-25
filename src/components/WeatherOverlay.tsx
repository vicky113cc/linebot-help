
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Cloud, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets,
  AlertTriangle,
  Eye,
  Gauge
} from 'lucide-react';
import { weatherService, WeatherAlert, TyphoonInfo, WeatherStation } from '@/services/weatherService';

interface WeatherOverlayProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const WeatherOverlay = ({ isVisible, onToggle }: WeatherOverlayProps) => {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [typhoons, setTyphoons] = useState<TyphoonInfo[]>([]);
  const [stations, setStations] = useState<WeatherStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadWeatherData();
    const interval = setInterval(loadWeatherData, 5 * 60 * 1000); // 每5分鐘更新
    return () => clearInterval(interval);
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const [alertsData, typhoonsData, stationsData] = await Promise.all([
        weatherService.getWeatherAlerts(),
        weatherService.getTyphoonInfo(),
        weatherService.getWeatherStations()
      ]);
      
      setAlerts(alertsData);
      setTyphoons(typhoonsData);
      setStations(stationsData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700"
        size="sm"
      >
        <Cloud className="w-4 h-4 mr-2" />
        天氣資訊
      </Button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-h-[80vh] overflow-y-auto space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">即時天氣資訊</h3>
        <Button onClick={onToggle} variant="ghost" size="sm" className="text-white hover:bg-white/20">
          ✕
        </Button>
      </div>

      {/* 颱風資訊 */}
      {typhoons.length > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-700 flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4" />
              颱風資訊
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {typhoons.map((typhoon) => (
              <div key={typhoon.id} className="p-2 bg-white rounded border">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{typhoon.name} ({typhoon.nameEn})</span>
                  <Badge className={weatherService.getTyphoonLevelColor(typhoon.level)}>
                    {typhoon.level}級
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>位置: {typhoon.position.lat}°N, {typhoon.position.lng}°E</div>
                  <div>最大風速: {typhoon.maxWind} km/h</div>
                  <div>中心氣壓: {typhoon.pressure} hPa</div>
                  <div>移動: {typhoon.movement.direction} {typhoon.movement.speed} km/h</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 天氣警報 */}
      {alerts.length > 0 && (
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-orange-700 flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4" />
              天氣警報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-2 bg-white rounded border">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{alert.title}</span>
                  <Badge className={weatherService.getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 mb-1">{alert.description}</div>
                <div className="text-xs text-gray-500">
                  影響區域: {alert.areas.join(', ')}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 氣象站資料 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-blue-700 flex items-center gap-2 text-sm">
            <Gauge className="w-4 h-4" />
            氣象觀測
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {stations.slice(0, 3).map((station) => (
            <div key={station.id} className="p-2 bg-white rounded border">
              <div className="font-medium text-sm mb-1">{station.name}</div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3" />
                  {station.temperature}°C
                </div>
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3" />
                  {station.humidity}%
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-3 h-3" />
                  {station.windSpeed}km/h
                </div>
                <div className="flex items-center gap-1">
                  <CloudRain className="w-3 h-3" />
                  {station.rainfall}mm
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 更新時間 */}
      <div className="text-xs text-white/80 text-center">
        最後更新: {lastUpdate.toLocaleTimeString()}
        {loading && <span className="ml-2">更新中...</span>}
      </div>

      <Button 
        onClick={loadWeatherData} 
        size="sm" 
        className="w-full bg-white/20 hover:bg-white/30 text-white"
        disabled={loading}
      >
        重新整理
      </Button>
    </div>
  );
};
