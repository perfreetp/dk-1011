import { useState } from 'react';
import { Star, Send, MapPin, AlertCircle, CheckCircle, ThumbsUp, ThumbsDown, Image } from 'lucide-react';

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errorType, setErrorType] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorSubmitted, setErrorSubmitted] = useState(false);

  const errorTypes = [
    { value: 'area', label: '区域信息错误' },
    { value: 'time', label: '时间信息错误' },
    { value: 'rule', label: '规则信息错误' },
    { value: 'other', label: '其他错误' },
  ];

  const handleSubmitFeedback = () => {
    if (rating === 0 || !comment.trim()) {
      return;
    }
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
    setErrorSubmitted(true);
    setTimeout(() => {
      setErrorSubmitted(false);
      setErrorType('');
      setErrorDetails('');
    }, 3000);
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
