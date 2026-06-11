import { useState } from 'react';
import { Map, Clock, Filter, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { mockAreas } from '../data/mockData';

type AreaType = 'all' | 'available' | 'restricted' | 'forbidden';

export default function MapPage() {
  const [selectedType, setSelectedType] = useState<AreaType>('all');
  const [selectedArea, setSelectedArea] = useState(mockAreas[0]);
  const [timeFilter, setTimeFilter] = useState('all');

  const filteredAreas = mockAreas.filter((area) => {
    const typeMatch = selectedType === 'all' || area.type === selectedType;
    return typeMatch;
  });

  const getStatusConfig = (type: string) => {
    switch (type) {
      case 'available':
        return {
          icon: CheckCircle,
          bgColor: 'bg-success-100',
          textColor: 'text-success-600',
          borderColor: 'border-success-200',
          fillColor: '#059669',
          statusText: '可申请',
        };
      case 'restricted':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-warning-100',
          textColor: 'text-warning-600',
          borderColor: 'border-warning-200',
          fillColor: '#D97706',
          statusText: '限制',
        };
      case 'forbidden':
        return {
          icon: XCircle,
          bgColor: 'bg-danger-100',
          textColor: 'text-danger-600',
          borderColor: 'border-danger-200',
          fillColor: '#DC2626',
          statusText: '禁飞',
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-200',
          fillColor: '#6B7280',
          statusText: '未知',
        };
    }
  };

  const timeOptions = [
    { value: 'all', label: '全部时段' },
    { value: 'workday', label: '工作日' },
    { value: 'weekend', label: '周末' },
    { value: 'morning', label: '上午' },
    { value: 'afternoon', label: '下午' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">空域地图查询</h1>
          <p className="text-gray-600">查看可申请、限制、禁飞区域分布及适用时间</p>
        </div>

        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">区域类型：</span>
              <div className="flex space-x-2">
                {[
                  { value: 'all', label: '全部' },
                  { value: 'available', label: '可申请' },
                  { value: 'restricted', label: '限制' },
                  { value: 'forbidden', label: '禁飞' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setSelectedType(item.value as AreaType)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedType === item.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="input-field"
              >
                {timeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card h-[500px] bg-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 p-8">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">地图展示区域</p>
                    <p className="text-gray-400 text-sm mt-2">点击右侧区域卡片查看详情</p>
                  </div>
                </div>
                
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400">
                  {filteredAreas.map((area, index) => {
                    const config = getStatusConfig(area.type);
                    const x = (index % 3) * 180 + 40;
                    const y = Math.floor(index / 3) * 120 + 40;
                    return (
                      <g
                        key={area.id}
                        onClick={() => setSelectedArea(area)}
                        className="cursor-pointer"
                      >
                        <rect
                          x={x}
                          y={y}
                          width={140}
                          height={80}
                          fill={config.fillColor}
                          fillOpacity="0.3"
                          stroke={config.fillColor}
                          strokeWidth="2"
                          rx="8"
                          className="transition-all hover:fill-opacity-0.5"
                        />
                        <text
                          x={x + 70}
                          y={y + 40}
                          textAnchor="middle"
                          fill={config.fillColor}
                          fontSize="14"
                          fontWeight="600"
                        >
                          {area.name}
                        </text>
                        <text
                          x={x + 70}
                          y={y + 60}
                          textAnchor="middle"
                          fill="gray"
                          fontSize="12"
                        >
                          {area.applicableTime}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="absolute bottom-4 right-4 flex space-x-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                {[
                  { type: 'available', label: '可申请区域' },
                  { type: 'restricted', label: '限制区域' },
                  { type: 'forbidden', label: '禁飞区域' },
                ].map((item) => {
                  const config = getStatusConfig(item.type);
                  return (
                    <div key={item.type} className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: config.fillColor }}
                      />
                      <span className="text-sm text-gray-600">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">区域列表</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredAreas.map((area) => {
                  const config = getStatusConfig(area.type);
                  const Icon = config.icon;
                  return (
                    <div
                      key={area.id}
                      onClick={() => setSelectedArea(area)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedArea?.id === area.id
                          ? `${config.borderColor} ${config.bgColor}`
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{area.name}</h4>
                        <div className={`flex items-center space-x-1 ${config.textColor}`}>
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{config.statusText}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{area.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {area.applicableTime}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {selectedArea && (
          <div className="card mt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{selectedArea.name}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  {(() => {
                    const config = getStatusConfig(selectedArea.type);
                    const Icon = config.icon;
                    return (
                      <span className={`badge flex items-center space-x-1 ${config.bgColor} ${config.textColor}`}>
                        <Icon className="w-4 h-4" />
                        <span>{config.statusText}</span>
                      </span>
                    );
                  })()}
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div>适用时间</div>
                <div className="font-medium text-gray-700">{selectedArea.applicableTime}</div>
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-800 mb-2">区域描述</h4>
              <p className="text-gray-600">{selectedArea.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
