export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">空域审批公众查询系统</h3>
            <p className="text-sm leading-relaxed">
              为园区企业和飞行服务商提供便捷的空域查询、申请进度追踪服务。
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/map" className="hover:text-white transition-colors">区域查询</a></li>
              <li><a href="/rules" className="hover:text-white transition-colors">申请规则</a></li>
              <li><a href="/progress" className="hover:text-white transition-colors">进度查询</a></li>
              <li><a href="/consult" className="hover:text-white transition-colors">在线咨询</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">联系我们</h3>
            <p className="text-sm">咨询热线：400-888-8888</p>
            <p className="text-sm">工作时间：周一至周五 08:30-17:30</p>
            <p className="text-sm mt-2">邮箱：service@airspace.gov.cn</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>© 2024 空域管理局 版权所有</p>
        </div>
      </div>
    </footer>
  );
}
