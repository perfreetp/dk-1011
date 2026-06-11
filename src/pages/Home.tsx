import { useState } from 'react';
import { Search, Map, BookOpen, ClipboardList, MessageCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockAnnouncements, mockQuickEntries, mockAreas } from '../data/mockData';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(mockAreas);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = mockAreas.filter(
        (area) =>
          area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          area.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults(mockAreas);
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'available':
        return 'bg-success-100 text-success-600';
      case 'restricted':
        return 'bg-warning-100 text-warning-600';
      case 'forbidden':
        return 'bg-danger-100 text-danger-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (type: string) => {
    switch (type) {
      case 'available':
        return '可申请';
      case 'restricted':
        return '限制';
      case 'forbidden':
        return '禁飞';
      default:
        return type;
    }
  };

  const iconMap: Record<string, typeof Map> = {
    map: Map,
    'book-open': BookOpen,
    'clipboard-list': ClipboardList,
    'message-circle': MessageCircle,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">空域审批公众查询系统</h1>
            <p className="text-primary-100 text-lg">园区企业和飞行服务商的一站式空域服务平台</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索可申请区域、查看空域信息..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <button
                onClick={handleSearch}
                className="absolute inset-y-0 right-0 px-6 bg-primary-700 hover:bg-primary-800 rounded-r-xl transition-colors"
              >
                查询
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="w-5 h-5 text-warning-500" />
            <h2 className="text-lg font-semibold text-gray-800">最新公告</h2>
          </div>
          <div className="overflow-hidden">
            <div className="flex animate-marquee">
              {mockAnnouncements.map((announcement) => (
                <div key={announcement.id} className="flex items-center space-x-4 px-4">
                  <span className="text-primary-600 font-medium">{announcement.title}</span>
                  <span className="text-gray-500">{announcement.content}</span>
                  <span className="text-gray-400 text-sm">{announcement.date}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-800 mb-8 text-center">快捷入口</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockQuickEntries.map((entry) => {
              const Icon = iconMap[entry.icon] || Map;
              return (
                <div
                  key={entry.id}
                  onClick={() => navigate(entry.path)}
                  className="card cursor-pointer hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                        {entry.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{entry.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-800 mb-8 text-center">热门区域</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((area) => (
              <div
                key={area.id}
                onClick={() => navigate('/map')}
                className="card cursor-pointer hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800">{area.name}</h3>
                  <span className={`badge ${getStatusColor(area.type)}`}>
                    {getStatusText(area.type)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{area.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Map className="w-4 h-4 mr-2" />
                  <span>{area.applicableTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
