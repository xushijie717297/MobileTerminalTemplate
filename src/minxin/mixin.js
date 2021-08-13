
import urlClass from "../components/js/UrlClass"
import moment from "moment";
export const Mixin = {
  data() {
    return {
      num: 1,
      startDate: "",
      endDate: "",
      status: "",
      currentPage: "",
      pageSize: "",
      type: "",
      CountByDay: []
    }
  },
  created() {
    console.log("mixin")
    this.GetMonthEventCountByDay()
  },
  methods: {
    getActiveList() {
      let data = {
        startDate: this.startDate,
        endDate: this.endDate,
        status: this.status,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        type: this.type,
      }
    },
    GetMonthEventCountByDay() {//获取日历上面存在报警的日期
      let params = {
        YearMonth: this.$moment().format("YYYY-MM"),
      };
      this.$axios
        .post(urlClass.DetectWise + "GetMonthEventCountByDay", params)
        .then((Response) => {
          Response.data.Result.forEach((res) => {
            this.CountByDay.push(res.Date);
          });
        });
    },
  }
}