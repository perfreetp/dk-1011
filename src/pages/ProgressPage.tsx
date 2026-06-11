import { useState, useEffect } from 'react';
import { ClipboardList, Search, CheckCircle, Clock, AlertTriangle, FileText, User, MapPin, Calendar, Download, ChevronDown, ChevronUp, MessageCircle, Bell, X, Upload, Mail, Phone } from 'lucide-react';
import { mockApplications } from '../data/mockData';

interface Subscription {
  id: string;
  applicationNo: string;
  contact: string;
  type: 'phone' | 'email';
  subscribeTime: string;
}

interface CorrectionRecord {
  id: string;
  applicationNo: string;
  materials: string[];
  description: string;
  submitTime: string;
  status: 'pending' | 'reviewing' | 'accepted';
}

const STORAGE_KEY = 'airspace_subscriptions';
const CORRECTION_KEY = 'correction_records';

function loadSubscriptions(): Subscription[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveSubscriptions(subscriptions: Subscription[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
}

function loadCorrectionRecords(): CorrectionRecord[] {
  try {
    const data = localStorage.getItem(CORRECTION_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCorrectionRecords(records: CorrectionRecord[]) {
  localStorage.setItem(CORRECTION_KEY, JSON.stringify(records));
}

function validatePhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export default function ProgressPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<typeof mockApplications[0] | null>(null);
  const [error, setError] = useState('');
  const [showStatusChanges, setShowStatusChanges] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subscribeInput, setSubscribeInput] = useState('');
  const [subscribeError, setSubscribeError] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState('');
  const [showSubscriptionPanel, setShowSubscriptionPanel] = useState(false);

  const [correctionRecords, setCorrectionRecords] = useState<CorrectionRecord[]>([]);
  const [showSubscriptionsList, setShowSubscriptionsList] = useState(false);
  
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [correctionDescription, setCorrectionDescription] = useState('');

  useEffect(() => {
    setSubscriptions(loadSubscriptions());
    setCorrectionRecords(loadCorrectionRecords());
  }, []);

  const groupedSubscriptions = subscriptions.reduce((acc, sub) => {
    if (!acc[sub.applicationNo]) {
      acc[sub.applicationNo] = [];
    }
    acc[sub.applicationNo].push(sub);
    return acc;
  }, {} as Record<string, Subscription[]>);

  const relatedCorrectionRecords = searchResult
    ? correctionRecords.filter(r => r.applicationNo === searchResult.applicationNo)
    : [];

  const sampleNumbers = ['KY2024001', 'KY2024002', 'KY2024003'];

  const handleSearch = (query?: string) => {
    const searchValue = query !== undefined ? query : searchQuery;
    if (query !== undefined) {
      setSearchQuery(query);
    }

    if (!searchValue.trim()) {
      setError('请输入申请编号');
      setSearchResult(null);
      return;
    }

    const result = mockApplications.find(
      (app) => app.applicationNo.toLowerCase() === searchValue.toLowerCase()
    );

    if (result) {
      setSearchResult(result);
      setError('');
      setShowExamples(false);
    } else {
      setError('');
      setSearchResult(null);
      setShowExamples(true);
    }
  };

  const handleSampleClick = (sampleNo: string) => {
    handleSearch(sampleNo);
  };

  const handleSubscribe = () => {
    setSubscribeError('');
    setSubscribeSuccess('');

    if (!searchResult) {
      setSubscribeError('请先查询申请进度');
      return;
    }

    const contact = subscribeInput.trim();
    if (!contact) {
      setSubscribeError('请输入手机号或邮箱');
      return;
    }

    const isPhone = validatePhone(contact);
    const isEmail = validateEmail(contact);

    if (!isPhone && !isEmail) {
      setSubscribeError('请输入正确的手机号或邮箱格式');
      return;
    }

    const existing = subscriptions.find(
      (s) => s.applicationNo === searchResult.applicationNo && s.contact === contact
    );
    if (existing) {
      setSubscribeError('该联系方式已订阅此申请');
      return;
    }

    const newSubscription: Subscription = {
      id: generateId(),
      applicationNo: searchResult.applicationNo,
      contact,
      type: isPhone ? 'phone' : 'email',
      subscribeTime: new Date().toLocaleString('zh-CN'),
    };

    const updated = [...subscriptions, newSubscription];
    setSubscriptions(updated);
    saveSubscriptions(updated);
    setSubscribeInput('');
    setSubscribeSuccess(`订阅成功！状态变更将通知到 ${contact}`);
  };

  const handleUnsubscribe = (id: string) => {
    const updated = subscriptions.filter((s) => s.id !== id);
    setSubscriptions(updated);
    saveSubscriptions(updated);
  };

  const handleDownloadApproval = () => {
    const content = `
空域使用批复文件

申请编号：${searchResult?.applicationNo}
申请区域：${searchResult?.areaName}
申请人：${searchResult?.applicant}
批复时间：${searchResult?.updateTime}

批复内容：
经审核，同意该空域使用申请。请按照申请方案严格执行飞行活动，注意安全。

特此批复。

空域管理部门
${new Date().toLocaleDateString('zh-CN')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `批复文件_${searchResult?.applicationNo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenCorrectionModal = () => {
    if (!searchResult?.correctionMaterials) return;
    setSelectedMaterials(searchResult.correctionMaterials);
    setCorrectionDescription('');
    setShowCorrectionModal(true);
  };

  const handleToggleMaterial = (material: string) => {
    if (selectedMaterials.includes(material)) {
      setSelectedMaterials(selectedMaterials.filter(m => m !== material));
    } else {
      setSelectedMaterials([...selectedMaterials, material]);
    }
  };

  const handleSubmitCorrection = () => {
    if (selectedMaterials.length === 0) {
      alert('请至少选择一项补正材料');
      return;
    }

    const newRecord: CorrectionRecord = {
      id: generateId(),
      applicationNo: searchResult!.applicationNo,
      materials: selectedMaterials,
      description: correctionDescription,
      submitTime: new Date().toLocaleString('zh-CN'),
      status: 'pending',
    };

    const updated = [...correctionRecords, newRecord];
    setCorrectionRecords(updated);
    saveCorrectionRecords(updated);
    setShowCorrectionModal(false);
    setSelectedMaterials([]);
    setCorrectionDescription('');
    
    alert(`补正材料提交成功！\n\n提交材料：${selectedMaterials.join('、')}\n${correctionDescription ? '说明：' + correctionDescription + '\n' : ''}提交时间：${newRecord.submitTime}\n\n您可以在下方查看补正材料提交记录。`);
  };

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          label: '已批复',
          color: 'bg-success-100 text-success-600',
          icon: CheckCircle,
        };
      case 'reviewing':
        return {
          label: '审核中',
          color: 'bg-primary-100 text-primary-600',
          icon: Clock,
        };
      case 'correction':
        return {
          label: '需要补正',
          color: 'bg-warning-100 text-warning-600',
          icon: AlertTriangle,
        };
      case 'accepted':
        return {
          label: '已受理',
          color: 'bg-primary-100 text-primary-600',
          icon: CheckCircle,
        };
      case 'submitted':
        return {
          label: '已提交',
          color: 'bg-gray-100 text-gray-600',
          icon: FileText,
        };
      case 'rejected':
        return {
          label: '已拒绝',
          color: 'bg-danger-100 text-danger-600',
          icon: AlertTriangle,
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-600',
          icon: FileText,
        };
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'current':
        return <div className="w-5 h-5 bg-primary-600 rounded-full animate-pulse" />;
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
    }
  };

  const getStepLine = (status: string, isLast: boolean) => {
    if (isLast) return null;
    switch (status) {
      case 'completed':
        return (
          <div className="absolute left-2 top-7 w-0.5 h-full bg-success-500" />
        );
      case 'current':
        return (
          <div className="absolute left-2 top-7 w-0.5 h-full bg-primary-300" />
        );
      default:
        return (
          <div className="absolute left-2 top-7 w-0.5 h-full bg-gray-200" />
        );
    }
  };

  const relatedSubscriptions = searchResult
    ? subscriptions.filter((s) => s.applicationNo === searchResult.applicationNo)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">申请进度查询</h1>
          <p className="text-gray-600">输入申请编号查询办理进度</p>
        </div>

        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="请输入申请编号，如 KY2024001"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 input-field"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              className="btn-primary px-8"
            >
              查询
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-danger-600" />
              <span className="text-danger-600">{error}</span>
            </div>
          )}
        </div>

        {searchResult && (
          <div className="mt-6 space-y-6">
            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {searchResult.applicationNo}
                    </h2>
                    {(() => {
                      const config = getStatusConfig(searchResult.status);
                      const Icon = config.icon;
                      return (
                        <span className={`badge flex items-center space-x-1 ${config.color}`}>
                          <Icon className="w-4 h-4" />
                          <span>{config.label}</span>
                        </span>
                      );
                    })()}
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    最后更新：{searchResult.updateTime}
                  </p>
                </div>
                <button
                  onClick={() => setShowSubscriptionPanel(!showSubscriptionPanel)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span className="text-sm font-medium">订阅提醒</span>
                </button>
              </div>

              {showSubscriptionPanel && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-800 mb-4 flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-primary-600" />
                    <span>状态变更订阅</span>
                  </h4>

                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="输入手机号或邮箱订阅状态变更通知"
                        value={subscribeInput}
                        onChange={(e) => {
                          setSubscribeInput(e.target.value);
                          setSubscribeError('');
                          setSubscribeSuccess('');
                        }}
                        className="w-full px-4 py-2 input-field text-sm"
                      />
                    </div>
                    <button
                      onClick={handleSubscribe}
                      className="btn-primary px-6 py-2 text-sm"
                    >
                      订阅
                    </button>
                  </div>

                  {subscribeError && (
                    <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-sm text-danger-600">
                      {subscribeError}
                    </div>
                  )}

                  {subscribeSuccess && (
                    <div className="mb-4 p-3 bg-success-50 border border-success-200 rounded-lg text-sm text-success-600">
                      {subscribeSuccess}
                    </div>
                  )}

                  {relatedSubscriptions.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-3">已订阅的联系方式：</p>
                      <div className="space-y-2">
                        {relatedSubscriptions.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              {sub.type === 'phone' ? (
                                <Phone className="w-4 h-4 text-gray-400" />
                              ) : (
                                <Mail className="w-4 h-4 text-gray-400" />
                              )}
                              <span className="text-sm text-gray-700">{sub.contact}</span>
                              <span className="text-xs text-gray-400">
                                {sub.subscribeTime}
                              </span>
                            </div>
                            <button
                              onClick={() => handleUnsubscribe(sub.id)}
                              className="text-danger-500 hover:text-danger-600 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">申请区域</div>
                    <div className="font-medium text-gray-800">{searchResult.areaName}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">申请人</div>
                    <div className="font-medium text-gray-800">{searchResult.applicant}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">提交时间</div>
                    <div className="font-medium text-gray-800">{searchResult.submitTime}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <ClipboardList className="w-5 h-5 text-primary-600" />
                <span>办理进度</span>
              </h3>

              <div className="relative pl-8">
                {searchResult.progressSteps.map((step, index) => (
                  <div key={index} className="relative pb-6 last:pb-0">
                    {getStepLine(step.status, index === searchResult.progressSteps.length - 1)}
                    <div className="relative z-10 flex items-start space-x-4">
                      {getStepIcon(step.status)}
                      <div className="flex-1">
                        <div className={`font-medium ${step.status === 'current' ? 'text-primary-600' : 'text-gray-800'}`}>
                          {step.title}
                        </div>
                        {step.time && (
                          <div className="text-sm text-gray-500 mt-1">{step.time}</div>
                        )}
                        {step.description && (
                          <div className={`text-sm mt-2 ${step.status === 'current' && step.title.includes('补正') ? 'text-warning-600' : 'text-gray-600'}`}>
                            {step.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {searchResult.correctionMaterials && searchResult.correctionMaterials.length > 0 && (
              <div className="card bg-warning-50 border border-warning-200">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-warning-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">补正材料说明</h4>
                    <p className="text-sm text-gray-600 mt-2">请补充以下材料后重新提交审核：</p>
                    <ul className="text-sm text-warning-700 mt-2 space-y-1">
                      {searchResult.correctionMaterials.map((material, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-warning-500 rounded-full mr-2"></span>
                          {material}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 mt-3">请在收到通知后3个工作日内提交补正材料</p>

                    <div className="mt-4 pt-4 border-t border-warning-200">
                      <button
                        onClick={handleOpenCorrectionModal}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>提交补正材料</span>
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        点击按钮选择需要补正的材料并提交
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {searchResult.approvalDocUrl && searchResult.status === 'approved' && (
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Download className="w-5 h-5 text-primary-600" />
                  <span>批复文件下载</span>
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-primary-600" />
                    <div>
                      <div className="font-medium text-gray-800">空域使用批复文件.pdf</div>
                      <div className="text-sm text-gray-500">文件大小：2.5 MB</div>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadApproval}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>下载</span>
                  </button>
                </div>
              </div>
            )}

            {searchResult.statusChanges && searchResult.statusChanges.length > 0 && (
              <div className="card">
                <button
                  onClick={() => setShowStatusChanges(!showStatusChanges)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <span>状态变更记录</span>
                  </h3>
                  {showStatusChanges ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {showStatusChanges && (
                  <div className="px-4 pb-4 space-y-3">
                    {searchResult.statusChanges.map((change, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-success-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{change.status}</span>
                            <span className="text-sm text-gray-500">{change.time}</span>
                          </div>
                          {change.operator && (
                            <div className="text-sm text-gray-500 mt-1">操作员：{change.operator}</div>
                          )}
                          {change.remark && (
                            <div className="text-sm text-gray-600 mt-1">{change.remark}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {relatedCorrectionRecords.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-primary-600" />
                  <span>补正材料提交记录</span>
                </h3>
                <div className="space-y-3">
                  {relatedCorrectionRecords.map((record, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500">提交时间：{record.submitTime}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCorrectionStatusColor(record.status)}`}>
                          {getCorrectionStatusLabel(record.status)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">提交材料：</div>
                        <div className="flex flex-wrap gap-2">
                          {record.materials.map((material, i) => (
                            <span key={i} className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border">
                              {material}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(groupedSubscriptions).length > 0 && (
              <div className="card">
                <button
                  onClick={() => setShowSubscriptionsList(!showSubscriptionsList)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-primary-600" />
                    <span>我的订阅记录</span>
                    <span className="text-sm text-gray-500 font-normal">({Object.keys(groupedSubscriptions).length}个申请)</span>
                  </h3>
                  {showSubscriptionsList ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {showSubscriptionsList && (
                  <div className="px-4 pb-4 space-y-3">
                    {Object.entries(groupedSubscriptions).map(([appNo, subs]) => (
                      <div key={appNo} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium text-primary-600">{appNo}</span>
                          <span className="text-sm text-gray-500">{subs.length}个联系方式</span>
                        </div>
                        <div className="space-y-2">
                          {subs.map((sub) => (
                            <div key={sub.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {sub.type === 'phone' ? (
                                  <Phone className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <Mail className="w-4 h-4 text-gray-400" />
                                )}
                                <span className="text-sm text-gray-700">{sub.contact}</span>
                              </div>
                              <span className="text-xs text-gray-400">{sub.subscribeTime}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="card bg-primary-50">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">温馨提示</h4>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• 申请状态更新后将通过短信通知您</li>
                    <li>• 如需补正材料，请在收到通知后3个工作日内提交</li>
                    <li>• 如有疑问，请联系客服：400-888-8888</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {showExamples && (
          <div className="card mt-6">
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-warning-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">未找到该申请编号，请检查输入是否正确</p>
              <p className="text-sm text-gray-500 mb-4">您可以尝试以下示例编号：</p>
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {sampleNumbers.map((sample) => (
                  <button
                    key={sample}
                    onClick={() => handleSampleClick(sample)}
                    className="px-4 py-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors text-sm font-medium"
                  >
                    {sample}
                  </button>
                ))}
              </div>
              <button className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm">
                <MessageCircle className="w-4 h-4" />
                <span>仍有疑问？联系客服咨询</span>
              </button>
            </div>
          </div>
        )}

        {!searchQuery && !searchResult && !showExamples && (
          <div className="card mt-6">
            <div className="text-center py-12">
              <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">输入申请编号查询办理进度</p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-success-600">1</div>
                  <div className="text-sm text-gray-600 mt-1">已批复</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">1</div>
                  <div className="text-sm text-gray-600 mt-1">审核中</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-warning-600">1</div>
                  <div className="text-sm text-gray-600 mt-1">需补正</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCorrectionModal && searchResult?.correctionMaterials && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">提交补正材料</h3>
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">选择需要补正的材料</label>
              <div className="space-y-2">
                {searchResult.correctionMaterials.map((material) => (
                  <label
                    key={material}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMaterials.includes(material)
                        ? 'bg-primary-50 border-2 border-primary-200'
                        : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(material)}
                      onChange={() => handleToggleMaterial(material)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-700">{material}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">补充说明（选填）</label>
              <textarea
                value={correctionDescription}
                onChange={(e) => setCorrectionDescription(e.target.value)}
                placeholder="请简要说明补正材料的情况..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitCorrection}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>确认提交</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
