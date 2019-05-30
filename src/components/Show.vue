<template>
  <div class="hello">
    <div height="400px">
      <y-markdown
        ref="markdown"
        :mdValuesP="desc"
        :fullPageStatusP="false"
        :editStatusP="true"
        :previewStatusP="true"
        :navStatusP="true"
        :icoStatusP="true"
        @childevent="childEventHandler"
        @imgAdd="imgAdd"
        @delImage="delIMage"
      ></y-markdown>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { setTimeout } from "timers";
export default {
  name: "Show",
  data() {
    return {
      desc: "",
      image: ""
    };
  },
  created() {
    this.desc="";
    this.$nextTick(() => {});
  },
  mounted() {},
  methods: {
    childEventHandler(res) {
    },
    imgAdd(file) {
      var formdata = new FormData();
      formdata.append("file", file);
      axios({
        url: "http://127.0.0.1:10000/api/uploadImage/add",
        method: "post",
        data: formdata,
        headers: {
          "Content-Type":
            "multipart/form-data;boundary = " + new Date().getTime(),
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWRtaW4iLCJpYXQiOjE1NTkyMDExODIsImV4cCI6MTU1OTIwNDc4Mn0.7PXHlgjpU2qwcA2lhbgI9Tx_hHgtyvO1k4bsyjzAaAY"
        }
      })
        .then(res => {
          console.log(res);
          this.image = res.data.data.file_url;
          let imageid = res.data.data._id;
          let obj = { name: file.name, url: this.image, id: imageid };
          this.$refs["markdown"].$callbackAddImage(obj);
        })
        .catch(error => {
          console.log("image upload error", error);
        });
    },
    delIMage(image) {
      axios({
        url: "http://127.0.0.1:10000/api/uploadImage/del",
        method: "post",
        params: { id: image.id },
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWRtaW4iLCJpYXQiOjE1NTkyMDExODIsImV4cCI6MTU1OTIwNDc4Mn0.7PXHlgjpU2qwcA2lhbgI9Tx_hHgtyvO1k4bsyjzAaAY"
        }
      })
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          console.log("image upload error", error);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello {
  font-size: 20px;
  color: aquamarine;
}
</style>
