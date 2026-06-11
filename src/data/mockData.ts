import { Area, Application, Rule, Consultation, Announcement, QuickEntry } from '../types';

export const mockAreas: Area[] = [
  {
    id: '1',
    name: 'A区-通用空域',
    type: 'available',
    description: '适用于小型无人机作业、航拍测绘、物流配送等通用场景',
    applicableTime: '工作日 08:00-18:00',
    coordinates: 'A1',
    status: '可申请',
  },
  {
    id: '2',
    name: 'B区-限制空域',
    type: 'restricted',
    description: '需特殊审批，适用于中型无人机及特定作业需求',
    applicableTime: '工作日 09:00-17:00',
    coordinates: 'B1',
    status: '限制',
  },
  {
    id: '3',
    name: 'C区-禁飞区域',
    type: 'forbidden',
    description: '安全敏感区域，禁止一切飞行活动',
    applicableTime: '全天',
    coordinates: 'C1',
    status: '禁飞',
  },
  {
    id: '4',
    name: 'D区-临时开放区',
    type: 'available',
    description: '季节性开放，适用于农业植保、环境监测',
    applicableTime: '每年4-10月 06:00-20:00',
    coordinates: 'D1',
    status: '可申请',
  },
  {
    id: '5',
    name: 'E区-科研空域',
    type: 'restricted',
    description: '仅限科研机构申请，用于实验试飞',
    applicableTime: '预约制',
    coordinates: 'E1',
    status: '限制',
  },
];

export const mockApplications: Application[] = [
  {
    id: '1',
    applicationNo: 'KY2024001',
    status: 'approved',
    statusText: '已批复',
    submitTime: '2024-01-15 10:00',
    updateTime: '2024-01-18 14:30',
    areaName: 'A区-通用空域',
    applicant: 'XX科技有限公司',
    progressSteps: [
      { title: '申请提交', status: 'completed', time: '2024-01-15 10:00', description: '申请已提交' },
      { title: '材料受理', status: 'completed', time: '2024-01-15 11:30', description: '材料齐全，已受理' },
      { title: '部门审核', status: 'completed', time: '2024-01-17 10:00', description: '审核通过' },
      { title: '最终批复', status: 'completed', time: '2024-01-18 14:30', description: '已批复同意' },
    ],
  },
  {
    id: '2',
    applicationNo: 'KY2024002',
    status: 'reviewing',
    statusText: '审核中',
    submitTime: '2024-01-16 14:00',
    updateTime: '2024-01-17 09:00',
    areaName: 'B区-限制空域',
    applicant: 'YY航空服务公司',
    progressSteps: [
      { title: '申请提交', status: 'completed', time: '2024-01-16 14:00', description: '申请已提交' },
      { title: '材料受理', status: 'completed', time: '2024-01-16 15:30', description: '材料齐全，已受理' },
      { title: '部门审核', status: 'current', time: '2024-01-17 09:00', description: '正在审核中' },
      { title: '最终批复', status: 'pending', description: '等待批复' },
    ],
  },
  {
    id: '3',
    applicationNo: 'KY2024003',
    status: 'correction',
    statusText: '需要补正',
    submitTime: '2024-01-17 09:00',
    updateTime: '2024-01-17 11:00',
    areaName: 'D区-临时开放区',
    applicant: 'ZZ农业科技',
    progressSteps: [
      { title: '申请提交', status: 'completed', time: '2024-01-17 09:00', description: '申请已提交' },
      { title: '材料受理', status: 'completed', time: '2024-01-17 10:00', description: '受理中' },
      { title: '补正通知', status: 'current', time: '2024-01-17 11:00', description: '请补充飞行安全方案' },
      { title: '部门审核', status: 'pending', description: '等待补正材料' },
      { title: '最终批复', status: 'pending', description: '等待批复' },
    ],
  },
];

export const mockRules: Rule[] = [
  {
    id: '1',
    category: '无人机作业',
    materials: ['空域使用申请表', '企业营业执照', '无人机资质证明', '飞行方案', '安全保障措施'],
    advanceDays: 3,
    restrictions: ['限高100米', '禁飞时段12:00-14:00', '需避开人员密集区域'],
    examples: ['航拍测绘', '物流配送', '电力巡检'],
  },
  {
    id: '2',
    category: '直升机飞行',
    materials: ['空域使用申请表', '运营资质证书', '飞行员执照', '飞行计划', '应急方案'],
    advanceDays: 7,
    restrictions: ['仅限指定起降点', '需提前报备航线', '恶劣天气禁飞'],
    examples: ['医疗救援', '商务飞行', '物资运输'],
  },
  {
    id: '3',
    category: '热气球飞行',
    materials: ['空域使用申请表', '热气球资质证明', '飞行员执照', '气象证明', '安全协议'],
    advanceDays: 5,
    restrictions: ['仅限日出后2小时内', '风速限制≤3m/s', '需指定降落区域'],
    examples: ['观光旅游', '活动表演', '广告宣传'],
  },
  {
    id: '4',
    category: '科研试飞',
    materials: ['空域使用申请表', '科研机构证明', '项目批准文件', '试飞方案', '保险证明'],
    advanceDays: 10,
    restrictions: ['仅限指定科研区域', '需配备地面监控', '需提前通报'],
    examples: ['新机测试', '设备验证', '数据采集'],
  },
];

export const mockConsultations: Consultation[] = [
  {
    id: '1',
    question: '无人机飞行是否需要购买保险？',
    category: '政策咨询',
    submitTime: '2024-01-10 15:00',
    reply: '是的，所有空域申请均需提供第三者责任险证明，保额不低于50万元。',
    replyTime: '2024-01-10 16:30',
    status: 'replied',
  },
  {
    id: '2',
    question: '周末是否可以申请空域使用？',
    category: '时间咨询',
    submitTime: '2024-01-12 09:30',
    reply: '周末仅开放A区和D区，需提前申请，审批时间可能延长。',
    replyTime: '2024-01-12 11:00',
    status: 'replied',
  },
  {
    id: '3',
    question: '申请材料需要原件还是复印件？',
    category: '材料咨询',
    submitTime: '2024-01-14 14:00',
    reply: '暂无回复',
    status: 'pending',
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: '关于2024年春节期间空域调整的通知',
    content: '春节期间（2月9日-2月17日），部分区域空域使用时间调整为09:00-17:00，请提前做好申请安排。',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: '新增D区临时开放区申请通道',
    content: 'D区已开放春季申请通道，适用于农业植保、环境监测等场景，欢迎符合条件的企业申请。',
    date: '2024-01-10',
  },
  {
    id: '3',
    title: '安全培训通知',
    content: '本月20日将举办无人机安全操作培训，有意参加的企业请于18日前报名。',
    date: '2024-01-08',
  },
];

export const mockQuickEntries: QuickEntry[] = [
  {
    id: '1',
    title: '区域查询',
    description: '查看可申请、限制、禁飞区域',
    icon: 'map',
    path: '/map',
  },
  {
    id: '2',
    title: '申请规则',
    description: '了解各类飞行活动申请要求',
    icon: 'book-open',
    path: '/rules',
  },
  {
    id: '3',
    title: '进度查询',
    description: '查询申请办理进度',
    icon: 'clipboard-list',
    path: '/progress',
  },
  {
    id: '4',
    title: '在线咨询',
    description: '提交问题获取专业解答',
    icon: 'message-circle',
    path: '/consult',
  },
];
