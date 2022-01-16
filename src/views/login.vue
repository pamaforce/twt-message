<template>
  <v-app class="bg">
    <v-main>
      <v-container py-5>
        <v-layout align-center justify-center py-3>
          <v-flex xs12 sm8 md4>
            <v-card flat class="px-2 pb-3 login-card">
              <v-card-text>
                <v-layout justify-center pt-2>
                  <v-avatar size="60px">
                    <img src="@/assets/logo.png" alt="twt" />
                  </v-avatar>
                </v-layout>
                <v-layout justify-center py-3>
                  <div class="headline">微北洋消息管理后台登录</div>
                </v-layout>
                <v-tabs centered fixed-tabs v-model="tab">
                  <v-tabs-slider color="#1E88E5"> </v-tabs-slider>
                  <v-tab href="#tab-1">密码登录</v-tab>
                  <v-tab href="#tab-2">短信登录</v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                  <v-tab-item value="tab-1" style="paddingtop: 20px">
                    <v-form>
                      <v-text-field
                        name="username"
                        label="邮箱/用户名/学号"
                        type="text"
                        required
                        v-model="username"
                        :rules="usernameRules"
                      ></v-text-field>
                      <v-text-field
                        id="password"
                        name="密码"
                        label="密码"
                        :append-icon="showPsw ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPsw = !showPsw"
                        :type="showPsw ? 'text' : 'password'"
                        required
                        v-model="password"
                        :rules="passwordRules"
                      ></v-text-field>
                    </v-form>
                    <v-card-actions>
                      <v-btn block depressed color="info" @click="loginCommon"
                        >登录</v-btn
                      >
                    </v-card-actions>
                  </v-tab-item>
                  <v-tab-item value="tab-2" style="paddingtop: 20px">
                    <v-form>
                      <v-text-field
                        name="phone"
                        label="手机号"
                        type="text"
                        required
                        v-model="phone"
                        :rules="phoneRules"
                      >
                        <template v-slot:append>
                          <v-btn @click="sendVerifyCode" text>发送验证码</v-btn>
                        </template>
                      </v-text-field>
                      <v-text-field
                        autocomplete="off"
                        id="verify"
                        name="验证码"
                        label="验证码"
                        type="text"
                        required
                        v-model="verify"
                        :rules="verifyRules"
                      ></v-text-field>
                    </v-form>
                    <v-card-actions>
                      <v-btn block depressed color="info" @click="loginPhone"
                        >登录</v-btn
                      >
                    </v-card-actions>
                  </v-tab-item>
                </v-tabs-items>
                <div class="func-group">
                  <a href="https://i.twt.edu.cn/">注册账号</a>
                  <a @click="dialog = true">忘记密码？去重置</a>
                </div>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
    <div class="footer">
      <div class="copyright">
        <!-- <svg height="24" viewBox="0 0 771.9 615.74">
          <path
            d="M687,202.6c-36.9-19.1-108-12-128,18-6.9-2.5-9.6-10-15-14a209.76,209.76,0,0,0-45-26c-56.6-23.3-120.1-1-155,25-11.2,8.3-17.8,23.1-29,31v3c30.5,4.2,55.8,16.5,77,30,8.3,5.3,19.4,10.1,25,18,9.7-1.9,17.3-10.3,26-14,18.5-7.8,39.1-9.2,61-14,17.1-3.7,52.9,6.6,64,11,8,3.2,14.7,4.2,22,8,43.3,22.6,86.4,73.2,90,135,29.4-13.6,51.3-33.9,64-64C771.31,284.7,729.31,224.5,687,202.6Zm-121,97c-13.5-5.9-45.8-16-69-11-16.6,3.6-33.9,5.4-47,13-11.6,6.7-22.8,17.2-34,23-6.8-10.4-18.8-17.8-29-25-38.8-27.3-104.3-48.8-167-28-54,17.9-93.2,52.7-116,102-11.2,24.2-25.2,64.3-17,102,2.5,11.6.8,26,7,34-2.5,4.2-8.5,3.7-13,6a204.22,204.22,0,0,0-25,15c-19.7,14.1-34.9,36.4-46,59-4.4,8.9-10.6,33.8-9,44,0.2,1.2-1,7.1-1,10,0,11.7-.4,21.4,3,33,13.7,47.3,42.5,80.6,85,99,13.6,5.9,28.8,6.3,45,10,19.9,4.5,59.6-8.1,71-14,7.7-4,44.2-25.8,51-30,24.8-15.4,50.6-29.4,76-45,66.1-40.6,135.8-77.6,202-118,38-23.2,75.2-35.1,99-73,7.2-11.4,12.6-25.3,17-39,6-18.9,5.5-51.5,0-70C634.41,347.6,610.21,318.8,566,299.6Z"
            transform="translate(0 -170.81)"
          ></path>
        </svg> -->
        天外天工作室 / © 2000-{{ getYear() }} /
        <a href="http://www.miibeian.gov.cn/" rel="nofollow"
          >津ICP备16002964号-1</a
        >
        / 津教备0767号
      </div>
    </div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">重置密码</span>
        </v-card-title>
        <v-banner
          width="85%"
          style="position: relative; margin: 0 auto"
          color="red-text"
        >
          若您已绑定手机号，可通过手机号登录并在个人信息中进行密码修改。<br />
          若未绑定验证码请联系管理员进行密码重置。
        </v-banner>
        <v-card-text>
          <!-- <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    label="姓名"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    label="学工号"
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            关闭
          </v-btn>
          <!-- <v-btn color="red" text @click="dialog = false">
                        申请重置密码
                    </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { login, loginWithPhone, loginVerifyCode } from "@/api/user";
import Message from "@/components/message";
import { getUrlParam } from "@/utils/common";
import { setToken } from "@/utils/auth";

export default {
  name: "login",
  data() {
    return {
      dialog: false,
      from: "",
      showPsw: false,
      tab: "",
      username: "",
      usernameRules: [(v) => !!v || "请输入邮箱/用户名/学号"],
      password: "",
      passwordRules: [(v) => !!v || "请输入密码"],
      phone: "",
      phoneRules: [
        (v) => !!v || "请输入手机号",
        (v) =>
          (v &&
            (function (x) {
              let s =
                /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
              return s.test(x);
            })(v)) ||
          "请您输入正确的手机号",
      ],
      verify: "",
      verifyRules: [
        (v) => !!v || "请输入验证码",
        (v) =>
          (v &&
            (function (x) {
              let s = /^\d{6}$/;
              return s.test(x);
            })(v)) ||
          "请您输入合法的验证码",
      ],
    };
  },
  methods: {
    getYear() {
      let date = new Date();
      return date.getFullYear();
    },
    loginCommon() {
      // console.log(this.username, this.password);
      let data = {
        account: this.username,
        password: this.password,
      };
      login(data)
        .then((value) => {
          Message.success(`登录成功`);
          setToken(value.result.token);
          sessionStorage.setItem("basicInfo", JSON.stringify(value.result));
          this.from = getUrlParam("from");

          if (this.from) {
            this.$router.push({ path: this.from });
          } else {
            this.$router.push({ path: "/home" });
          }
        })
        .catch((value) => {
          console.log(value);
        });
    },
    loginPhone() {
      // console.log(this.phone, this.verify);
      let data = {
        phone: this.phone,
        code: this.verify,
      };
      loginWithPhone(data)
        .then((value) => {
          // console.log(value);
          Message.success(`登录成功`);
          setToken(value.result.token);
          sessionStorage.setItem("basicInfo", JSON.stringify(value.result));
          this.from = getUrlParam("from");
          if (this.from) {
            this.$router.push({ path: this.from });
          } else {
            this.$router.push({ path: "/home" });
          }
        })
        .catch((value) => {
          console.log(value);
        });
    },
    sendVerifyCode() {
      let data = { phone: this.phone };
      loginVerifyCode(data)
        .then(() => {
          // console.log(value);
          Message.success(`短信发送成功`);
        })
        .catch((value) => {
          console.log(value);
        });
    },
  },
  created() {
    this.from = getUrlParam("from");
    sessionStorage.clear();
  },
};
</script>

<style lang="scss" scoped>
.bg {
  background: #026fce !important;
  background-image: linear-gradient(
    45deg,
    hsl(170deg, 80%, 70%),
    hsl(190deg, 80%, 70%),
    hsl(250deg, 80%, 70%),
    hsl(3200deg, 80%, 70%)
  ) !important;
  overflow: hidden;
  background-size: 200% 200% !important;
  animation: gradient-move 3s ease alternate infinite;
  .login-card {
    margin-top: 20%;
  }
  .func-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 14px;
    a {
      text-decoration: none;
    }
  }
}
.footer {
  padding: 0 12px;
  bottom: 30px;
  position: absolute;
  width: 100%;
  text-align: center;
  .copyright {
    position: relative;
    display: inline-block;
    padding: 8px 20px;
    margin: 0 auto;
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.5);
    text-align: center;
    max-width: 940px;
    font-size: 14px;
    line-height: 24px;
    a {
      text-decoration: none;
      color: #000;
    }
  }
}
@keyframes gradient-move {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}
</style>
