import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Clock, AlertCircle, AlertTriangle, Lightbulb, ChevronRight, ArrowLeft, MapPin, Edit3, Save, CheckCircle, Trash2 } from 'lucide-react';
import { mockRules, mockAreas } from '../data/mockData';

interface LocationState {
  areaId?: string;
  areaName?: string;
  purpose?: string;
  action?: 'apply' | 'viewMaterials';
  dateFilter?: string;
  timeFilter?: string;
}

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

const DRAFT_STORAGE_KEY = 'application_drafts';

function loadDrafts(): DraftApplication[] {
  try {
    const data = localStorage.getItem(DRAFT_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveDrafts(drafts: DraftApplication[]) {
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
}

function findMatchingRule(purpose: string): typeof mockRules[0] | undefined {
  const exactMatch = mockRules.find(rule => rule.category === purpose);
  if (exactMatch) return exactMatch;
  
  const relatedMatch = mockRules.find(rule => 
    rule.relatedPurposes?.includes(purpose)
  );
  if (relatedMatch) return relatedMatch;
  
  const fuzzyMatch = mockRules.find(rule => 
    rule.category.toLowerCase().includes(purpose.toLowerCase()) ||
    rule.examples.some(e => e.toLowerCase().includes(purpose.toLowerCase()))
  );
  return fuzzyMatch || mockRules[0];
}

export default function RulesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;
  const [activeTab, setActiveTab] = useState(mockRules[0].category);
  const [drafts, setDrafts] = useState<DraftApplication[]>(loadDrafts());
  const [selectedDraft, setSelectedDraft] = useState<DraftApplication | null>(null);
  const [showDraftPanel, setShowDraftPanel] = useState(false);
  const [materialsChecklist, setMaterialsChecklist] = useState<{ name: string; prepared: boolean }[]>([]);
  const [draftDate, setDraftDate] = useState('');
  const [draftTimeSlot, setDraftTimeSlot] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const materialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state?.purpose) {
      const matchingRule = findMatchingRule(state.purpose);
      if (matchingRule) {
        setActiveTab(matchingRule.category);
      }
    }
  }, [state]);

  useEffect(() => {
    const activeRule = mockRules.find(r => r.category === activeTab);
    if (activeRule) {
      setMaterialsChecklist(activeRule.materials.map(m => ({ name: m, prepared: false })));
    }
  }, [activeTab]);

  useEffect(() => {
    if (state?.areaName) {
      const existingDraft = drafts.find(
        d => d.areaName === state.areaName && d.purpose === state.purpose
      );
      if (existingDraft) {
        setSelectedDraft(existingDraft);
        setMaterialsChecklist(existingDraft.materials);
        setDraftDate(existingDraft.date || '');
        setDraftTimeSlot(existingDraft.timeSlot || '');
      } else if (state?.dateFilter || state?.timeFilter) {
        const timeSlotMap: Record<string, string> = {
          'morning': 'morning',
          'afternoon': 'afternoon',
          'evening': 'evening',
          'workday': 'afternoon',
          'weekend': 'afternoon',
          'all': ''
        };
        if (state.dateFilter === 'today') {
          const today = new Date();
          setDraftDate(today.toISOString().split('T')[0]);
        } else if (state.dateFilter === 'weekend') {
          const today = new Date();
          const daysUntilWeekend = (7 - today.getDay()) % 7;
          const weekendDate = new Date(today);
          weekendDate.setDate(today.getDate() + (daysUntilWeekend || 7));
          setDraftDate(weekendDate.toISOString().split('T')[0]);
        }
        if (state.timeFilter && timeSlotMap[state.timeFilter]) {
          setDraftTimeSlot(timeSlotMap[state.timeFilter]);
        }
      }
    }
  }, [state, drafts]);

  useEffect(() => {
    if (state?.action === 'viewMaterials' && materialsRef.current) {
      setTimeout(() => {
        materialsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [state, activeTab]);

  const activeRule = mockRules.find((rule) => rule.category === activeTab) || mockRules[0];

  const handleToggleMaterial = (index: number) => {
    const updated = [...materialsChecklist];
    updated[index] = { ...updated[index], prepared: !updated[index].prepared };
    setMaterialsChecklist(updated);
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    const newDraft: DraftApplication = {
      id: selectedDraft?.id || Date.now().toString(),
      areaId: state?.areaId,
      areaName: state?.areaName,
      purpose: state?.purpose || activeTab,
      date: draftDate,
      timeSlot: draftTimeSlot,
      materials: materialsChecklist,
      createdAt: selectedDraft?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    const updatedDrafts = selectedDraft
      ? drafts.map(d => d.id === selectedDraft.id ? newDraft : d)
      : [...drafts, newDraft];

    saveDrafts(updatedDrafts);
    setDrafts(updatedDrafts);
    setSelectedDraft(newDraft);
    setIsSaving(false);
  };

  const handleDeleteDraft = () => {
    if (!selectedDraft) return;
    const updatedDrafts = drafts.filter(d => d.id !== selectedDraft.id);
    saveDrafts(updatedDrafts);
    setDrafts(updatedDrafts);
    setSelectedDraft(null);
    setMaterialsChecklist(activeRule.materials.map(m => ({ name: m, prepared: false })));
    setDraftDate('');
    setDraftTimeSlot('');
  };

  const getAreaInfo = () => {
    if (!state?.areaId) return null;
    return mockAreas.find(a => a.id === state.areaId);
  };

  const areaInfo = getAreaInfo();
  const preparedCount = materialsChecklist.filter(m => m.prepared).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">申请规则</h1>
          <p className="text-gray-600">了解各类飞行活动的申请要求、材料清单和限制条件</p>
        </div>

        {state && (
          <div className="card mb-6 bg-primary-50 border border-primary-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-primary-600 font-medium">
                    {state.action === 'apply' ? '来自地图页 - 申请入口' : '来自地图页 - 查看材料'}
                  </p>
                  <p className="text-gray-800 font-semibold">
                    区域: {state.areaName || '未知区域'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>用途:</span>
                <span className="px-3 py-1 bg-white rounded-full text-primary-600 font-medium">
                  {state.purpose || '通用'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-64 border-b lg:border-b-0 lg:border-r p-4">
              <h3 className="font-semibold text-gray-800 mb-4">按用途分类</h3>
              <nav className="space-y-2">
                {mockRules.map((rule) => (
                  <button
                    key={rule.id}
                    onClick={() => setActiveTab(rule.category)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                      activeTab === rule.category
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{rule.category}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === rule.category ? 'rotate-90' : ''}`} />
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{activeRule.category}</h2>
                  <p className="text-gray-500 text-sm">详细申请指南</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-success-50 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-5 h-5 text-success-600" />
                    <h3 className="font-semibold text-gray-800">提前申请天数</h3>
                  </div>
                  <div className="text-4xl font-bold text-success-600">{activeRule.advanceDays}</div>
                  <div className="text-gray-600 mt-1">个工作日</div>
                </div>

                <div className="bg-primary-50 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-800">材料数量</h3>
                  </div>
                  <div className="text-4xl font-bold text-primary-600">{activeRule.materials.length}</div>
                  <div className="text-gray-600 mt-1">项材料</div>
                </div>
              </div>

              {areaInfo && (
              <div className="mt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-800">区域信息</h3>
                </div>
                <div className="bg-primary-50 rounded-xl p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">开放时间</div>
                      <div className="font-medium text-gray-800">{areaInfo.applicableTime}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">区域状态</div>
                      <div className={`font-medium ${
                        areaInfo.type === 'available' ? 'text-success-600' :
                        areaInfo.type === 'restricted' ? 'text-warning-600' : 'text-danger-600'
                      }`}>
                        {areaInfo.status}
                      </div>
                    </div>
                  </div>
                  {areaInfo.nearbyRestrictions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-primary-200">
                      <div className="text-sm text-gray-500 mb-2">附近限制</div>
                      <ul className="space-y-1">
                        {areaInfo.nearbyRestrictions.map((r, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start">
                            <AlertCircle className="w-4 h-4 text-warning-500 mr-2 flex-shrink-0 mt-0.5" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

              <div className="mt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-800">办前评估</h3>
                </div>
                {(() => {
                  const areaAvailable = areaInfo?.type !== 'forbidden';
                  const materialsReady = preparedCount === materialsChecklist.length;
                  const hasNearbyRestrictions = areaInfo?.nearbyRestrictions.length > 0;
                  const isRestricted = areaInfo?.type === 'restricted';
                  
                  let conclusion: 'available' | 'need_materials' | 'restricted' | 'forbidden';
                  let conclusionText: string;
                  let conclusionIcon = CheckCircle;
                  let bgColor = 'bg-success-50';
                  let borderColor = 'border-success-200';
                  let textColor = 'text-success-600';
                  let iconBg = 'bg-success-100';
                  
                  if (!areaAvailable) {
                    conclusion = 'forbidden';
                    conclusionText = '该区域为禁飞区，暂不可申请';
                    conclusionIcon = AlertCircle;
                    bgColor = 'bg-danger-50';
                    borderColor = 'border-danger-200';
                    textColor = 'text-danger-600';
                    iconBg = 'bg-danger-100';
                  } else if (isRestricted && hasNearbyRestrictions) {
                    conclusion = 'restricted';
                    conclusionText = '区域有使用限制，建议先咨询确认';
                    conclusionIcon = AlertTriangle;
                    bgColor = 'bg-warning-50';
                    borderColor = 'border-warning-200';
                    textColor = 'text-warning-600';
                    iconBg = 'bg-warning-100';
                  } else if (!materialsReady) {
                    conclusion = 'need_materials';
                    conclusionText = `材料准备中，还需准备 ${materialsChecklist.length - preparedCount} 项材料`;
                    conclusionIcon = AlertCircle;
                    bgColor = 'bg-primary-50';
                    borderColor = 'border-primary-200';
                    textColor = 'text-primary-600';
                    iconBg = 'bg-primary-100';
                  } else {
                    conclusion = 'available';
                    conclusionText = '材料准备完成，可以申请';
                    conclusionIcon = CheckCircle;
                    bgColor = 'bg-success-50';
                    borderColor = 'border-success-200';
                    textColor = 'text-success-600';
                    iconBg = 'bg-success-100';
                  }
                  
                  const ConclusionIcon = conclusionIcon;
                  return (
                    <div className={`${bgColor} border ${borderColor} rounded-xl p-6`}>
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <ConclusionIcon className={`w-6 h-6 ${textColor}`} />
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold text-lg ${textColor}`}>{conclusionText}</div>
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white/50 rounded-lg p-3">
                              <div className="text-sm text-gray-500">区域状态</div>
                              <div className={`font-medium ${areaInfo?.type === 'available' ? 'text-success-600' : areaInfo?.type === 'restricted' ? 'text-warning-600' : 'text-danger-600'}`}>
                                {areaInfo?.status || '未知'}
                              </div>
                            </div>
                            <div className="bg-white/50 rounded-lg p-3">
                              <div className="text-sm text-gray-500">材料进度</div>
                              <div className="font-medium text-gray-800">
                                {preparedCount}/{materialsChecklist.length}
                              </div>
                            </div>
                            <div className="bg-white/50 rounded-lg p-3">
                              <div className="text-sm text-gray-500">提前申请</div>
                              <div className="font-medium text-gray-800">{activeRule.advanceDays}个工作日</div>
                            </div>
                          </div>
                          {conclusion === 'restricted' && (
                            <div className="mt-4 p-3 bg-white/50 rounded-lg">
                              <div className="text-sm text-gray-600">
                                <AlertCircle className="w-4 h-4 inline mr-2" />
                                附近限制可能影响申请，建议联系客服确认具体要求
                              </div>
                            </div>
                          )}
                          {conclusion === 'available' && (
                            <div className="mt-4 p-3 bg-white/50 rounded-lg">
                              <div className="text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 inline mr-2" />
                                您已满足申请基本条件，可以开始填写申请表
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="mt-6" ref={materialsRef}>
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-800">材料清单</h3>
                  {state?.action === 'viewMaterials' && (
                    <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full">
                      当前定位
                    </span>
                  )}
                  {showDraftPanel && (
                    <span className="ml-2 text-xs text-gray-500">
                      已准备: {preparedCount}/{materialsChecklist.length}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {materialsChecklist.map((item, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        showDraftPanel ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer' : 'bg-gray-50'
                      }`}
                      onClick={() => showDraftPanel && handleToggleMaterial(index)}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        item.prepared 
                          ? 'bg-success-500 border-success-500' 
                          : 'border-gray-300'
                      }`}>
                        {item.prepared && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                      </div>
                      <span className={`text-gray-700 ${item.prepared ? 'line-through text-gray-400' : ''}`}>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-warning-600" />
                  <h3 className="font-semibold text-gray-800">常见限制</h3>
                </div>
                <div className="space-y-2">
                  {activeRule.restrictions.map((restriction, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{restriction}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-800">适用场景示例</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeRule.examples.map((example, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setShowDraftPanel(!showDraftPanel)}
                  className="w-full p-4 bg-primary-50 border border-primary-200 rounded-xl hover:bg-primary-100 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Edit3 className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-gray-800">申请预填草稿</span>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showDraftPanel ? 'rotate-90' : ''}`} />
                </button>

                {showDraftPanel && (
                  <div className="mt-4 p-6 bg-white border border-gray-200 rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">申请日期</label>
                        <input
                          type="date"
                          value={draftDate}
                          onChange={(e) => setDraftDate(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">时段选择</label>
                        <select
                          value={draftTimeSlot}
                          onChange={(e) => setDraftTimeSlot(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">请选择时段</option>
                          <option value="morning">上午 (06:00-12:00)</option>
                          <option value="afternoon">下午 (12:00-18:00)</option>
                          <option value="evening">晚上 (18:00-22:00)</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">材料准备状态</label>
                      <p className="text-xs text-gray-500 mb-3">点击材料项标记是否已准备</p>
                    </div>

                    <div className="flex items-center justify-between mb-4 pb-4 border-b">
                      <div className="text-sm text-gray-500">
                        已保存的草稿: {drafts.length} 条
                      </div>
                      {selectedDraft && (
                        <button
                          onClick={handleDeleteDraft}
                          className="text-sm text-danger-600 hover:text-danger-700 flex items-center space-x-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>删除当前草稿</span>
                        </button>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveDraft}
                        disabled={isSaving}
                        className="flex-1 btn-primary flex items-center justify-center space-x-2"
                      >
                        {isSaving ? (
                          <>
                            <Save className="w-4 h-4 animate-spin" />
                            <span>保存中...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>{selectedDraft ? '更新草稿' : '保存草稿'}</span>
                          </>
                        )}
                      </button>
                      <button
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        继续申请
                      </button>
                    </div>

                    {selectedDraft && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            上次保存: {new Date(selectedDraft.updatedAt).toLocaleString('zh-CN')}
                          </span>
                          <span className="text-success-600 flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>已保存</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
