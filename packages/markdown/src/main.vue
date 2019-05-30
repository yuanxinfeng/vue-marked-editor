<template>
  <div class="mdContainer" :class="{ fullPage: fullPageStatus }">
    <div class="navContainer" v-if="navStatus">
      <div class="markContainer">
        <div class="markListGroup">
          <div class="markListItem" @click="addStrong" title="strong">
            <b>B</b>
          </div>
          <div class="markListItem" @click="addItalic" title="italic">
            <i>I</i>
          </div>
          <div class="markListItem" @click="addStrikethrough" title="strikethrough">
            <i class="fa fa-strikethrough" aria-hidden="true"></i>
          </div>
          <div class="markListItem" @click="addHTitle(1)" title="H1-title">H1</div>
          <div class="markListItem" @click="addHTitle(2)" title="H2-title">H2</div>
          <div class="markListItem" @click="addHTitle(3)" title="H3-title">H3</div>
          <div class="markListItem" @click="addHTitle(4)" title="H4-title">H4</div>
          <div class="markListItem" @click="addHTitle(5)" title="H5-title">H5</div>
          <div class="markListItem" @click="addHTitle(6)" title="H6-title">H6</div>
          <div class="markListItem" @click="addLine" title="line">一</div>
          <div class="markListItem" @click="addQuote" title="quote">
            <i class="fa fa-quote-left" aria-hidden="true"></i>
          </div>
          <div class="markListItem" @click="addCode">
            <i class="fa fa-code" aria-hidden="true"></i>
          </div>
          <div class="markListItem" @click="addLink">
            <i class="fa fa-link" aria-hidden="true"></i>
          </div>
          <div class="markListItem addImage" @mousemove="imageMove" @mouseleave="imageLeave">
            <i class="fa fa-picture-o" style="margin-top:4px;" aria-hidden="true"></i>
            <transition name="fade">
              <div class="dropdown" v-if="image_dropdown_open">
                <div class="dropdown-item" @click="addLinkImage">
                  <span class="span_center">添加图片链接</span>
                </div>
                <div class="dropdown-item" style="overflow: hidden">
                  <input
                    type="file"
                    accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
                    multiple="multiple"
                    @change="addFileImage($event)"
                  >
                  <span class="span_center">上传图片</span>
                </div>
                <template v-for="(item, index) in imageFiles">
                  <div
                    v-if="item"
                    class="dropdown-item dropdown-images"
                    :title="item.name"
                    :key="index"
                  >
                    <span>{{item.name}}</span>
                    <button
                      slot="right"
                      type="button"
                      @click.stop="$imgDel(index)"
                      class="delBtn fa fa-trash-o"
                      aria-hidden="true"
                      title="删除"
                    ></button>
                    <!-- 缩略图展示 -->
                    <transition name="fade">
                      <img class="image-show" :src="item.url" alt="none">
                    </transition>
                  </div>
                </template>
              </div>
            </transition>
          </div>
          <div class="markListItem" @click="addTable" title="table">
            <i class="fa fa-table" aria-hidden="true"></i>
          </div>
          <div class="markListItem" @click="addUl" title="ul-list">
            <i class="fa fa-list-ul" aria-hidden="true"></i>
          </div>
          <div class="markListItem" @click="addOl" title="ol-list">
            <i class="fa fa-list-ol" aria-hidden="true"></i>
          </div>
          <div class="markListItem" @click="fullPageFn" title="fullpage">
            <i class="fa fa-arrows-alt" aria-hidden="true"></i>
          </div>
          <div class="markListItem" @click="previewFn" title="preview">
            <i class="fa fa-eye-slash" aria-hidden="true"></i>
          </div>
          <div class="markListItem" @click="previewAllFn" title="previewAll">
            <i class="fa fa-eye" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="mdBodyContainer" :class="[{noMenu:!navStatus},{mdBodyFullPage:fullPageStatus}]">
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

import "font-awesome/css/font-awesome.min.css";

import "../../../src/assets/css/github-markdown.css";
/*引入atom的代码高亮样式文件*/
import "../../../src/assets/css/atom.min.css";

import hljs from "highlight.js";
import range from "../../../src/utils/rangeFn";
import Vue from "vue";

import scroll from "vue-scroll";
import { setTimeout } from "timers";

Vue.use(scroll);

const renderer = new marked.Renderer();

marked.setOptions({
  renderer: renderer,
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
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
      image_dropdown_open: false,
      imageFiles: [],
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
      // 屏蔽掉tab切换事件
      if (evt.preventDefault) {
        evt.preventDefault();
      } else {
        evt.returnValue = false;
      }
    },
    imageMove() {
      this.image_dropdown_open = true;
    },
    imageLeave() {
      this.image_dropdown_open = false;
    },
    addLinkImage: function() {
      insertContent("![Vue](https://cn.vuejs.org/images/logo.png)\n", this);
      this.image_dropdown_open = false;
    },
    addFileImage($e) {
      this.imageFilesAdd($e.target.files);
      $e.target.value = ""; // 初始化
    },
    imageFilesAdd($files) {
      for (let i = 0; i < $files.length; i++) {
        this.$imgFileAdd($files[i]);
      }
    },
    $imgFileAdd($file) {
      this.$emit("imgAdd", $file);
      this.image_dropdown_open = false;
    },
    $callbackAddImage(image) {
      this.imageFiles.push(image);
      insertContent(`![${image.name}](${image.url})\n`, this);
    },
    $imgDel(index) {
      let currentImage = this.imageFiles[index];
      let string = `![${currentImage.name}](${currentImage.url})\n`;
      this.input = this.input.replace(string, "");
      this.imageFiles.splice(index, 1);
      let textareaDom = document.querySelector(".mdEditor");
      range.setCaretPosition(textareaDom, 2);
      this.$emit("delImage", currentImage);
      if (this.imageFiles.length === 0) {
        this.image_dropdown_open = false;
      }
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
        return `<h${level} id="titleAnchor-${index++}">${text}</h${level}>`;
      };
      renderer.link = (href, title, text) => {
        return `<a href="${href}"
             target="${href.substr(0, 1) === "#" ? "_self" : "_blank"}" 
             class="${href.substr(0, 1) === "#" ? "" : "c-link"}"
             title="访问 ${text} | Welcome to Pawn's blog!">
             ${
               href.substr(0, 1) === "#"
                 ? text
                 : text.length > 40
                 ? text.slice(0, 40) + "..."
                 : text
             }
          </a>`
          .replace(/\s+/g, " ")
          .replace("\n", "");
      };
      renderer.image = (href, title, text) => {
        return `<img src="${href}" title="${text}"/>`;
      };

      let data = {};
      data.mdValue = this.input;
      data.htmlValue = marked(this.input, {
        sanitize: true,
        renderer: renderer
      });
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
    },
    mdValuesP: function(val) {
      this.input = val;
    }
  }
};
</script>

<style lang="scss" scoped>
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
      .markListGroup {
        padding: 0;
        margin: auto;
        height: 100%;
        width: auto;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .markListItem {
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
        .addImage {
          position: relative;
          display: inline-block;
          .fade-enter-active,
          .fade-leave-active {
            transition: opacity 0.5s;
          }
          .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
            opacity: 0;
          }
          .dropdown {
            position: absolute;
            left: -55px;
            min-width: 130px;
            background: #fff;
            transition: all 0.2s linear 0s;
            .dropdown-item {
              position: relative;
              height: 35px;
              line-height: 35px;
              font-size: 12px;
              transition: all 0.2s linear 0s;
              .span_center{
                display: block;
                text-align: center;
              }
              &:hover {
                background: #eaeaea;
              }
              input {
                position: absolute;
                font-size: 100px;
                max-height: 35px;
                right: 0;
                top: 0;
                left: 0;
                max-width: 130px;
                opacity: 0;
                cursor: pointer;
              }
            }
            .dropdown-images {
              &:hover {
                .image-show {
                  display: block;
                }
              }
              .delBtn {
                box-sizing: border-box;
                display: inline-block;
                cursor: pointer;
                height: 28px;
                width: 28px;
                margin: 6px 0 5px 0px;
                font-size: 15px;
                padding: 4.5px 6px 5px 3.5px;
                color: #757575;
                border-radius: 5px;
                text-align: center;
                background: none;
                border: none;
                outline: none;
                line-height: 1;
                vertical-align: middle;
              }
              button {
                position: absolute;
                right: 5px;
                &:hover {
                  color: #db2828;
                }
              }
              .image-show {
                display: none;
                position: absolute;
                left: -122px;
                top: 0;
                -webkit-transition: all 0.3s linear 0s;
                transition: all 0.3s linear 0s;
                width: 120px;
                height: 90px;
                border: 1px solid #eeece8;
              }
            }
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
  .mdBodyFullPage {
    height: 100% !important;
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
  text-align: left;
}
</style>
