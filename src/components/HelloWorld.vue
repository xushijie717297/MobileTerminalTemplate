<template>
  <div class="hello">
    
  </div>
</template>

<script>
import api from "@/axios/api";
// import axios from "axios"
export default {
  name: "HelloWorld",
  props: {
    msg: String,
    obj:{
      password: "123456",
      remember_me: true,
      username: "18800020001",
    }
  },
  mounted() {
    this.$axios
      .post(api.getList, this.obj)
      .then(res => {
        console.log(res);
      });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
