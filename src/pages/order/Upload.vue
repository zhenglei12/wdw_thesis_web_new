<template>
  <a-modal :visible="visible" title="上传稿件" destroyOnClose :confirmLoading="loading" @cancel="close" @ok="submit">
    <a-form-model ref="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
      <a-form-model-item label="内容类型" required>
        <a-select
          v-model="form.manuscript_content"
          allowClear
          :dropdownMatchSelectWidth="false"
          :options="contentOpts"
        />
      </a-form-model-item>
      <a-form-model-item label="稿件进度" required>
        <a-select v-model="form.manuscript_plan" allowClear :dropdownMatchSelectWidth="false" :options="planOpts" />
      </a-form-model-item>
      <a-form-model-item label="交稿字数" required>
        <a-input-number v-model="form.alter_word" :min="0" :precision="0" />
      </a-form-model-item>
      <a-form-model-item label="编辑留言">
        <a-textarea v-model="form.edit_remark" :autoSize="{ minRows: 3, maxRows: 5 }" placeholder="留言" />
      </a-form-model-item>
      <a-upload-dragger :fileList="fileList" :customRequest="request" :remove="remove">
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">点击或拖拽文件到此区域</p>
      </a-upload-dragger>
    </a-form-model>
  </a-modal>
</template>

<script>
import editMixin from "../../mixins/edit";
import OrderApi from "../../apis/order";
import upload from "../../libs/upload";
import { planMap, contentMap } from "./mapping";
import utils from "../../libs/utils";

export default {
  mixins: [editMixin],
  data() {
    return {
      loading: false,
      fileList: [],
      form: {},
      planOpts: utils.mapToArray(planMap),
      contentOpts: utils.mapToArray(contentMap),
    };
  },
  watch: {
    visible() {
      this.form = {
        id: this.R,
      };
    },
  },
  methods: {
    remove() {
      this.fileList = [];
    },
    request(e) {
      this.fileList = [e.file];
    },
    submit() {
      this.loading = true;
      upload.uploadList(this.fileList, ["thesiswdw"]).then(() => {
        this.form.manuscript = upload.getRources(this.fileList)[0];
        OrderApi.upload({ ...this.form })
          .then((res) => {
            this.$message.success("保存成功");
            this.$emit("refresh", res);
            this.close();
          })
          .finally(() => (this.loading = false));
      });
    },
  },
};
</script>
