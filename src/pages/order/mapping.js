// 订单状态
export const orderStatusMap = {
  "-1": "等待安排",
  1: "写作进行",
  2: "打回修改",
  3: "订单完成",
  4: "提交客户",
  5: "已经交稿",
};

// 任务类型
export const taskTypeMap = {
  1: "文章写作",
  2: "文章修改",
  3: "润色降重",
  4: "Office服务",
  5: "其他服务",
};

// 支付方式
export const payTypeMap = {
  1: "支付宝",
  2: "微信",
  3: "银行转账",
  4: "对公账户",
  5: "线上支付",
};

// 学历
// 1，专科，2本科，3硕士，4其他
export const eduMap = {
  1: "专科",
  2: "本科",
  3: "硕士",
  4: "其他",
};

// 稿件进度：1 定制题目  2提纲写作  3开题写作  4综述写作 5 文章写作  6文章修改  7其他制作
export const planMap = {
  1: "定制题目",
  2: "提纲写作",
  3: "开题写作",
  4: "综述写作",
  5: "文章写作",
  6: "文章修改",
  7: "其他制作",
};

// 论文，征文，office，其他
export const contentMap = {
  论文: "论文",
  征文: "征文",
  office: "office",
  其他: "其他",
};

// 1时候是定金审核2为尾款审核
export const auditTypeMap = {
  1: "定金审核",
  2: "尾款审核",
};

export const auditStatusMap = {
  1: "是",
  "-1": "否",
};
