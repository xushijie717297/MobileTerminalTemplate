export const Mixin = {
    data () {
        return {
                num:1,
                startDate:"",
                endDate:"",
                status:"",
                currentPage:"",
                pageSize:"",
                type:"",
        }
    },
    created () {
        console.log("mixin")
    },
    methods: {
        getActiveList(){
            let data = {
                startDate:this.startDate,
                endDate:this.endDate,
                status:this.status,
                currentPage:this.currentPage,
                pageSize:this.pageSize,
                type:this.type,
            }
            console.log(data)
        }
    }
}