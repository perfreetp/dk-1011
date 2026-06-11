import { useState } from 'react';
import { BookOpen, FileText, Clock, AlertCircle, Lightbulb, ChevronRight } from 'lucide-react';
import { mockRules } from '../data/mockData';

export default function RulesPage() {
  const [activeTab, setActiveTab] = useState(mockRules[0].category);

  const activeRule = mockRules.find((rule) => rule.category === activeTab) || mockRules[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">申请规则</h1>
          <p className="text-gray-600">了解各类飞行活动的申请要求、材料清单和限制条件</p>
        </div>

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

              <div className="mt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-800">材料清单</h3>
                </div>
                <div className="space-y-3">
                  {activeRule.materials.map((material, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{material}</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
