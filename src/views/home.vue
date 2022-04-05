<template>
  <v-app style="background-color: #eceff1">
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
      <v-card tile flat style="position: relative" v-if="!btnValue"
        ><v-card-title class="subtitle" style="top: 0px">推送对象</v-card-title>
        <v-form ref="chooseForm" lazy-validation>
          <v-radio-group v-model="radioGroup" :column="false" style="margin: 0">
            <v-radio label="推送给指定群体" :value="1" class="radios"></v-radio
            ><v-radio label="推送给全体成员" :value="2" class="radios"></v-radio
            ><v-radio label="依据学号推送" :value="3" class="radios"></v-radio>
          </v-radio-group>
          <template v-if="radioGroup === 1">
            <v-select
              class="btns btns_1"
              outlined
              dense
              label="校区"
              v-model="theCampus"
              :items="campusItems"
              :rules="rules"
            ></v-select>
            <v-select
              class="btns btns_2"
              outlined
              dense
              label="年级"
              v-model="theGrade"
              :items="gradeItems"
              item-text="gradeName"
              item-value="gradeId"
              :rules="rules"
              multiple
            ></v-select>
            <v-select
              class="btns btns_3"
              outlined
              dense
              label="学生类型"
              v-model="theType"
              :items="typeItems"
              item-text="typeName"
              item-value="typeId"
              :rules="rules"
              multiple
            ></v-select>
            <v-select
              v-model="changeMajorSelect.destDepartmentId"
              class="btns btns_4"
              outlined
              dense
              label="学院"
              :items="department"
              item-text="name"
              item-value="id"
              :rules="rules"
              multiple
            ></v-select>
            <v-select
              :disabled="changeMajorSelect.destDepartmentId == ''"
              v-model="changeMajorSelect.destMajorId"
              class="btns btns_5"
              outlined
              dense
              label="专业"
              :items="major"
              item-text="name"
              item-value="id"
              :rules="rules"
              multiple
            ></v-select>
            <v-select style="display: none"></v-select>
          </template>
          <template v-if="radioGroup === 3">
            <v-text-field
              outlined
              v-model="users"
              label="用户学号"
              hint="若有多个，用分号隔开，分号中英文均可"
              class="areaclass"
              height="18px"
              :rules="usersRules"
            >
            </v-text-field>
          </template>
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
          <mavon-editor
            placeholder="推送内容"
            v-model="specificData.notificationDto.content"
            class="myQuillEditor"
            :ishljs="true"
            ref="md"
            :toolbars="toolbars"
            @imgAdd="handleEditorImgAdd"
            @imgDel="handleEditorImgDel"
          />
          <v-text-field
            dense
            outlined
            label="附加“阅读原文”URL（可选）"
            v-model="specificData.notificationDto.url"
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
        </v-form>
      </v-card>
      <template v-else>
        <v-card
          v-for="(item, index) in showData"
          :key="index"
          class="contentItems"
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
          <p class="card-text item-title">推送标题：{{ item.title }}</p>
          <mavon-editor
            class="card-text item-content subEditor"
            :value="item.content"
            :subfield="false"
            :boxShadow="false"
            :defaultOpen="'preview'"
            :toolbarsFlag="false"
            :editable="false"
            :scrollStyle="true"
            :ishljs="true"
          />
          <p class="card-text item-content">
            <a :href="item.url" target="_blank">{{ item.url }}</a>
          </p>
          <p class="card-text item-operator">操作员: {{ item.operator }}</p>
        </v-card>
        <p
          v-if="showData.length < historyData.length"
          @click="pushData"
          style="cursor: pointer; font-size: 14px; text-align: center"
        >
          点击查看更多
        </p>
      </template>
    </div>
    <v-bottom-navigation
      v-model="btnValue"
      shift
      background-color="#E0E0E0"
      color="primary"
      style="position: fixed; bottom: 0px; z-index: 1502"
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
import axios from "axios";
import {
  getDepartmentAll,
  getMajorByDepartment,
  getMajorAll,
  notificationAll,
  notificationSpecific,
  notificationHistoryAll,
  //notificationHistoryPage,
  notificationToUser,
} from "@/api/user.js";
import { removeToken } from "@/utils/auth";
import cryptoJs from "crypto-js";
export default {
  name: "home",
  data: () => ({
    content: "", //富文本的内容
    avatar: defaultAvatar,
    showData: [],
    username: "请登录",
    realname: "请登录",
    users: "",
    userNumber: "",
    btnValue: 0,
    tab: null,
    loader: null,
    loading: false,
    dialog: false,
    sendConfirm: false,
    radioGroup: 1,
    theCampus: "",
    campusItems: ["全部校区", "卫津路校区", "北洋园校区"],
    theGrade: [],
    toolbars: {
      bold: true, // 粗体
      italic: true, // 斜体
      header: true, // 标题
      underline: true, // 下划线
      strikethrough: true, // 中划线
      mark: true, // 标记
      superscript: true, // 上角标
      subscript: true, // 下角标
      quote: true, // 引用
      ol: true, // 有序列表
      ul: true, // 无序列表
      link: true, // 链接
      imagelink: true, // 图片链接
      code: true, // code
      table: true, // 表格
      fullscreen: false, // 全屏编辑
      readmodel: true, // 沉浸式阅读
      htmlcode: true, // 展示html源码
      help: true, // 帮助
      /* 1.3.5 */
      undo: true, // 上一步
      redo: true, // 下一步
      trash: true, // 清空
      save: false, // 保存（触发events中的save事件）
      /* 1.4.2 */
      navigation: true, // 导航目录
      /* 2.1.8 */
      alignleft: true, // 左对齐
      aligncenter: true, // 居中
      alignright: true, // 右对齐
      /* 2.2.1 */
      subfield: true, // 单双栏模式
      preview: true, // 预览
    },
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
    imgFile: {},
    base64EncodeChars:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    specificDataInit: {
      notificationDto: {
        title: "",
        content: "",
        url: "",
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
        content: "",
        url: "",
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
    usersRules: [
      (v) =>
        (v &&
          (function (x) {
            if (x.length != 0) return true;
            else return false;
          })(v)) ||
        "请输入",
      (v) => {
        let x = [],
          flag = true;
        v.split(";").map((item) => {
          x = x.concat(item.split("；"));
        });
        x.map((item) => {
          if (item) {
            if (!/^\d{6,10}$/.test(item)) {
              flag = false;
            }
          }
        });
        return flag || "请输入正确的学号集合";
      },
    ],
  }),
  methods: {
    dataInit() {
      //初始化数据
      this.users = "";
      this.rules = [];
      this.specificData = this.specificDataInit;
      this.theCampus = "";
      this.theGrade = [];
      this.theType = [];
      this.changeMajorSelect = this.changeMajorSelectInit;
    },
    handleEditorImgAdd(pos, $file) {
      let formdata = new FormData();
      formdata.append("file", $file);
      formdata.append("token", this.genUpToken());
      let instance = axios.create({
        withCredentials: true,
      });
      instance.post("https://upload-z1.qiniup.com", formdata).then((res) => {
        if (res.status === 200) {
          let url = "http://pic.pamaforce.xyz/" + res.data.key;
          let name = $file.name;
          if (name.includes("-")) {
            name = name.replace(/-/g, "");
          }
          // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)  这里是必须要有的
          this.$refs.md.$imglst2Url([[pos, url]]);
        }
      });
    },
    handleEditorImgDel() {},
    genUpToken() {
      let deadline = Math.round(new Date().getTime() / 1000) + 3600;

      //SETP 2
      let put_policy = JSON.stringify({
        scope: "notice-twt",
        deadline: deadline,
      });
      console && console.log("put_policy = ", put_policy);

      //SETP 3
      var encoded = this.base64encode(this.utf16to8(put_policy));
      console && console.log("encoded = ", encoded);

      //SETP 4
      var hash = cryptoJs.HmacSHA1(
        encoded,
        "Drq--AHKz5WMTmiq9RhN8_HLvDLekmEVDnhSanp9"
      );
      var encoded_signed = hash.toString(cryptoJs.enc.Base64);
      console && console.log("encoded_signed=", encoded_signed);

      //SETP 5
      var upload_token =
        "S6-mJgAdkQZHofzp_hU-TW9LjoO7myKfHbXrjk8U:" +
        this.safe64(encoded_signed) +
        ":" +
        encoded;
      console && console.log("upload_token=", upload_token);
      return upload_token;
    },
    safe64(base64) {
      base64 = base64.replace(/\+/g, "-");
      base64 = base64.replace(/\//g, "_");
      return base64;
    },
    utf16to8(str) {
      var out, i, len, c;
      out = "";
      len = str.length;
      for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x0001 && c <= 0x007f) {
          out += str.charAt(i);
        } else if (c > 0x07ff) {
          out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
          out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
        } else {
          out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
          out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
        }
      }
      return out;
    },
    base64encode(str) {
      var out, i, len;
      var c1, c2, c3;
      len = str.length;
      i = 0;
      out = "";
      while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
          out += this.base64EncodeChars.charAt(c1 >> 2);
          out += this.base64EncodeChars.charAt((c1 & 0x3) << 4);
          out += "==";
          break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
          out += this.base64EncodeChars.charAt(c1 >> 2);
          out += this.base64EncodeChars.charAt(
            ((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)
          );
          out += this.base64EncodeChars.charAt((c2 & 0xf) << 2);
          out += "=";
          break;
        }
        c3 = str.charCodeAt(i++);
        out += this.base64EncodeChars.charAt(c1 >> 2);
        out += this.base64EncodeChars.charAt(
          ((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4)
        );
        out += this.base64EncodeChars.charAt(
          ((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6)
        );
        out += this.base64EncodeChars.charAt(c3 & 0x3f);
      }
      return out;
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
        this.showData = [];
        this.pushData();
      });
    },
    pushData() {
      if (this.showData.length < this.historyData.length) {
        this.showData.push(
          ...(this.historyData.length - this.showData.length > 20
            ? this.historyData.slice(
                this.showData.length,
                this.showData.length + 20
              )
            : this.historyData.slice(
                this.showData.length,
                this.historyData.length - this.showData.length
              ))
        );
      }
    },
    sendToThem() {
      if (this.specificData.notificationDto.content.length) {
        //点击发送推送按钮
        this.rules = this.rulesInit;
        setTimeout(() => {
          if (this.$refs.chooseForm.validate()) {
            this.dialog = true;
          }
        }, 500);
      }
    },
  },
  created() {
    // notificationHistoryPage({ pageSize: 20, pageNum: 0 }).then((res) => {
    //   console.log(res);
    // });
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
    sendConfirm: {
      handler(newVal) {
        if (newVal) {
          this.loader = "loading";
          if (this.radioGroup === 2) {
            notificationAll(this.specificData.notificationDto)
              .then(() => {
                Message.success("推送成功！");
                this.loader = null;
                this.dataInit();
              })
              .catch((err) => {
                Message.error(err);
                this.loader = null;
              });
          } else if (this.radioGroup === 1) {
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
              this.specificData.stuTypeFilterDto.departmentId =
                this.changeMajorSelect.destDepartmentId;
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
              this.specificData.stuTypeFilterDto.majorId =
                this.changeMajorSelect.destMajorId;

            notificationSpecific(this.specificData)
              .then(() => {
                Message.success("推送成功！");
                this.loader = null;
                this.dataInit();
              })
              .catch((err) => {
                Message.error(err);
                this.loader = null;
              });
          } else if (this.radioGroup === 3) {
            notificationToUser({
              ...this.specificData.notificationDto,
              userNumbers: this.users,
            })
              .then(() => {
                Message.success("推送成功！");
                this.loader = null;
                this.dataInit();
              })
              .catch((err) => {
                Message.error(err);
                this.loader = null;
              });
          }
          this.sendConfirm = false;
        } else this.sendConfirm = false;
      },
    },
  },
};
</script>
<style>
.ql-editor {
  min-height: 200px;
}
.v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper {
  overflow-y: auto !important;
}
.v-note-wrapper {
  min-height: 500px !important;
}
</style>
<style lang="scss" scoped>
.subEditor {
  padding-top: 0 !important;
  margin-top: 5px !important;
  margin-bottom: 5px !important;
  min-height: 20px !important;
}
.header-div {
  position: relative;
  height: 65px;
  background-color: #f5f5f5;
  z-index: 1000;
}
.bottom-btn {
  width: 50vw;
}
.twt-title {
  position: absolute;
  left: 12vw;
  padding-top: 12px;
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
  left: 12vw;
  width: 76vw;
  overflow: hidden;
  margin-top: 50px;
  margin-bottom: 100px;
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
  left: 12vw;
  width: 76vw;
  padding: 0 10px;
  overflow: hidden;
  margin-top: 30px;
  margin-bottom: 100px;
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
.radios {
  position: relative;
  left: 7.5%;
  margin-right: 24px;
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
  margin: 5px 10px;
  margin-bottom: 15px;
  padding-left: 1.5%;
  padding-right: 1.5%;
  padding-top: 5px;
  padding-bottom: 5px;
  box-sizing: border-box !important;
}
.card-text {
  font-size: 14px;
  padding-top: 5px;
  margin: 0;
}
.item-time {
  font-weight: 600;
}
.myQuillEditor {
  width: 85%;
  margin: 0 auto;
  margin-bottom: 50px;
  z-index: 1;
}
.item-title {
  font-weight: 700;
}
.item-content {
  font-weight: 400;
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
  .hide-white {
    height: 65px;
  }
  .main-view {
    position: relative;
    top: 0px;
    left: 8vw;
    width: 84vw;
    overflow: hidden;
    margin-bottom: 80px;
  }
  .hide-slide {
    position: relative;
    left: 0px;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .second-view {
    position: relative;
    top: 5px;
    left: 8vw;
    width: 84vw;
    margin: 0;
    margin-bottom: 80px;
  }
  .radios {
    left: 3.5%;
    margin-right: 30px;
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
  .myQuillEditor {
    width: 93%;
  }
}
</style>
