<template>
  <div class="mdContainer" :class="{ fullPage: fullPageStatus }">
    <div class="navContainer" v-if="navStatus">
      <div class="markContainer">
        <ul class="markListGroup">
          <li class="markListItem" @click="addStrong" title="strong">
            <b>B</b>
          </li>
          <li class="markListItem" @click="addItalic" title="italic">
            <i>I</i>
          </li>
          <li class="markListItem" @click="addStrikethrough" title="strikethrough">
            <i class="fa fa-strikethrough" aria-hidden="true"></i>
          </li>
          <li class="markListItem" @click="addHTitle(1)" title="H1-title">H1</li>
          <li class="markListItem" @click="addHTitle(2)" title="H2-title">H2</li>
          <li class="markListItem" @click="addHTitle(3)" title="H3-title">H3</li>
          <li class="markListItem" @click="addHTitle(4)" title="H4-title">H4</li>
          <li class="markListItem" @click="addHTitle(5)" title="H5-title">H5</li>
          <li class="markListItem" @click="addHTitle(6)" title="H6-title">H6</li>
          <li class="markListItem" @click="addLine" title="line">一</li>
          <li class="markListItem" @click="addQuote" title="quote">
            <i class="fa fa-quote-left" aria-hidden="true"></i>
          </li>
          <li class="markListItem" @click="addCode">
            <i class="fa fa-code" aria-hidden="true"></i>
          </li>
          <li class="markListItem" @click="addLink">
            <i class="fa fa-link" aria-hidden="true"></i>
          </li>
          <li class="markListItem" @click="addImage">
            <i class="fa fa-picture-o" aria-hidden="true"></i>
          </li>
          <li class="markListItem" @click="addTable" title="table">
            <i class="fa fa-table" aria-hidden="true"></i>
          </li>
          <li class="markListItem" @click="addUl" title="ul-list">
            <i class="fa fa-list-ul" aria-hidden="true"></i>
          </li>
          <li class="markListItem" @click="addOl" title="ol-list">
            <i class="fa fa-list-ol" aria-hidden="true"></i>
          </li>
          <li class="markListItem" @click="fullPageFn" title="fullpage">
            <i class="fa fa-arrows-alt" aria-hidden="true"></i>
          </li>
          <li class="markListItem" @click="previewFn" title="preview">
            <i class="fa fa-eye-slash" aria-hidden="true"></i>
          </li>
          <li class="markListItem" @click="previewAllFn" title="previewAll">
            <i class="fa fa-eye" aria-hidden="true"></i>
          </li>
        </ul>
      </div>
    </div>
    <div class="mdBodyContainer" :class="{ noMenu: !navStatus }">
      <div class="editContainer" v-if="editStatus">
        <textarea name class="mdEditor" @keydown.9="tabFn" v-scroll="editScroll" v-model="input"></textarea>
      </div>
      <div
        class="previewContainer markdown-body"
        v-scroll="previewScroll"
        v-html="compiledMarkdown"
        v-if="previewStatus"
      ></div>
    </div>
  </div>
</template>

<script>
import marked from "marked";

import "../../../src/assets/css/github-markdown.css";
/*引入atom的代码高亮样式文件*/
import "../../../src/assets/css/atom.min.css";

import "font-awesome/css/font-awesome.min.css";

import hljs from "highlight.js";
import range from "../../../src/utils/rangeFn";
import Vue from "vue";

import scroll from "vue-scroll";

Vue.use(scroll);

const renderer = new marked.Renderer();

marked.setOptions({
  renderer: renderer,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  }
});

function insertContent(val, that) {
  let textareaDom = document.querySelector(".mdEditor");
  let value = textareaDom.value;
  let point = range.getCursortPosition(textareaDom);
  let lastChart = value.substring(point - 1, point);
  let lastFourCharts = value.substring(point - 4, point);
  if (lastChart != "\n" && value != "" && lastFourCharts != "    ") {
    val = "\n" + val;
    range.insertAfterText(textareaDom, val);
  } else {
    range.insertAfterText(textareaDom, val);
  }
  that.input = document.querySelector(".mdEditor").value;
}
export default {
  name: "YMarkdown",
  props: [
    "mdValuesP",
    "fullPageStatusP",
    "editStatusP",
    "previewStatusP",
    "navStatusP",
    "icoStatusP"
  ],
  data() {
    return {
      input: this.mdValuesP || "",
      editStatus: Boolean(this.editStatusP),
      previewStatus: Boolean(this.previewStatusP),
      fullPageStatus: Boolean(this.fullPageStatusP),
      navStatus: Boolean(this.navStatusP),
      icoStatus: Boolean(this.icoStatusP),
      maxEditScrollHeight: 0,
      maxPreviewScrollHeight: 0,
      upImageArr: [],
      index: -1
    };
  },
  created: function() {
    if (!this.editStatus && !this.previewStatus) {
      this.editStatus = true;
      this.previewStatus = true;
    }
  },
  methods: {
    tabFn: function(evt) {
      insertContent("    ", this);
      // 屏蔽屌tab切换事件
      if (evt.preventDefault) {
        evt.preventDefault();
      } else {
        evt.returnValue = false;
      }
    },
    addImage: function(cmd) {
      if (cmd === "online") {
        this.$prompt("请输入图片地址", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^http:\/\/.+\..+/i,
          inputErrorMessage: "图片地址不正确"
        })
          .then(({ value }) => {
            insertContent(`![Vue](${value})`, this);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入"
            });
          });
      }
    },
    beforeUpload: function(file) {
      console.log(file);
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 1.5;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 1.5MB!");
      }
      return isJPG && isLt2M;
    },
    addUpImag: function(req, file, fileList) {
      console.log(req.files.file);
      let path = req.files.file.path.split("static/")[1];
      let value = `${location.origin}/${path}`;
      insertContent(`![Vue](${value})`, this);
    },
    addHTitle: function(index) {
      let tmp = "";
      switch (index) {
        case 1:
          tmp = "# ";
          break;
        case 2:
          tmp = "## ";
          break;
        case 3:
          tmp = "### ";
          break;
        case 4:
          tmp = "#### ";
          break;
        case 5:
          tmp = "##### ";
          break;
        case 6:
          tmp = "###### ";
          break;
        default:
          break;
      }
      insertContent(tmp, this);
    },
    addCode: function() {
      let textareaDom = document.querySelector(".mdEditor");
      let value = textareaDom.value;
      let point = range.getCursortPosition(textareaDom);
      let lastChart = value.substring(point - 1, point);
      insertContent("```\n\n```", this);
      if (lastChart != "\n" && value != "") {
        range.setCaretPosition(textareaDom, point + 5);
      } else {
        range.setCaretPosition(textareaDom, point + 4);
      }
    },
    addStrikethrough: function() {
      let textareaDom = document.querySelector(".mdEditor");
      let value = textareaDom.value;
      let point = range.getCursortPosition(textareaDom);
      let lastChart = value.substring(point - 1, point);
      insertContent("~~~~", this);
      if (lastChart != "\n" && value != "") {
        range.setCaretPosition(textareaDom, point + 3);
      } else {
        range.setCaretPosition(textareaDom, point + 2);
      }
    },
    addStrong: function() {
      let textareaDom = document.querySelector(".mdEditor");
      let value = textareaDom.value;
      let point = range.getCursortPosition(textareaDom);
      let lastChart = value.substring(point - 1, point);
      insertContent("****", this);
      if (lastChart != "\n" && value != "") {
        range.setCaretPosition(textareaDom, point + 3);
      } else {
        range.setCaretPosition(textareaDom, point + 2);
      }
    },
    addItalic: function() {
      let textareaDom = document.querySelector(".mdEditor");
      let value = textareaDom.value;
      let point = range.getCursortPosition(textareaDom);
      let lastChart = value.substring(point - 1, point);
      insertContent("**", this);
      if (lastChart != "\n" && value != "") {
        range.setCaretPosition(textareaDom, point + 2);
      } else {
        range.setCaretPosition(textareaDom, point + 1);
      }
    },
    setStrong: function() {
      let textareaDom = document.querySelector(".mdEditor");
      let point = range.getCursortPosition(textareaDom);
    },
    addLine: function() {
      insertContent("\n----\n", this);
    },
    addLink: function() {
      insertContent("[Vue](https://cn.vuejs.org/images/logo.png)", this);
    },
    addQuote: function() {
      let textareaDom = document.querySelector(".mdEditor");
      let value = textareaDom.value;
      let point = range.getCursortPosition(textareaDom);
      let lastChart = value.substring(point - 1, point);
      insertContent("> ", this);
      if (lastChart != "\n" && value != "") {
        range.setCaretPosition(textareaDom, point + 3);
      } else {
        range.setCaretPosition(textareaDom, point + 2);
      }
    },
    addTable: function() {
      insertContent("\nheader 1 | header 2\n", this);
      insertContent("---|---\n", this);
      insertContent("row 1 col 1 | row 1 col 2\n", this);
      insertContent("row 2 col 1 | row 2 col 2\n\n", this);
    },
    addUl: function() {
      insertContent("* ", this);
    },
    addOl: function() {
      insertContent("1. ", this);
    },
    previewFn: function() {
      if (!this.editStatus) {
        this.editStatus = true;
        this.previewStatus = !this.previewStatus;
      } else {
        this.previewStatus = !this.previewStatus;
      }
    },
    previewAllFn: function() {
      if (!this.editStatus && this.previewStatus) {
        this.editStatus = true;
        this.previewStatus = true;
      } else {
        this.editStatus = false;
        this.previewStatus = true;
      }
    },
    fullPageFn: function() {
      this.fullPageStatus = !this.fullPageStatus;
      let maxEditScrollHeight =
        document.querySelector(".mdEditor").scrollHeight -
        document.querySelector(".mdEditor").clientHeight;
      let maxPreviewScrollHeight =
        document.querySelector(".previewContainer").scrollHeight -
        document.querySelector(".previewContainer").clientHeight;
      this.maxEditScrollHeight = maxEditScrollHeight;
      this.maxPreviewScrollHeight = maxPreviewScrollHeight;
    },
    previewScroll: function(e, position) {
      if (this.maxEditScrollHeight !== 0) {
        let topPercent = position.scrollTop / this.maxPreviewScrollHeight;
        document.querySelector(".mdEditor").scrollTop =
          this.maxEditScrollHeight * topPercent;
      }
    },
    editScroll: function(e, position) {
      if (this.maxPreviewScrollHeight !== 0) {
        let topPercent = position.scrollTop / this.maxEditScrollHeight;
        document.querySelector(".previewContainer").scrollTop =
          this.maxPreviewScrollHeight * topPercent;
      }
    },
    watchData() {
      let index = -1;
      renderer.heading = function(text, level) {
        console.log(index);
        return `<h${level} id="titleAnchor-${index++}">${text}</h${level}>`;
      };

      let data = {};
      data.mdValue = this.input;
      data.htmlValue = marked(this.input, {
        sanitize: true,
        renderer: renderer
      });
      this.upImageArr = [];
      let _this = this;
      document.querySelectorAll(".previewContainer img").forEach(n => {
        _this.upImageArr.push(n.src.split("/").pop());
      });

      data.upImageArr = this.upImageArr;
      this.$emit("childevent", data);
    }
  },
  computed: {
    compiledMarkdown: function() {
      return marked(this.input, {
        sanitize: true
      });
    }
  },
  watch: {
    input: function() {
      this.watchData();
      let maxEditScrollHeight =
        document.querySelector(".mdEditor").scrollHeight -
        document.querySelector(".mdEditor").clientHeight;
      let maxPreviewScrollHeight =
        document.querySelector(".previewContainer").scrollHeight -
        document.querySelector(".previewContainer").clientHeight;
      this.maxEditScrollHeight = maxEditScrollHeight;
      this.maxPreviewScrollHeight = maxPreviewScrollHeight;

      marked.setOptions({
        highlight: function(code) {
          return hljs.highlightAuto(code).value;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.mdContainer {
  width: 100%;
  height: 100%;
  background: lightblue;
  &.fullPage {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
  }
  .navContainer {
    width: 100%;
    height: 36px;
    background: #fff;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
    .nameContainer {
      color: lightblue;
      margin-right: 10px;
      cursor: pointer;
    }
    .markContainer {
      width: auto;
      height: 100%;
      margin-left: 0px;
      ul.markListGroup {
        padding: 0;
        margin: auto;
        height: 100%;
        width: auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        li.markListItem {
          list-style: none;
          width: 20px;
          height: 20px;
          margin: 0 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          font-size: 12px;
          color: #333;
          &:hover {
            background: #eee;
          }
        }
      }
    }
  }
  .mdBodyContainer {
    width: 100%;
    height: 300px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    &.noMenu {
      height: 100%;
    }
  }
}

// 编辑区域
.editContainer {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border-right: 1px solid #ddd;
  background: #333;
  color: #fff;
  padding: 10px;
  .mdEditor {
    height: 100%;
    width: 100%;
    background: transparent;
    outline: none;
    color: #fff;
    resize: none;
  }
}

// 预览区
.previewContainer {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: #fff;
  overflow: auto;
  padding: 10px;
}
</style>