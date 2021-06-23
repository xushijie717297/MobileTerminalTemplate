<template>
  <div class="search">
    <div class="DropdownMenu">
      <van-dropdown-menu>
        <!-- 类型 -->
        <van-dropdown-item
        :title="title"
          v-model="value"
          :options="GetWorkSheetInfoStatusData"
          @change = "getValue"
        />
        <!-- 时间选择 -->
        <van-dropdown-item :title="date" ref="item" @open="openDropdown">
          <van-calendar
            v-model="show"
            type="range"
            @confirm="onConfirm"
            get-container="#app"
            :min-date="minDate"
          />
        </van-dropdown-item>
      </van-dropdown-menu>
      <div class="icon">
        <van-icon name="sort" color="#000" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { DropdownMenu, DropdownItem, Icon } from "vant";

Vue.use(Icon);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
import * as timeStamp from "../../utils/index";
export default {
  data() {
    return {
      minDate: new Date(2010, 0, 1),
      date: "报警时间",
      show: false,
      rangeDate: [
        this.$moment().subtract("days", 30).format("YYYY-MM-DD"),
        this.$moment().endOf("day").format("YYYY-MM-DD"),
      ],
      value:0,
      title:"工单状态",
      GetWorkSheetInfoStatusData: [
        {
          value: 0,
          text: "未受理",
        },
        {
          value: 1,
          text: "处理中",
        },
        {
          value: 2,
          text: "未完成",
        },
        {
          value: 3,
          text: "已完成",
        },
      ],
    };
  },
  mounted () {
     console.log(this.rangeDate) 
  },
  methods: {
    getValue(value){
        console.log(value)
    },
    onItemClick(item){
      item.classNames = !item.classNames
      console.log(item)
    },
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(date) {
      const [start, end] = date;
      this.show = false;
      var CreateTime = ((new Date(start)).getTime()/1000).toFixed(0)
      var CompleteTime = ((new Date(end)).getTime()/1000).toFixed(0)
      console.log(timeStamp.parseTime(CreateTime,"{y}-{m}-{d}"))
      console.log(timeStamp.parseTime(CompleteTime,"{y}-{m}-{d}"))
      this.date = `${timeStamp.parseTime(CreateTime,"{y}-{m}-{d}")} - ${timeStamp.parseTime(CompleteTime,"{y}-{m}-{d}")}`;
      
    },
    warnDetermine() {
        this.$refs.itemType.toggle();

    },
    warnCancel() {
        this.$refs.itemType.toggle();
    },
    openDropdown() {
        this.show = true;
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  width: 100%;
    & /deep/ .van-cell__title{
      font-size: 12px;
  }
  .DropdownMenu {
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & /deep/ .van-dropdown-menu__title--active {
      color: #2b699d !important;
    }
    & /deep/ .van-dropdown-menu__title{
        padding-left: 0;
    }
    & /deep/ .van-dropdown-item__option--active{
      color: #2b699d !important;
    }
    & /deep/ .van-dropdown-menu {
      width: 175px;
      div {
        &:nth-child(2) {
          .van-popup {
            &::before {
              left: 14%;
            }
          }
        }
        &:nth-child(3) {
          .van-popup {
            &::before {
              left: 35%;
            }
          }
        }
        &:nth-child(4) {
          .van-popup {
            &::before {
              left: 54%;
            }
          }
        }
        &:nth-child(5) {
          .van-popup {
            &::before {
              left: 75%;
            }
          }
        }
      }
    }
    & /deep/ .van-popup {
      background-color: transparent;
      &::before {
        display: block;
        content: "";
        width: 0;
        height: 0;
        border: 8px solid; /*no*/
        border-color: transparent transparent #fff;
        border-top: none;
        position: relative;
        left: 50%;
        top: 1px;
        transform: translateX(-50%);
      }
    }
    & /deep/ .van-dropdown-menu__title {
      font-size: 12px; /*no*/
      &::after {
        border-color: transparent transparent #000 #000;
      }
    }
    & /deep/ .van-dropdown-menu__bar {
      background-color: transparent;
      box-shadow: none;
    }
    .icon {
      height: 48px; /*no*/
      width: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;/*no*/
    }
  }
  .delete-button {
    height: 100%;
  }
}
.warnType{
    overflow-y: scroll;
    background-color: #fff;
    li{
        height: 44px;
        background-color: #fff;
        color: #646464;
        box-shadow: 0px 1px 0px 0px #E9E9E9;/*no*/
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;/*no*/
    }
}
.warnBtn{
    display: flex;
    width: 100%;
    background-color: #fff;
    & /deep/ .van-button{
        border: none;
        width: 50%;
        &:nth-child(1){
            color: #000;
            background-color: #F0F0F0;
        }
        &:nth-child(2){
            color: #fff;
            background-color: #000;
        }
    }
}
.active{
    color: #2B699D !important;
}
</style>