import { useState, useEffect } from 'react';
import { MessageCircle, Send, Download, Clock, CheckCircle, ChevronDown, ChevronUp, FileText, Trash2, FileDown } from 'lucide-react';
import { mockTemplates } from '../data/mockData';
import type { Consultation } from '../types';

const STORAGE_KEY = 'consultations';

export default function ConsultPage() {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  const categories = [
    { value: 'policy', label: '政策咨询' },
    { value: 'material', label: '材料咨询' },
    { value: 'time', label: '时间咨询' },
    { value: 'other', label: '其他问题' },
  ];

  useEffect(() => {
    const savedConsultations = localStorage.getItem(STORAGE_KEY);
    if (savedConsultations) {
      setConsultations(JSON.parse(savedConsultations));
    }
  }, []);

  const getCategoryLabel = (value: string) => {
    const cat = categories.find((c) => c.value === value);
    return cat?.label || value;
  };

  const handleSubmit = () => {
    if (!question.trim() || !category) {
      return;
    }

    const newConsultation: Consultation = {
      id: Date.now().toString(),
      question,
      category: getCategoryLabel(category),
      submitTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(/\//g, '-'),
      status: 'pending',
    };

    const updatedConsultations = [newConsultation, ...consultations];
    setConsultations(updatedConsultations);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConsultations));
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setQuestion('');
      setCategory('');
    }, 3000);
  };

  const handleDownload = (template: typeof mockTemplates[0]) => {
    const link = document.createElement('a');
    link.href = template.url;
    link.download = template.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearHistory = () => {
    if (window.confirm('确定要清空所有历史咨询记录吗？此操作不可恢复。')) {
      setConsultations([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleExportRecords = () => {
    if (consultations.length === 0) {
      alert('暂无咨询记录可导出');
      return;
    }
    const exportData = {
      exportTime: new Date().toLocaleString('zh-CN'),
      totalRecords: consultations.length,
      records: consultations,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `consultations_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'replied':
        return {
          label: '已回复',
          bgColor: 'bg-success-100',
          textColor: 'text-success-600',
          icon: CheckCircle,
        };
      default:
        return {
          label: '待回复',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          icon: Clock,
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">在线咨询</h1>
          <p className="text-gray-600">提交问题获取专业解答，或下载申请模板</p>
        </div>

        <div className="card mb-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-primary-600" />
            <span>提交咨询</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">咨询类别</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                <option value="">请选择咨询类别</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">问题描述</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="请详细描述您的问题..."
                rows={4}
                className="input-field resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!question.trim() || !category || submitted}
              className={`btn-primary flex items-center justify-center space-x-2 w-full ${
                (!question.trim() || !category || submitted)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {submitted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>提交成功</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>提交咨询</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="card mb-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Download className="w-5 h-5 text-primary-600" />
            <span>下载模板</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTemplates.map((template, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-primary-600" />
                  <div>
                    <div className="font-medium text-gray-800">{template.name}</div>
                    <div className="text-sm text-gray-500">{template.size}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(template)}
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>下载</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-primary-600" />
              <span>历史咨询</span>
              {consultations.length > 0 && (
                <span className="text-sm text-gray-500 font-normal">({consultations.length}条)</span>
              )}
            </h3>
            {consultations.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportRecords}
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <FileDown className="w-4 h-4" />
                  <span>导出记录</span>
                </button>
                <button
                  onClick={handleClearHistory}
                  className="text-sm text-danger-600 hover:text-danger-700 flex items-center space-x-1 px-3 py-1.5 border border-danger-200 rounded-lg hover:bg-danger-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>清空记录</span>
                </button>
              </div>
            )}
          </div>

          {consultations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>暂无咨询记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {consultations.map((consult) => {
                const config = getStatusConfig(consult.status);
                const Icon = config.icon;
                return (
                  <div
                    key={consult.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                      onClick={() =>
                        setExpandedId(expandedId === consult.id ? null : consult.id)
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                          <Icon className={`w-5 h-5 ${config.textColor.replace('bg-', 'text-')}`} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{consult.question}</div>
                          <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                            <span>{consult.category}</span>
                            <span>{consult.submitTime}</span>
                          </div>
                        </div>
                      </div>
                      {expandedId === consult.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {expandedId === consult.id && consult.reply && (
                      <div className="p-4 bg-gray-50 border-t">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-success-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              {consult.replyTime && `回复时间：${consult.replyTime}`}
                            </div>
                            <div className="text-gray-700">{consult.reply}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
