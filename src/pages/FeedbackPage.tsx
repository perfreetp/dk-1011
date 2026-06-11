import { useState, useEffect } from 'react';
import { Star, Send, MapPin, AlertCircle, CheckCircle, ThumbsUp, ThumbsDown, Image, ChevronDown, Clock, Trash2, FileDown } from 'lucide-react';
import { mockAreas } from '../data/mockData';
import type { ErrorReport, Feedback } from '../types';

const ERROR_REPORTS_KEY = 'errorReports';
const LAST_FEEDBACK_KEY = 'lastFeedback';

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errorType, setErrorType] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorSubmitted, setErrorSubmitted] = useState(false);
  const [selectedArea, setSelectedArea] = useState('');
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [errorReports, setErrorReports] = useState<ErrorReport[]>([]);
  const [lastFeedback, setLastFeedback] = useState<Feedback | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const errorTypes = [
    { value: 'area', label: '区域信息错误' },
    { value: 'time', label: '时间信息错误' },
    { value: 'rule', label: '规则信息错误' },
    { value: 'other', label: '其他错误' },
  ];

  useEffect(() => {
    const savedReports = localStorage.getItem(ERROR_REPORTS_KEY);
    if (savedReports) {
      setErrorReports(JSON.parse(savedReports));
    }

    const savedFeedback = localStorage.getItem(LAST_FEEDBACK_KEY);
    if (savedFeedback) {
      setLastFeedback(JSON.parse(savedFeedback));
    }
  }, []);

  const handleSubmitFeedback = () => {
    if (rating === 0 || !comment.trim()) {
      return;
    }

    const feedback: Feedback = {
      id: Date.now().toString(),
      rating,
      comment,
      submitTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(/\//g, '-'),
    };

    localStorage.setItem(LAST_FEEDBACK_KEY, JSON.stringify(feedback));
    setLastFeedback(feedback);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setComment('');
    }, 3000);
  };

  const handleSubmitError = () => {
    if (!errorType || !errorDetails.trim()) {
      return;
    }

    const area = mockAreas.find((a) => a.id === selectedArea);
    const report: ErrorReport = {
      id: Date.now().toString(),
      errorType,
      errorDetails,
      areaId: selectedArea || undefined,
      areaName: area?.name || undefined,
      submitTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(/\//g, '-'),
      status: 'pending',
    };

    const newReports = [report, ...errorReports];
    setErrorReports(newReports);
    localStorage.setItem(ERROR_REPORTS_KEY, JSON.stringify(newReports));
    setErrorSubmitted(true);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setErrorSubmitted(false);
      setErrorType('');
      setErrorDetails('');
      setSelectedArea('');
    }, 3000);
  };

  const handleClearErrorReports = () => {
    if (window.confirm('确定要清空所有错误上报记录吗？此操作不可恢复。')) {
      setErrorReports([]);
      localStorage.removeItem(ERROR_REPORTS_KEY);
    }
  };

  const handleExportErrorReports = () => {
    if (errorReports.length === 0) {
      alert('暂无错误上报记录可导出');
      return;
    }
    const exportData = {
      exportTime: new Date().toLocaleString('zh-CN'),
      totalRecords: errorReports.length,
      records: errorReports,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error_reports_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearFeedback = () => {
    if (window.confirm('确定要清空最近评价记录吗？此操作不可恢复。')) {
      setLastFeedback(null);
      localStorage.removeItem(LAST_FEEDBACK_KEY);
    }
  };

  const handleExportFeedback = () => {
    if (!lastFeedback) {
      alert('暂无评价记录可导出');
      return;
    }
    const exportData = {
      exportTime: new Date().toLocaleString('zh-CN'),
      feedback: lastFeedback,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `feedback_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getAreaName = () => {
    if (!selectedArea) return '请选择关联区域';
    const area = mockAreas.find((a) => a.id === selectedArea);
    return area?.name || '未知区域';
  };

  const getErrorTypeLabel = (value: string) => {
    const type = errorTypes.find((t) => t.value === value);
    return type?.label || value;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">意见反馈</h1>
          <p className="text-gray-600">评价办理体验，或上报地图信息错误</p>
        </div>

        <div className="card mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">评价办理体验</h2>
              <p className="text-sm text-gray-500">您的反馈对我们很重要</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">满意度评分</label>
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-10 h-10 transition-all ${
                        star <= rating
                          ? 'text-yellow-400 fill-yellow-400 scale-110'
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-4 text-gray-600">
                  {rating === 0 && '请选择评分'}
                  {rating === 1 && '非常不满意'}
                  {rating === 2 && '不满意'}
                  {rating === 3 && '一般'}
                  {rating === 4 && '满意'}
                  {rating === 5 && '非常满意'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                详细评价
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="请描述您的办理体验或建议..."
                rows={4}
                className="input-field resize-none"
              />
            </div>

            <button
              onClick={handleSubmitFeedback}
              disabled={rating === 0 || !comment.trim() || submitted}
              className={`btn-primary flex items-center justify-center space-x-2 w-full ${
                (rating === 0 || !comment.trim() || submitted)
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
                  <span>提交评价</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-warning-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">上报地图信息错误</h2>
              <p className="text-sm text-gray-500">帮助我们完善地图数据</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">错误类型</label>
              <select
                value={errorType}
                onChange={(e) => setErrorType(e.target.value)}
                className="input-field"
              >
                <option value="">请选择错误类型</option>
                {errorTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">关联区域（选填）</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  onClick={() => setShowAreaDropdown(!showAreaDropdown)}
                  className="input-field pl-10 flex items-center justify-between"
                >
                  <span>{getAreaName()}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAreaDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showAreaDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedArea('');
                        setShowAreaDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                        !selectedArea ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                      }`}
                    >
                      不关联区域
                    </button>
                    {mockAreas.map((area) => (
                      <button
                        key={area.id}
                        onClick={() => {
                          setSelectedArea(area.id);
                          setShowAreaDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                          selectedArea === area.id ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
                        }`}
                      >
                        {area.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                错误详情描述
              </label>
              <textarea
                value={errorDetails}
                onChange={(e) => setErrorDetails(e.target.value)}
                placeholder="请详细描述您发现的错误，例如：XX区域的适用时间显示错误..."
                rows={4}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                上传截图（选填）
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">点击或拖拽上传截图</p>
                <p className="text-sm text-gray-400">支持 JPG、PNG 格式，最大 5MB</p>
              </div>
            </div>

            <button
              onClick={handleSubmitError}
              disabled={!errorType || !errorDetails.trim() || errorSubmitted}
              className={`btn-primary flex items-center justify-center space-x-2 w-full ${
                (!errorType || !errorDetails.trim() || errorSubmitted)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {errorSubmitted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>上报成功</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>上报错误</span>
                </>
              )}
            </button>
          </div>
        </div>

        {showSuccessMessage && errorReports.length > 0 && (
          <div className="card mt-6 border-success-200 bg-success-50">
            <div className="flex items-start space-x-3 p-4">
              <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <h4 className="font-medium text-success-800">上报成功</h4>
                <p className="text-sm text-success-700 mt-1">您的反馈已收到，我们会尽快处理。</p>
              </div>
            </div>
          </div>
        )}

        {errorReports.length > 0 && (
          <div className="card mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-warning-600" />
                <span>错误上报记录</span>
                <span className="text-sm text-gray-500 font-normal">({errorReports.length}条)</span>
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportErrorReports}
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <FileDown className="w-4 h-4" />
                  <span>导出记录</span>
                </button>
                <button
                  onClick={handleClearErrorReports}
                  className="text-sm text-danger-600 hover:text-danger-700 flex items-center space-x-1 px-3 py-1.5 border border-danger-200 rounded-lg hover:bg-danger-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>清空记录</span>
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {errorReports.slice(0, 5).map((report) => (
                <div key={report.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">{getErrorTypeLabel(report.errorType)}</span>
                    <span className="text-xs bg-warning-100 text-warning-600 px-2 py-1 rounded">待处理</span>
                  </div>
                  {report.areaName && (
                    <div className="text-xs text-gray-500 mb-1">关联区域：{report.areaName}</div>
                  )}
                  <p className="text-sm text-gray-600">{report.errorDetails}</p>
                  <div className="flex items-center space-x-1 mt-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{report.submitTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {lastFeedback && (
          <div className="card mt-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                <ThumbsUp className="w-5 h-5 text-primary-600" />
                <span>最近评价</span>
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportFeedback}
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <FileDown className="w-4 h-4" />
                  <span>导出记录</span>
                </button>
                <button
                  onClick={handleClearFeedback}
                  className="text-sm text-danger-600 hover:text-danger-700 flex items-center space-x-1 px-3 py-1.5 border border-danger-200 rounded-lg hover:bg-danger-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>清空记录</span>
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= lastFeedback.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700">{lastFeedback.comment}</p>
              <div className="flex items-center space-x-1 mt-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>评价时间：{lastFeedback.submitTime}</span>
              </div>
            </div>
          </div>
        )}

        <div className="card mt-6 bg-gray-50">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <ThumbsDown className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">常见反馈问题</h4>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• 区域信息与实际情况不符</li>
                <li>• 适用时间显示错误</li>
                <li>• 申请状态更新不及时</li>
                <li>• 页面加载缓慢或显示异常</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
