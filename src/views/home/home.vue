<template>
  <div class="home">
    <p id="statusBar"></p>
    <div class="box">
      <div class="fox" v-for="(item,index) in 8" :key="index">
       <p> 哈哈哈哈</p>
       <span>哈哈哈哈</span>
      </div>
      <!-- <van-cell title="单元格" is-link /> -->
        <!-- <van-cell title="单元格" is-link value="内容" /> -->
        <!-- <van-cell title="单元格" is-link arrow-direction="down" value="内容" /> -->
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { Cell, CellGroup } from 'vant';
import axios from "axios"

Vue.use(Cell);
Vue.use(CellGroup);
export default {
  name: "Home",
  data() {
    return {
      
      
    }
  },
  computed: {
    
  },
 
  methods: {

  },
  mounted() {
    axios.post("/data/index").then((res) => {
      console.log(res);
    });
  },
};
</script>
<style >

</style>
<style scoped lang="less">
.home{
  height: 100%;
  background: #262f49;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &::after {
    display: block;
    content: "";
    width: 100%;
    height: 50px;
    background-color: black;
  }
  .box{
    flex: 1;
    background: #171a2a;
    overflow: auto;
    .fox{
      height: 150px;
      border-top: 1px solid black;/*no*/
      color: #fff;
      box-sizing: border-box;
      p{
        font-size: 12px; /*px*/
        // border-bottom: 1px solid black;
      }
      span{
        font-size: 12px;
        color: @bright;
      }
    }
  }
}
</style>