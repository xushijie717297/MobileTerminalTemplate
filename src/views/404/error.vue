<template>
  <div class="tests">
    <p class="iconfont iconlixian"></p>
    <span>网络已断开，请检查网络连接</span>
  </div>
</template>

<script>
   export default {
      name: 'error',
      data () {
         return {

         }
      },
      methods:{

      }
   }
</script>
<style scoped lang="less">
 @r : 1rem/37.5;
.tests{
	height: 100%;
	width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #9A9A9A;
  p{
    font-size: 42px;
  }
  span{
    padding: 20px 0;
    font-size: 14px;
  }
}
</style>
