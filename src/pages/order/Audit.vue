<template>
  <a-modal
    :visible="visible"
    title="财务审核"
    destroyOnClose
    :maskClosable="false"
    :confirmLoading="loading"
    @cancel="close"
    @ok="submit"
  >
    <a-form-model ref="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
      <a-form-model-item label="状态">
        <a-select v-model="form.type" allowClear :dropdownMatchSelectWidth="false" :options="typeOpts" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import editMixin from "../../mixins/edit";
import OrderApi from "../../apis/order";
import { auditTypeMap } from "./mapping";
import utils from "../../libs/utils";

export default {
  mixins: [editMixin],
  data() {
    return {
      loading: false,
      form: {},
      typeOpts: utils.mapToArray(auditTypeMap),
    };
  },
  watch: {
    visible(e) {
      if (e) {
        this.form = {
          id: this.R.id,
          type: this.R.type,
        };
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      OrderApi.audit({ ...this.form })
        .then((res) => {
          this.$message.success("保存成功");
          this.$emit("refresh", res);
          this.close();
        })
        .finally(() => (this.loading = false));
    },
    cusUpload({ file }) {
      this.fileList = [file];
    },
  },
};
</script>
