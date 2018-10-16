<template>
  <div id="app">    
    <div class="top">
      <div class="t-left">
        <div class="numboxs">
          <div class="num">
            <div class="num-name">话务量</div>
            <div class="num-value">321</div>
          </div>
          <div class="num">
            <div class="num-name">话务量</div>
            <div class="num-value">42</div>
          </div>
          <div class="num">
            <div class="num-name">话务量</div>
            <div class="num-value">322</div>
          </div>
          <div class="num">
            <div class="num-name">话务量</div>
            <div class="num-value">4122</div>
          </div>
        </div>
        <div class="left-histogram">
          当月分站平均出车时间
        </div>
      </div>
      <div class="t-mid"></div>
      <div class="t-right">
        <div class="t-right-form"></div>  
        <div class="t-right-histogram"></div>
      </div>      
    </div>
    <div class="bottom">
      <div class="b-left"></div>
      <div class="b-right"></div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import E from "echarts";

export default {
  name: "app",
  mounted() {
    //console.log(E);
    Axios.get("/api/search?q=javascript&count=1").then(res => {
      console.log(res);
    });
  }
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 2560px;
  height: 1440px;
  background: url("./assets/bg.png") no-repeat;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  overflow: hidden;
}
.top,
.bottom {
  display: flex;
}
.top {
  margin: 20px 18px 0 26px;
  height: 1038px;
}
.t-left {
  width: 742px;
}
.numboxs {
  height: 264px;  
}
.num {  
  width: 360px;
  height: 124px;
  float: left;
  box-sizing: border-box;
  padding:14px 30px;
}
.num:nth-child(1){
  margin-right:19px;
  margin-bottom:18px;
}
.num:nth-child(3){
  margin-right:19px;
  margin-bottom:18px;
}
.num .num-name{
  color:#59acff
}
.num .num-value{
  text-align: center;
  font-size:50px;
}
.left-histogram {
  border: 1px solid red;
  height: 750px;
  margin-top: 20px;
}

.t-mid {
  border: 1px solid red;
  width: 988px;
  margin: 0 20px;
}
.t-right {
  width: 746px;
}
.t-right-form {
  border: 1px solid red;
  height: 745px;
}
.t-right-histogram {
  border: 1px solid red;
  margin-top: 20px;
  height: 268px;
}

.bottom {
  border: 1px solid gold;
  margin: 20px 18px 0 26px;
  height: 334px;
}
</style>
