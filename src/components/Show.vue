<template>
  <div class="hello">
    <div height="400px">
      <y-markdown
        :mdValuesP="desc"
        :fullPageStatusP="false"
        :editStatusP="true"
        :previewStatusP="true"
        :navStatusP="true"
        :icoStatusP="true"
        @childevent="childEventHandler"
      ></y-markdown>
    </div>
  </div>
</template>

<script>
import { setTimeout } from "timers";
export default {
  name: "Show",
  data() {
    return {
      desc: "123"
    };
  },
  created() {
    this.$nextTick(() => {
      setTimeout(() => {
        console.log(11111);
        this.desc = "321";
      }, 1000);
    });
  },
  mounted() {
    setTimeout(() => {
      this.desc = "456";
    }, 2000);
  },
  methods: {
    childEventHandler(res) {
      console.log(res);
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
