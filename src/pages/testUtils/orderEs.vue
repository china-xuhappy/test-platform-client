<template>
  <div class="file">
    <div>
       <p>(订单，车辆，会员) ES 数据库 工具</p>
      <el-form ref="form" :model="form" label-width="80px" style="margin-top:30px">
          <el-form-item style="display:flex;">
            <div style="display:flex;">
              <el-select v-model="form.type" placeholder="请选择类型">
                <el-option label="订单" value="order"></el-option>
                <el-option label="车辆" value="car"></el-option>
                <el-option label="会员" value="member"></el-option>
              </el-select>
              <el-input v-model="form.content"></el-input>
            </div>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="commitES">ES查询</el-button>
              <el-button type="primary" @click="commitSql">数据库查询</el-button>
              <el-button type="primary" @click="refreshEs">刷新ES</el-button>
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import GLOBAL from '../../utils/global_variable.js';
var environment = ""
export default {
 data() {
      return {
        form: {
            type: "order",
            content: ""
        },
      }
  },
  methods: {
      getEnvironment(){
        if (GLOBAL.interceptor === "1"){
          environment = "test1"
        }else if (GLOBAL.interceptor === "2"){
          environment = "test2"
        }else if (GLOBAL.interceptor === "3"){
          environment = "test3"
        }else if (GLOBAL.interceptor === "4"){
          environment = "test4"
        }else if (GLOBAL.interceptor === "5"){
          environment = "test5"
        }
      },
      commitES() {
         this.getEnvironment()
         var content = this.$data.form.content
         var type = this.$data.form.type
         if (content === "" || content === null || type === "" || type === null){
           return
         }
         if (type === "order"){
            window.open("http://127.0.0.1:9091/QueryEsDataByOrder/" + content + "/"+ environment, '_blank');
         }else if(type === "car"){
            window.open("http://127.0.0.1:9091/QueryEsDataByCar/" + content + "/"+ environment, '_blank');
         }else if(type === "member"){
            window.open("http://127.0.0.1:9091/es/member/" + content + "/"+ environment, '_blank');
         }
      },
      commitSql() {
         this.getEnvironment()
         var content = this.$data.form.content
         var type = this.$data.form.type
         if (content === "" || content === null || type === "" || type === null){
           return
         }
         if (type === "order"){
            window.open("http://127.0.0.1:9091/QueryMySqlByOrderNo/" + content + "/"+ environment , '_blank');
         }else if(type === "car"){
            window.open("http://127.0.0.1:9091/QueryCarByMsql/" + content + "/"+ environment , '_blank');
         }else if(type === "member"){
            window.open("http://127.0.0.1:9091/db/member/" + content + "/"+ environment , '_blank');
         }
      },
      refreshEs(){
        var content = this.$data.form.content
         var type = this.$data.form.type
         if (content === "" || content === null || type === "" || type === null){
           return
         }
          this.$axios.get(
              '/alter/common/refreshEs/',{
                    params: {
                      content: content,
                      type: type,
                      interceptor: GLOBAL.interceptor
                    }
                  }
          ).then(data => {
              var dataObj = data.data.obj
                if (data.data.status === 200) {
                  this.$message({
                      message: data.data.message,
                      type: 'success'
                      });
              } else {
                  this.$message({
                  message: data.data.message,
                  type: 'warning'
                  });
                  loading.close();
              }
          })
      },
  }
}
</script>

<style scoped>
.file{
    width: 500px;
    margin: 50px auto;
    font-size: 20px;
    color: red;
    text-align: center;
}
</style>
