import { useState } from 'react';
import { FileText, MessageCircle, AlertCircle, ThumbsUp, Edit3, Download, Trash2, ChevronDown, ChevronUp, CheckCircle, Clock, Upload, ClipboardList } from 'lucide-react';
import type { Consultation, Feedback, ErrorReport } from '../types';

interface DraftApplication {
  id: string;
  areaId?: string;
  areaName?: string;
  purpose?: string;
  date?: string;
  timeSlot?: string;
  materials: { name: string; prepared: boolean }[];
  createdAt: number;
  updatedAt: number;
}

interface CorrectionRecord {
  id: string;
  applicationNo: string;
  materials: string[];
  description: string;
  submitTime: string;
  status: 'pending' | 'reviewing' | 'accepted';
}

const CONSULT_KEY = 'consultations';
const ERROR_REPORTS_KEY = 'errorReports';
const FEEDBACK_KEY = 'lastFeedback';
const DRAFT_KEY = 'application_drafts';
const CORRECTION_KEY = 'correction_records';

function loadConsultations(): Consultation[] {
  try {
    const data = localStorage.getItem(CONSULT_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function loadErrorReports(): ErrorReport[] {
  try {
    const data = localStorage.getItem(ERROR_REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function loadFeedback(): Feedback | null {
  try {
    const data = localStorage.getItem(FEEDBACK_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function loadDrafts(): DraftApplication[] {
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function loadCorrectionRecords(): CorrectionRecord[] {
  try {
    const data = localStorage.getItem(CORRECTION_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

type RecordType = 'consult' | 'error' | 'feedback' | 'draft' | 'correction';

const recordTypes: { type: RecordType; label: string; icon: typeof MessageCircle; color: string }[] = [
  { type: 'consult', label: '咨询记录', icon: MessageCircle, color: 'text-primary-600' },
  { type: 'error', label: '地图错误上报', icon: AlertCircle, color: 'text-warning-600' },
  { type: 'feedback', label: '评价记录', icon: ThumbsUp, color: 'text-success-600' },
  { type: 'draft', label: '申请草稿', icon: Edit3, color: 'text-purple-600' },
  { type: 'correction', label: '补正材料记录', icon: Upload, color: 'text-blue-600' },
];

export default function ServiceRecordsPage() {
  const [activeType, setActiveType] = useState<RecordType>('consult');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState<RecordType | null>(null);

  const consultations = loadConsultations();
  const errorReports = loadErrorReports();
  const feedback = loadFeedback();
  const drafts = loadDrafts();
  const corrections = loadCorrectionRecords();

  const getTypeStats = () => {
    return {
      consult: consultations.length,
      error: errorReports.length,
      feedback: feedback ? 1 : 0,
      draft: drafts.length,
      correction: corrections.length,
    };
  };

  const stats = getTypeStats();

  const handleClearRecords = (type: RecordType) => {
    switch (type) {
      case 'consult':
        localStorage.removeItem(CONSULT_KEY);
        break;
      case 'error':
        localStorage.removeItem(ERROR_REPORTS_KEY);
        break;
      case 'feedback':
        localStorage.removeItem(FEEDBACK_KEY);
        break;
      case 'draft':
        localStorage.removeItem(DRAFT_KEY);
        break;
      case 'correction':
        localStorage.removeItem(CORRECTION_KEY);
        break;
    }
    setConfirmClear(null);
    window.location.reload();
  };

  const handleClearAll = () => {
    localStorage.removeItem(CONSULT_KEY);
    localStorage.removeItem(ERROR_REPORTS_KEY);
    localStorage.removeItem(FEEDBACK_KEY);
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(CORRECTION_KEY);
    window.location.reload();
  };

  const handleExportRecords = (type: RecordType) => {
    let data: unknown;
    let filename: string;

    switch (type) {
      case 'consult':
        data = { exportTime: new Date().toLocaleString('zh-CN'), records: consultations };
        filename = `consultations_${new Date().toISOString().slice(0, 10)}.json`;
        break;
      case 'error':
        data = { exportTime: new Date().toLocaleString('zh-CN'), records: errorReports };
        filename = `error_reports_${new Date().toISOString().slice(0, 10)}.json`;
        break;
      case 'feedback':
        data = { exportTime: new Date().toLocaleString('zh-CN'), record: feedback };
        filename = `feedback_${new Date().toISOString().slice(0, 10)}.json`;
        break;
      case 'draft':
        data = { exportTime: new Date().toLocaleString('zh-CN'), records: drafts };
        filename = `drafts_${new Date().toISOString().slice(0, 10)}.json`;
        break;
      case 'correction':
        data = { exportTime: new Date().toLocaleString('zh-CN'), records: corrections };
        filename = `corrections_${new Date().toISOString().slice(0, 10)}.json`;
        break;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportAll = () => {
    const allData = {
      exportTime: new Date().toLocaleString('zh-CN'),
      consultations,
      errorReports,
      feedback,
      drafts,
      corrections,
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `service_records_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'replied':
        return { label: '已回复', color: 'bg-success-100 text-success-600', icon: CheckCircle };
      case 'pending':
        return { label: '待回复', color: 'bg-gray-100 text-gray-600', icon: Clock };
      case 'processing':
        return { label: '处理中', color: 'bg-primary-100 text-primary-600', icon: Clock };
      case 'resolved':
        return { label: '已解决', color: 'bg-success-100 text-success-600', icon: CheckCircle };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-600', icon: Clock };
    }
  };

  const getErrorTypeLabel = (value: string) => {
    const types: Record<string, string> = {
      area: '区域信息错误',
      time: '时间信息错误',
      rule: '规则信息错误',
      other: '其他错误',
    };
    return types[value] || value;
  };

  const renderConsultRecords = () => (
    <div className="space-y-3">
      {consultations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无咨询记录</p>
        </div>
      ) : (
        consultations.map((consult) => {
          const config = getStatusConfig(consult.status);
          const Icon = config.icon;
          return (
            <div
              key={consult.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                onClick={() => setExpandedId(expandedId === consult.id ? null : consult.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${config.color.replace('text-', 'bg-')}`}>
                    <Icon className={`w-5 h-5 ${config.color.split(' ')[1]}`} />
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
        })
      )}
    </div>
  );

  const renderErrorReports = () => (
    <div className="space-y-3">
      {errorReports.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无错误上报记录</p>
        </div>
      ) : (
        errorReports.map((report) => {
          const config = getStatusConfig(report.status);
          const Icon = config.icon;
          return (
            <div key={report.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-800">{getErrorTypeLabel(report.errorType)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                  {config.label}
                </span>
              </div>
              {report.areaName && (
                <div className="text-xs text-gray-500 mb-1">关联区域：{report.areaName}</div>
              )}
              <p className="text-sm text-gray-700">{report.errorDetails}</p>
              <div className="flex items-center space-x-1 mt-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{report.submitTime}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const renderFeedback = () => (
    <div className="space-y-3">
      {!feedback ? (
        <div className="text-center py-8 text-gray-500">
          <ThumbsUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无评价记录</p>
        </div>
      ) : (
        <div className="p-6 bg-gray-50 rounded-xl">
          <div className="flex items-center space-x-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-6 h-6 ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill={star <= feedback.rating ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-700 mb-4">{feedback.comment}</p>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>评价时间：{feedback.submitTime}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderDrafts = () => (
    <div className="space-y-3">
      {drafts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Edit3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无申请草稿</p>
        </div>
      ) : (
        drafts.map((draft) => {
          const preparedCount = draft.materials.filter(m => m.prepared).length;
          return (
            <div key={draft.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  {draft.areaName && (
                    <div className="font-medium text-gray-800">{draft.areaName}</div>
                  )}
                  {draft.purpose && (
                    <div className="text-sm text-gray-500">用途：{draft.purpose}</div>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(draft.updatedAt).toLocaleString('zh-CN')}
                </span>
              </div>
              {draft.date && (
                <div className="text-sm text-gray-500 mb-2">申请日期：{draft.date}</div>
              )}
              {draft.timeSlot && (
                <div className="text-sm text-gray-500 mb-2">时段：{draft.timeSlot}</div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  材料准备：{preparedCount}/{draft.materials.length}
                </span>
                <div className="flex gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-success-500 h-2 rounded-full"
                      style={{ width: `${(preparedCount / draft.materials.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const groupedCorrections = corrections.reduce((acc, record) => {
    if (!acc[record.applicationNo]) {
      acc[record.applicationNo] = [];
    }
    acc[record.applicationNo].push(record);
    return acc;
  }, {} as Record<string, CorrectionRecord[]>);

  const getCorrectionStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '待审核';
      case 'reviewing': return '审核中';
      case 'accepted': return '已受理';
      default: return status;
    }
  };

  const getCorrectionStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning-100 text-warning-600';
      case 'reviewing': return 'bg-primary-100 text-primary-600';
      case 'accepted': return 'bg-success-100 text-success-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const renderCorrectionRecords = () => (
    <div className="space-y-3">
      {corrections.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Upload className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>暂无补正材料记录</p>
        </div>
      ) : (
        Object.entries(groupedCorrections).map(([appNo, records]) => (
          <div key={appNo} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-800">{appNo}</span>
                <span className="text-sm text-gray-500">({records.length}条记录)</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {records.map((record) => (
                <div key={record.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">提交时间：{record.submitTime}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCorrectionStatusColor(record.status)}`}>
                      {getCorrectionStatusLabel(record.status)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="text-sm text-gray-500 mb-1">提交材料：</div>
                    <div className="flex flex-wrap gap-2">
                      {record.materials.map((material, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                  {record.description && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">
                        <Clock className="w-4 h-4 inline mr-2 text-blue-500" />
                        {record.description}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeType) {
      case 'consult':
        return renderConsultRecords();
      case 'error':
        return renderErrorReports();
      case 'feedback':
        return renderFeedback();
      case 'draft':
        return renderDrafts();
      case 'correction':
        return renderCorrectionRecords();
      default:
        return null;
    }
  };

  const totalRecords = stats.consult + stats.error + stats.feedback + stats.draft + stats.correction;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">服务记录管理</h1>
          <p className="text-gray-600">管理您的咨询、反馈、评价和申请草稿记录</p>
        </div>

        <div className="card mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recordTypes.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => setActiveType(item.type)}
                  className={`p-4 rounded-xl transition-colors text-left ${
                    activeType === item.type
                      ? 'bg-primary-50 border-2 border-primary-200'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-3 ${
                    activeType === item.type ? 'ring-2 ring-primary-200' : ''
                  }`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="font-medium text-gray-800">{item.label}</div>
                  <div className={`text-2xl font-bold mt-1 ${activeType === item.type ? item.color : 'text-gray-400'}`}>
                    {stats[item.type]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
              {(() => {
                const item = recordTypes.find(t => t.type === activeType);
                if (!item) return null;
                const Icon = item.icon;
                return (
                  <>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span>{item.label}</span>
                    <span className="text-sm text-gray-500 font-normal">({stats[activeType]}条)</span>
                  </>
                );
              })()}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExportRecords(activeType)}
                disabled={stats[activeType] === 0}
                className="btn-secondary text-sm flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>导出</span>
              </button>
              <button
                onClick={() => setConfirmClear(activeType)}
                disabled={stats[activeType] === 0}
                className="text-sm text-danger-600 hover:text-danger-700 flex items-center space-x-1 px-3 py-1.5 border border-danger-200 rounded-lg hover:bg-danger-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                <span>清空</span>
              </button>
            </div>
          </div>

          {renderContent()}
        </div>

        {totalRecords > 0 && (
          <div className="card mt-6 bg-gray-50">
            <div className="flex items-center justify-between p-4">
              <div className="text-sm text-gray-600">
                全部记录：{totalRecords} 条
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleExportAll()}
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>导出全部记录</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('确定要清空所有服务记录吗？此操作不可恢复。')) {
                      handleClearAll();
                    }
                  }}
                  className="text-sm text-danger-600 hover:text-danger-700 flex items-center space-x-1 px-3 py-1.5 border border-danger-200 rounded-lg hover:bg-danger-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>清空全部</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmClear && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">确认清空</h3>
              <p className="text-gray-600 mb-6">
                确定要清空{recordTypes.find(t => t.type === confirmClear)?.label}吗？此操作不可恢复。
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setConfirmClear(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => handleClearRecords(confirmClear)}
                  className="flex-1 px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors"
                >
                  确认清空
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}