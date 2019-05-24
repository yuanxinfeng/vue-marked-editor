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
export default {
  name: "Show",
  data() {
    return {
      desc: ""
    };
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
