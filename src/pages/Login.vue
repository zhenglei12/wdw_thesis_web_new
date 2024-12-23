<template>
  <div class="wraper">
    <div class="login-card" @keydown.enter="login">
      <div class="top">
        <img class="img" src="@/assets/login-logo.png" />
      </div>
      <a-form-model ref="form" class="login-form" :model="form" :rules="rules">
        <h1 class="title">予之文化管理系统</h1>
        <a-form-model-item prop="username">
          <a-input v-model="form.username" placeholder="用户名" allow-clear>
            <a-icon slot="prefix" type="user" class="login-form-icon" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <a-input type="password" v-model="form.password" placeholder="密码" allow-clear>
            <a-icon slot="prefix" type="lock" class="login-form-icon" />
          </a-input>
        </a-form-model-item>
        <a-button class="login-submit" size="large" type="primary" block :loading="loading" @click="login"
          >登录</a-button
        >
      </a-form-model>
    </div>
    <div class="code">
      <a href="https://beian.miit.gov.cn/" target="_blank">粤ICP备2023044809号-1</a>
    </div>
  </div>
</template>

<script>
const rules = {
  username: [
    {
      required: true,
      message: "用户名不能为空！",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "密码不能为空！",
      trigger: "blur",
    },
  ],
};

export default {
  data() {
    return {
      rules,
      loading: false,
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      this.loading = true;
      this.$refs.form
        .validate()
        .then(() => {
          return this.$auth.login({ ...this.form }).then(() => {
            this.$message.success("登录成功");
            this.$router.push("/");
          });
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style lang="less" scoped>
.wraper {
  height: 100%;
  background-image: url("~@/assets/login.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.login {
  &-card {
    position: absolute;
    width: 350px;
    box-sizing: content-box;
    top: 40%;
    left: 70%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    border-radius: 16px;
    text-align: center;
    overflow: hidden;

    .top {
      padding: 20px;
      background: #f6edea;

      .img {
        height: 80px;
      }
    }
  }

  &-form {
    width: 100%;
    padding: 32px 32px 40px;

    .title {
      text-align: center;
      margin-bottom: 20px;
    }

    &-icon {
      color: rgba(0, 0, 0, 0.25);
    }
  }

  &-submit {
    margin-top: 10px;
    background: #eb652e;
    border-color: #eb652e;
  }
}

.code {
  position: absolute;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);

  a {
    color: #ffffff;
  }
}
</style>
