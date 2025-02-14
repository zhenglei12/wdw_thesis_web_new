<template>
  <div>
    <div class="cus-table-header">
      <list-search v-model="search" :condition="condition" :collection="collection"></list-search>
    </div>
    <div class="cus-table-header">
      <div class="statistic">
        <table class="table" v-if="statistic && !$auth.isEditor" v-acl="'order-statistics'">
          <tr>
            <td>{{ statistic.year }}总金额</td>
            <td>已回收金额</td>
            <td>未回收金额</td>
            <td>退款金额</td>
            <td>{{ statistic.month }}月总金额</td>
            <td>已回收金额</td>
            <td>未回收金额</td>
            <td>{{ statistic.month }}月售后金额</td>
          </tr>
          <tr>
            <td align="center">{{ statistic.amount_count }}</td>
            <td align="center">{{ statistic.received_amount_count }}</td>
            <td align="center">{{ statistic.not_received_amount_count }}</td>
            <td align="center">{{ statistic.after_banlace_count }}</td>
            <td align="center">{{ statistic.month_amount_count }}</td>
            <td align="center">{{ statistic.month_received_amount_count }}</td>
            <td align="center">{{ statistic.not_month_received_amount_count }}</td>
            <td align="center">{{ statistic.month_after_banlace_count }}</td>
          </tr>
        </table>
      </div>
      <a-button-group>
        <a-button v-acl="'order-export'" @click="toExport()">导出</a-button>
        <a-button v-acl="'order-add'" type="primary" @click="toEdit()">新增</a-button>
      </a-button-group>
    </div>
    <a-table
      :columns="columns"
      :data-source="collection.list"
      :loading="collection.loading"
      :pagination="{
        total: collection.total,
        current: collection.page,
        pageSize: collection.pageSize,
        showSizeChanger: true,
      }"
      :rowClassName="getRowClass"
      bordered
      rowKey="id"
      @change="listChange"
    >
      <template slot="money" slot-scope="data">
        {{ data.amount - data.received_amount > 0 ? data.amount - data.received_amount : "已结清" }}
      </template>
      <template slot="image" slot-scope="data">
        <img v-if="data" :src="data" alt="图片" class="image" @click="toPreview(data)" />
      </template>
      <template slot="ask" slot-scope="data">
        <a v-if="data" @click="toDownload(data)">下载附件</a>
        <span v-else>无附件</span>
      </template>
      <template slot="file" slot-scope="data">
        <a v-if="data" @click="toDownload(data)">下载稿件</a>
        <span v-else>未提交</span>
      </template>
      <template slot="check" slot-scope="data">
        <span v-if="data == 1" style="color: red">是</span>
        <span v-else>否</span>
      </template>
      <template slot="operate" slot-scope="data">
        <div class="actions">
          <!-- <a-button v-acl="'order-update'" type="link" @click="toEdit(data)">编辑</a-button> -->
          <a-icon v-acl="'order-update'" type="edit" title="编辑" @click="toEdit(data)" />
          <!-- <a-button v-acl="'order-edit.name'" type="link" @click="toAllot(data.id)">分配编辑</a-button> -->
          <a-icon v-acl="'order-edit.name'" type="api" title="分配编辑" @click="toAllot(data.id)" />
          <!-- <a-button v-acl="'order-manuscript'" type="link" @click="toUpload(data.id)">上传稿件</a-button> -->
          <a-icon v-acl="'order-manuscript'" type="upload" title="上传稿件" @click="toUpload(data.id)" />
          <!-- <a-button v-acl="'order-logs'" type="link" @click="toLog(data.id)">日志</a-button> -->
          <a-icon v-acl="'order-logs'" type="file" title="日志" @click="toLog(data.id)" />
          <a-popconfirm v-acl="'order-delete'" title="确认删除？" @confirm="toDelete(data.id)">
            <!-- <a-button type="link">删除</a-button> -->
            <a-icon type="delete" title="删除" />
          </a-popconfirm>
          <!-- <a-button v-acl="'order-status'" type="link" @click="toStatus(data)">修改状态</a-button> -->
          <a-icon v-acl="'order-status'" type="swap" title="修改状态" @click="toStatus(data)" />
          <!-- <a-button v-acl="'order-after'" type="link" @click="toAfter(data)">售后</a-button> -->
          <a-icon v-acl="'order-after'" type="rocket" title="售后" @click="toAfter(data)" />
          <!-- <a-button v-acl="'order-hard.grade'" type="link" @click="toGrade(data)">难度</a-button> -->
          <a-icon v-acl="'order-hard.grade'" type="stock" title="难度" @click="toGrade(data)" />
          <!-- <a-button v-acl="'order-check'" type="link" @click="toAudit(data)">财务审核</a-button> -->
          <a-icon v-acl="'order-check'" type="safety" title="财务审核" @click="toAudit(data)" />
        </div>
      </template>
    </a-table>

    <!-- 编辑 -->
    <cus-edit v-model="editVisible" :data="temp" @refresh="_getList"></cus-edit>

    <!-- 分配编辑 -->
    <cus-allot v-model="allotVisible" :data="temp" @refresh="_getList"></cus-allot>

    <!-- 修改状态 -->
    <cus-status v-model="statusVisible" :data="temp" @refresh="_getList"></cus-status>

    <!-- 上传稿件 -->
    <cus-upload v-model="uploadVisible" :data="temp" @refresh="_getList"></cus-upload>

    <!-- 图片预览 -->
    <img-preview v-model="previewVisible" :urls="previewUrl"></img-preview>

    <cus-log v-model="logVisible" :data="temp"></cus-log>

    <!-- 售后 -->
    <cus-after v-model="afterVisible" :data="temp" @refresh="_getList" />

    <!-- 难度 -->
    <cus-grade v-model="gradeVisible" :data="temp" @refresh="_getList" />

    <!-- 审核 -->
    <cus-audit v-model="auditVisible" :data="temp" @refresh="_getList" />
  </div>
</template>

<script>
const condition = [
  {
    key: "id",
    placeholder: "ID",
  },
  {
    key: "subject",
    placeholder: "题目",
  },
  {
    key: "word_number",
    placeholder: "字数",
  },
  {
    key: "name",
    placeholder: "客户姓名",
  },
  {
    key: "task_type",
    type: "select",
    options: Utils.mapToArray(taskTypeMap),
    placeholder: "任务类型",
  },
  {
    key: "staff_name",
    type: "select",
    placeholder: "客服名称",
    options: [],
    labelKey: "name",
    valueKey: "name",
  },
  {
    key: "edit_name",
    type: "select",
    placeholder: "编辑名称",
    options: [],
    labelKey: "name",
    valueKey: "name",
  },
  {
    key: "type",
    type: "select",
    placeholder: "审核状态",
    options: Utils.mapToArray(auditTypeMap),
  },
  {
    key: "manuscript_content",
    type: "select",
    placeholder: "内容类型",
    options: Utils.mapToArray(contentMap),
  },
  {
    key: "status",
    type: "select",
    options: Utils.mapToArray(orderStatusMap),
    placeholder: "状态",
  },
  {
    key: "finance_check",
    type: "select",
    options: Utils.mapToArray(auditStatusMap),
    placeholder: "财务审核",
  },
  {
    key: "trail_check",
    type: "select",
    options: Utils.mapToArray(auditStatusMap),
    placeholder: "尾款审核",
  },
  {
    key: "_date",
    type: "date-in",
  },
  {
    key: "_today",
    type: "select",
    placeholder: "今日任务",
    options: [{ label: "是", value: true }],
  },
  // {
  //   key: "_time",
  //   type: "date-in",
  //   placeholder: ["开始截止时间", "结束截止时间"],
  // },
];

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "店铺账号",
    dataIndex: "shop_name",
  },
  {
    title: "任务类型",
    dataIndex: "task_type",
    customRender: (v) => taskTypeMap[v] ?? "-",
  },
  {
    title: "学历",
    dataIndex: "education",
    customRender: (v) => eduMap[v] ?? "-",
  },
  {
    title: "专业名称",
    dataIndex: "major_name",
  },
  {
    title: "客户名称",
    dataIndex: "name",
  },
  {
    title: "客户电话",
    hidden: ["edit"],
    dataIndex: "phone",
  },
  {
    title: "题目",
    width: 300,
    dataIndex: "subject",
  },
  {
    title: "字数",
    dataIndex: "word_number",
  },
  {
    title: "查重",
    dataIndex: "duplicate_checking",
  },
  {
    title: "写作要求",
    width: 300,
    dataIndex: "task_ask",
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
  },
  {
    title: "截止时间",
    dataIndex: "submission_time",
  },
  {
    title: "相关附件",
    dataIndex: "attachment",
    scopedSlots: { customRender: "ask" },
  },
  {
    title: "稿件状态",
    dataIndex: "status",
    customRender: (v) => orderStatusMap[v] ?? "-",
  },
  {
    title: "稿件下载",
    dataIndex: "manuscript",
    scopedSlots: { customRender: "file" },
  },
  {
    title: "收款账户",
    hidden: ["edit"],
    dataIndex: "receipt_account_new",
  },
  {
    title: "订单总额",
    hidden: ["edit"],
    dataIndex: "amount",
  },
  {
    title: "已收定金",
    hidden: ["edit"],
    dataIndex: "received_amount",
  },
  {
    title: "定金截图",
    hidden: ["edit"],
    dataIndex: "pay_img",
    scopedSlots: { customRender: "image" },
  },
  {
    title: "尾款截图",
    hidden: ["edit"],
    dataIndex: "receipt_account",
    scopedSlots: { customRender: "image" },
  },
  {
    title: "退款金额",
    hidden: ["edit"],
    dataIndex: "othen_amount",
  },
  {
    title: "退款凭证",
    hidden: ["edit"],
    dataIndex: "after_img",
    scopedSlots: { customRender: "image" },
  },
  {
    title: "备注说明",
    hidden: ["finance", "admin"],
    dataIndex: "remark",
  },
  {
    title: "定金审核",
    dataIndex: "finance_check",
    scopedSlots: { customRender: "check" },
  },
  {
    title: "尾款审核",
    dataIndex: "trail_check",
    scopedSlots: { customRender: "check" },
  },
  {
    title: "责任编辑",
    dataIndex: "edit_name",
  },
  {
    title: "稿件进度",
    dataIndex: "manuscript_plan",
    customRender: (v) => planMap[v] ?? "-",
  },
  {
    title: "编辑留言",
    dataIndex: "edit_remark",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "operate" },
  },
];

import listMixin from "../../mixins/list";
import OrderApi from "../../apis/order";
import PublicApi from "../../apis/public";
import Utils from "../../libs/utils";
import CusEdit from "./Edit";
import CusStatus from "./Status";
import CusAllot from "./Allot";
import CusUpload from "./Upload";
import CusLog from "./Log";
import CusAfter from "./After";
import CusGrade from "./Grade";
import CusAudit from "./Audit";
import { taskTypeMap, orderStatusMap, eduMap, auditTypeMap, contentMap, planMap, auditStatusMap } from "./mapping";
import * as moment from "moment";

export default {
  components: {
    CusEdit,
    CusAllot,
    CusStatus,
    CusUpload,
    CusLog,
    CusAfter,
    CusGrade,
    CusAudit,
  },
  mixins: [listMixin],
  data() {
    return {
      condition,
      columns,
      taskTypeMap,
      orderStatusMap,
      statistic: null,
      numbers: null,
      editVisible: false,
      statusVisible: false,
      allotVisible: false,
      previewVisible: false,
      uploadVisible: false,
      logVisible: false,
      afterVisible: false,
      gradeVisible: false,
      auditVisible: false,
      previewUrl: "",
      editorList: [],
      download: false,
    };
  },
  created() {
    PublicApi.roleUserList("staff").then((res) => {
      let temp = this.condition.find((_) => _.key == "staff_name");
      if (temp) {
        temp.options = res.list;
      }
    });
    PublicApi.roleUserList("edit").then((res) => {
      let temp = this.condition.find((_) => _.key == "edit_name");
      this.editorList = res.list;
      if (temp) {
        temp.options = res.list;
      }
    });
    if (this.$auth.isService) {
      this.condition = this.condition.filter((_) => _.key != "staff_name");
    }
    if (this.$auth.isEditor) {
      this.condition = this.condition.filter((_) => _.key != "edit_name");
      this.columns = this.columns.filter((_) => {
        if (_.hidden) {
          return !~_.hidden.indexOf("edit");
        }
        return true;
      });
    }
  },
  methods: {
    getStatistic() {
      OrderApi.statistic().then((res) => {
        res.not_received_amount_count = (res.amount_count - res.received_amount_count).toFixed(2);
        res.not_month_received_amount_count = (res.month_amount_count - res.month_received_amount_count).toFixed(2);
        const date = new Date();
        res.year = date.getFullYear();
        res.month = (date.getMonth() + 1).toString().padStart(2, "0");
        this.statistic = res;
      });
      OrderApi.numbers().then((res) => {
        this.numbers = res.count_num;
      });
    },
    getRowClass(data) {
      switch (data.status) {
        case "1":
          return "bg-yellow";
        case "2":
          return "bg-pink";
        case "3":
          return "bg-purple";
        case "5":
          return "bg-blue";
        case "4":
          return "bg-green";
        default:
          break;
      }
    },
    toStatus(e) {
      this.temp = e;
      this.statusVisible = true;
    },
    toAllot(e) {
      this.temp = {
        id: e,
        editorList: this.editorList,
      };
      this.allotVisible = true;
    },
    toEdit(e) {
      this.temp = e;
      this.editVisible = true;
    },
    toAudit(e) {
      this.temp = e;
      this.auditVisible = true;
    },
    toPreview(e) {
      this.previewUrl = e;
      this.previewVisible = true;
    },
    toDownload(e) {
      if (this.download) {
        return this.$message.warn("正在下载...");
      }
      this.download = true;
      Utils.download(e, e.split("/").pop())
        .then(() => {
          this.$message.success("下载完成");
        })
        .finally(() => (this.download = false));
    },
    toUpload(e) {
      this.temp = e;
      this.uploadVisible = true;
    },
    toDelete(e) {
      OrderApi.remove(e).then(() => {
        this.$message.success("操作成功");
        this._getList();
      });
    },
    toAfter(e) {
      this.temp = e;
      this.afterVisible = true;
    },
    toGrade(e) {
      this.temp = e;
      this.gradeVisible = true;
    },
    toLog(e) {
      this.temp = e;
      this.logVisible = true;
    },
    _getList() {
      this.getStatistic();
      this.collection.loading = true;
      OrderApi.list(
        Object.assign(
          {
            page: this.collection.page,
            pageSize: this.collection.pageSize,
          },
          this._getSearch()
        )
      ).then((res) => {
        this.collection.list = res.list;
        this.collection.total = res.total;
        this.collection.loading = false;
      });
    },
    _getSearch() {
      const _search = JSON.parse(JSON.stringify(this.search));
      if (!_search) return;
      if (_search._date) {
        _search.created_at = _search._date[0];
        _search.end_time = _search._date[1];
      }
      if (_search._today) {
        _search.submission_time = moment().format("YYYY-MM-DD");
      }
      return _search;
    },
    toExport() {
      OrderApi.export(
        Object.assign(
          {
            page: this.collection.page,
            pageSize: this.collection.pageSize,
          },
          this._getSearch()
        )
      ).then((res) => {
        if (res.type === "application/json") {
          try {
            const render = new FileReader();
            render.readAsText(res);
            render.onload = (e) => {
              const json = JSON.parse(e.target.result);
              this.$notification.error({
                message: "业务错误",
                description: json.message,
              });
            };
          } catch {
            // eslint-disable-next-line
          }
          return;
        }
        Utils.export(res, "订单列表").then(() => {
          this.$message.success("下载完成");
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.statistic {
  font-size: 20px;
  color: red;

  span {
    margin-left: 20px;

    &:first-of-type {
      margin: 0;
    }
  }
}

.image {
  max-width: 60px;
  max-height: 60px;
  cursor: pointer;
}

.table {
  td {
    padding-right: 32px;
  }
}

/deep/ .bg {
  &-pink {
    background-color: #fbe5e2;
  }

  &-green {
    background-color: #75f98d;
  }

  &-yellow {
    background-color: #fbfd87;
  }

  &-blue {
    background-color: #a3ccfa;
  }

  &-purple {
    background-color: #c08dc0;
  }
}

/deep/ tr:hover > td {
  background-color: inherit !important;
}

/deep/ tr > th {
  white-space: nowrap;
}

/deep/ tr > td {
  max-width: 300px;
}

.actions {
  display: flex;
  gap: 12px;
}
</style>
