<template>
  <v-app style="background-color: #eceff1; height: 100vh; overflow: hidden">
    <div class="header-div">
      <img src="@/assets/logo.png" class="twt-logo" alt="twt" />
      <v-toolbar-title class="twt-title"
        ><p>微北洋消息推送</p>
        <p>管理后台</p></v-toolbar-title
      >
      <v-menu offset-y auto>
        <template v-slot:activator="{ on }">
          <v-btn depressed v-on="on" class="user-btn">
            {{ username }}
          </v-btn>
        </template>
        <v-card flat class="drop-card">
          <v-list-item>
            <v-list-item-avatar color="grey darken-3">
              <v-img alt="avatar" :src="avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="realname">{{
                realname
              }}</v-list-item-title>
              <v-list-item-title>{{ userNumber }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-row align="center" justify="end">
              <v-btn text @click="logout"> 退出 </v-btn>
            </v-row>
          </v-list-item>
        </v-card>
      </v-menu>
    </div>
    <div
      :class="!btnValue ? 'main-view' : 'second-view'"
      style="background-color: #eceff1"
    >
      <div class="hide-slide">
        <v-tabs v-model="tab">
          <v-tab :href="tabValue" style="display: none"></v-tab>
          <v-tabs-items v-model="tab" style="background-color: #eceff1">
            <v-tab-item value="0">
              <v-card tile flat style="position: relative"
                ><v-card-title class="subtitle" style="top: 0px"
                  >推送对象</v-card-title
                >
                <v-form ref="chooseForm" lazy-validation>
                  <v-select
                    class="btns btns_1"
                    :disabled="sendAll"
                    outlined
                    dense
                    label="校区"
                    v-model="theCampus"
                    :items="campusItems"
                    :rules="!sendAll ? rules : []"
                  ></v-select>
                  <v-select
                    class="btns btns_2"
                    :disabled="sendAll"
                    outlined
                    dense
                    label="年级"
                    v-model="theGrade"
                    :items="gradeItems"
                    item-text="gradeName"
                    item-value="gradeId"
                    :rules="!sendAll ? rules : []"
                    multiple
                  ></v-select>
                  <v-select
                    class="btns btns_3"
                    :disabled="sendAll"
                    outlined
                    dense
                    label="学生类型"
                    v-model="theType"
                    :items="typeItems"
                    item-text="typeName"
                    item-value="typeId"
                    :rules="!sendAll ? rules : []"
                    multiple
                  ></v-select>
                  <v-select
                    v-model="changeMajorSelect.destDepartmentId"
                    :disabled="sendAll"
                    class="btns btns_4"
                    outlined
                    dense
                    label="学院"
                    :items="department"
                    item-text="name"
                    item-value="id"
                    :rules="!sendAll ? rules : []"
                    multiple
                  ></v-select>
                  <v-select
                    :disabled="
                      changeMajorSelect.destDepartmentId == '' || sendAll
                    "
                    v-model="changeMajorSelect.destMajorId"
                    class="btns btns_5"
                    outlined
                    dense
                    label="专业"
                    :items="major"
                    item-text="name"
                    item-value="id"
                    :rules="!sendAll ? rules : []"
                    multiple
                  ></v-select>
                  <v-select style="display: none"></v-select>
                  <v-card-title class="subtitle" style="padding-top: 0"
                    >推送标题</v-card-title
                  >
                  <v-text-field
                    outlined
                    v-model="specificData.notificationDto.title"
                    label="推送标题"
                    class="areaclass areaclass-title"
                    height="18px"
                    :rules="rules"
                  >
                  </v-text-field>
                  <v-card-title class="subtitle" style="padding-top: 0"
                    >推送内容</v-card-title
                  >
                  <v-textarea
                    outlined
                    no-resize
                    v-model="specificData.notificationDto.context"
                    label="推送内容"
                    class="areaclass"
                    height="200px"
                    :rules="rules"
                  >
                  </v-textarea>
                  <v-text-field
                    dense
                    outlined
                    label="附加链接(可选)"
                    v-model="specificData.notificationDto.extra"
                    class="areaclass"
                    style="top: -25px"
                  ></v-text-field>
                  <div class="okBtn">
                    <v-btn
                      large
                      :loading="loading"
                      :disabled="loading"
                      color="info"
                      @click="sendToThem()"
                      >推送消息</v-btn
                    >
                  </div>
                  <v-checkbox
                    class="send-all"
                    label="推送给全体成员"
                    v-model="sendAll"
                  ></v-checkbox>
                </v-form>
              </v-card>
            </v-tab-item>
            <v-tab-item value="1" style="background-color: #eceff1"
              ><div
                style="height: 2px; background-color: #eceff1"
                v-show="btnValue"
              ></div>
              <v-card
                v-for="(item, index) in historyData"
                :key="index"
                class="contentItems"
                elevation="1"
              >
                <p class="card-text item-time">
                  {{
                    item.createdAt.slice(0, 4) +
                    "/" +
                    item.createdAt.slice(5, 7) +
                    "/" +
                    item.createdAt.slice(8, 10) +
                    " " +
                    item.createdAt.slice(11, 19)
                  }}
                </p>
                <p class="card-text item-title">{{ item.title }}</p>
                <p class="card-text item-content">{{ item.context }}</p>
                <p class="card-text item-operator">
                  操作员: {{ item.operator }}
                </p>
              </v-card></v-tab-item
            >
          </v-tabs-items>
        </v-tabs>
      </div>
    </div>
    <div class="hide-white"></div>
    <v-bottom-navigation
      v-model="btnValue"
      shift
      background-color="#E0E0E0"
      color="primary"
      style="position: relative; bottom: 0px"
      grow
    >
      <v-app-bar style="display: none"></v-app-bar>
      <v-btn @click="toChange()">
        <span>发送消息</span>
        <v-icon :color="btnColor_1">mdi-message-draw</v-icon>
      </v-btn>
      <v-btn
        @click="
          toChange();
          toHistory();
        "
      >
        <span>历史消息</span>
        <v-icon :color="btnColor_2">mdi-message-text-clock</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> 推送发送确认 </v-card-title>
        <v-card-text>请您再次确认推送内容是否正确 </v-card-text>
        <v-card-text>确定发送推送吗?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="
              dialog = false;
              sendConfirm = false;
            "
          >
            取消
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="
              dialog = false;
              sendConfirm = true;
            "
          >
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import defaultAvatar from "@/assets/avatar.png";
import Message from "@/components/message";
import {
  getDepartmentAll,
  getMajorByDepartment,
  getMajorAll,
  notificationAll,
  notificationSpecific,
  notificationHistoryAll,
} from "@/api/user.js";
import { removeToken } from "@/utils/auth";
export default {
  name: "home",
  data: () => ({
    avatar: defaultAvatar,
    username: "请登录",
    realname: "请登录",
    userNumber: "",
    btnValue: 0,
    sendAll: false,
    tab: null,
    loader: null,
    loading: false,
    dialog: false,
    sendConfirm: false,
    theCampus: "",
    campusItems: ["全部校区", "卫津路校区", "北洋园校区"],
    theGrade: [],
    gradeItems: [
      {
        gradeName: "2020级",
        gradeId: "2020",
      },
      {
        gradeName: "2019级",
        gradeId: "2019",
      },
      {
        gradeName: "2018级",
        gradeId: "2018",
      },
      {
        gradeName: "2017级",
        gradeId: "2017",
      },
      {
        gradeName: "2016级",
        gradeId: "2016",
      },
    ],
    theType: [],
    typeItems: [
      {
        typeName: "全部类型",
        typeId: 0,
      },
      {
        typeName: "博士研究生",
        typeId: 1,
      },
      {
        typeName: "硕士研究生",
        typeId: 2,
      },
      {
        typeName: "本科生",
        typeId: 3,
      },
      {
        typeName: "留学生",
        typeId: 6,
      },
      {
        typeName: "教职工",
        typeId: 11,
      },
    ],
    changeMajorSelect: { destDepartmentId: [], destMajorId: [] },
    changeMajorSelectInit: { destDepartmentId: [], destMajorId: [] },
    department: [],
    major: [],
    specificDataInit: {
      notificationDto: {
        title: "",
        context: "",
        clickType: "none",
        extra: "",
      },
      stuTypeFilterDto: {
        campus: "",
        departmentId: [],
        majorId: [],
        stuType: [],
        grade: [],
      },
    },
    specificData: {
      notificationDto: {
        title: "",
        context: "",
        clickType: "none",
        extra: "",
      },
      stuTypeFilterDto: {
        campus: "",
        departmentId: [],
        majorId: [],
        stuType: [],
        grade: [],
      },
    },
    historyData: [],
    rulesInit: [
      (v) =>
        (v &&
          (function (x) {
            if (x.length != 0) return true;
            else return false;
          })(v)) ||
        "请输入",
    ],
    rules: [
      (v) =>
        (v &&
          (function (x) {
            if (x.length != 0) return true;
            else return false;
          })(v)) ||
        "请输入",
    ],
  }),
  methods: {
    dataInit() {
      //初始化数据
      this.rules = [];
      this.specificData = this.specificDataInit;
      this.theCampus = "";
      this.theGrade = [];
      this.theType = [];
      this.changeMajorSelect = this.changeMajorSelectInit;
    },
    logout() {
      //退出登录
      removeToken();
      this.$router.push({ path: "/login" });
      sessionStorage.removeItem("basicInfo");
      Message.success("已登出当前账号");
    },
    toChange() {
      //点击底部导航栏改变状态
      this.tab = 1;
    },
    toHistory() {
      //读取历史推送记录
      notificationHistoryAll().then((res) => {
        this.historyData = res.result;
      });
    },
    sendToThem() {
      //点击发送推送按钮
      this.rules = this.rulesInit;
      setTimeout(() => {
        if (this.$refs.chooseForm.validate()) {
          this.dialog = true;
        }
      }, 500);
    },
  },
  created() {
    //自动添加新年级
    let thisYear = new Date().getFullYear();
    let thisMonth = new Date().getMonth() + 1;
    if (thisMonth < 7) thisYear--;
    let xYear = 2021;
    while (xYear <= thisYear) {
      this.gradeItems.unshift({
        gradeName: "" + xYear + "级",
        gradeId: "" + xYear,
      });
      xYear++;
    }
    this.gradeItems.unshift({ gradeName: "全年级", gradeId: 0 });
    //获得所有学院
    getDepartmentAll().then((res) => {
      this.department = res.result;
      this.department.unshift({ name: "全部学院", id: 0 });
    });
    //读取用户信息
    let info = JSON.parse(sessionStorage.getItem("basicInfo"));
    this.avatar = info.avatar;
    this.username = info.nickname;
    this.realname = info.realname;
    this.userNumber = info.userNumber;
  },
  computed: {
    btnColor_1() {
      switch (this.btnValue) {
        case 0:
          return "#039BE5";
        case 1:
          return "#BDBDBD";
        default:
          return "#BDBDBD";
      }
    },
    btnColor_2() {
      switch (this.btnValue) {
        case 0:
          return "#BDBDBD";
        case 1:
          return "#039BE5";
        default:
          return "#BDBDBD";
      }
    },
    tabValue() {
      return "#" + this.btnValue;
    },
  },
  watch: {
    "changeMajorSelect.destDepartmentId": {
      handler(newVal) {
        if (newVal.indexOf(0) == -1) {
          this.major = [];
          for (let i = 0; i < newVal.length; i++) {
            getMajorByDepartment(newVal[i]).then((res) => {
              for (let j = 0; j < res.result.majors.length; j++)
                this.major.unshift(res.result.majors[j]);
              this.major.unshift({ name: "全部专业", id: 0 });
              if (this.major.length === 0) {
                this.changeMajorSelect.destMajorId = [];
              }
            });
          }
        } else {
          getMajorAll().then((res) => {
            this.major = res.result;
            this.major.unshift({ name: "全部专业", id: 0 });
            if (this.major.length === 0) {
              this.changeMajorSelect.destMajorId = [];
            }
          });
        }
      },
    },
    "specificData.notificationDto.extra": {
      handler(newVal) {
        if (newVal != "") this.specificData.notificationDto.clickType = "url";
        else this.specificData.notificationDto.clickType = "";
      },
    },
    sendConfirm: {
      handler(newVal) {
        if (newVal) {
          this.loader = "loading";
          if (this.sendAll) {
            notificationAll(this.specificData.notificationDto)
              .then(() => {
                Message.success("推送成功！");
                this.loader = null;
                this.dataInit();
              })
              .catch((err) => {
                Message.error(err);
              });
          } else {
            //对用户的选择进行数据处理
            if (this.theCampus == "全部校区")
              this.specificData.stuTypeFilterDto.campus = "";
            else this.specificData.stuTypeFilterDto.campus = this.theCampus;
            if (this.theGrade.indexOf(0) != -1) {
              this.specificData.stuTypeFilterDto.grade = [];
              for (let i = 1; i < this.gradeItems.length; i++) {
                this.specificData.stuTypeFilterDto.grade.unshift(
                  this.gradeItems[i].gradeId
                );
              }
            } else this.specificData.stuTypeFilterDto.grade = this.theGrade;
            if (this.theType.indexOf(0) != -1) {
              this.specificData.stuTypeFilterDto.stuType = [1, 2, 3, 6, 11];
            } else this.specificData.stuTypeFilterDto.stuType = this.theType;
            if (this.changeMajorSelect.destDepartmentId.indexOf(0) != -1) {
              this.specificData.stuTypeFilterDto.departmentId = [];
              for (let i = 1; i < this.department.length; i++) {
                this.specificData.stuTypeFilterDto.departmentId.unshift(
                  this.department[i].id
                );
              }
            } else
              this.specificData.stuTypeFilterDto.departmentId = this.changeMajorSelect.destDepartmentId;
            if (this.changeMajorSelect.destMajorId.indexOf(0) != -1) {
              if (this.changeMajorSelect.destDepartmentId.indexOf(0) != -1) {
                this.specificData.stuTypeFilterDto.majorId = [];
                for (let i = 1; i < this.major.length; i++) {
                  this.specificData.stuTypeFilterDto.majorId.unshift(
                    this.major[i].id
                  );
                }
              } else this.specificData.stuTypeFilterDto.majorId = [];
            } else
              this.specificData.stuTypeFilterDto.majorId = this.changeMajorSelect.destMajorId;

            notificationSpecific(this.specificData)
              .then(() => {
                Message.success("推送成功！");
                this.loader = null;
                this.dataInit();
              })
              .catch((err) => {
                Message.error(err);
              });
          }
          this.sendConfirm = false;
        } else this.sendConfirm = false;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.header-div {
  position: relative;
  height: 75px;
  background-color: #f5f5f5;
}
.bottom-btn {
  width: 50vw;
}
.twt-title {
  position: absolute;
  left: 12vw;
  padding-top: 10px;
  padding-left: 90px;
  font-size: 19px;
  text-align: center;
  line-height: 12px;
}
.twt-logo {
  position: absolute;
  left: 12vw;
  width: 60px;
  height: 60px;
}
.user-btn {
  position: absolute;
  right: 12vw;
  top: 12px;
}
.main-view {
  position: relative;
  top: 0px;
  height: 100vh;
  left: 12vw;
  width: 76vw;
  overflow: hidden;
  margin-bottom: 20px;
}
.send-all {
  position: absolute;
  left: 190px;
  top: 2px;
}
.hide-slide {
  position: relative;
  left: 0px;
  width: calc(100% + 17px);
  height: 100%;
  overflow: auto;
}
.second-view {
  position: relative;
  top: 0px;
  height: 100vh;
  left: 12vw;
  width: 76vw;
  overflow: hidden;
}
.hide-white {
  position: absolute;
  top: 55px;
  height: 62px;
  width: 100%;
  background-color: #eceff1;
}
.subtitle {
  top: -10px;
  font-size: 18px;
  position: relative;
  left: 6%;
}
.btns {
  display: inline-block;
  position: relative;
  font-size: 14px;
}
.btns_1 {
  left: 7.5%;
  width: 12.5%;
}
.btns_2 {
  left: 10%;
  width: 12.5%;
}
.btns_3 {
  left: 12.5%;
  width: 12.5%;
}
.btns_4 {
  left: 15%;
  width: 15%;
}
.btns_5 {
  left: 17.5%;
  width: 22.5%;
}
.areaclass {
  position: relative;
  left: 7.5%;
  width: 85%;
  top: -10px;
}
.areaclass-title {
  font-size: 20px;
  font-weight: 700;
  text-align: center;
}
.okBtn {
  position: relative;
  margin-left: 92.5%;
  left: -102px;
  top: -25px;
}
.contentItems {
  margin: 0px;
  margin-bottom: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
}
.card-text {
  font-size: 14px;
  padding-top: 5px;
  padding-left: 1.5%;
  margin: 0;
}
.item-time {
  font-weight: 600;
}

.item-title {
  font-weight: 700;
}
.item-content {
  font-weight: 500;
}
.item-operator {
  font-weight: 400;
}
.drop-card {
  padding: 16px;
  font-size: 16px;
  .realname {
    font-weight: bold;
  }
  .brief {
    font-size: 14px;
  }
  .func {
    display: flex;
    justify-content: flex-end;
  }
}
@media screen and (max-width: 700px) {
  .main-view {
    position: relative;
    top: 0px;
    height: 100vh;
    left: 8vw;
    width: 84vw;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .hide-slide {
    position: relative;
    left: 0px;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .send-all {
    position: absolute;
    left: 100px;
    top: 2px;
  }
  .second-view {
    position: relative;
    top: 5px;
    left: 8vw;
    width: 84vw;
    margin: 0;
  }
  .btns {
    display: inline-block;
    position: relative;
    font-size: 10px;
  }
  .btns_1 {
    left: 3.5%;
    width: 29.5%;
  }
  .btns_2 {
    left: 6%;
    width: 29.5%;
  }
  .btns_3 {
    left: 8.5%;
    width: 29.5%;
  }
  .btns_4 {
    left: 3.5%;
    width: 39%;
  }
  .btns_5 {
    left: 6%;
    width: 52%;
  }
  .subtitle {
    font-size: 18px;
    position: relative;
    left: 0;
  }
  .historyTitle {
    position: relative;
    font-size: 16px;
    padding-top: 10px;
    left: 1%;
  }
  .areaclass {
    position: relative;
    left: 3.5%;
    width: 93%;
  }
  .okBtn {
    position: relative;
    margin-left: 96.5%;
    left: -102px;
    top: -25px;
  }
  .twt-title {
    position: absolute;
    left: 8vw;
    padding-top: 10px;
    padding-left: 55px;
    font-size: 17px;
    text-align: center;
    line-height: 10px;
  }
  .twt-logo {
    position: absolute;
    left: 8vw;
    width: 52px;
    height: 52px;
  }
  .user-btn {
    position: absolute;
    right: 8vw;
    top: 10px;
  }
}
</style>
