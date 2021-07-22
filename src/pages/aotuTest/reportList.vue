<template>
    <div class="utils" >
        <div>
            <!-- <el-input placeholder="搜索内容" type="text" v-model="caseId" class="input-with-select" >
                <el-button slot="append" @click="getRunLog" icon="el-icon-search">搜索</el-button>
                .filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))
            </el-input> -->
        </div>
      <div style="">
      <el-table
            :data="reportDatas" 
            style="width: 100%">
            <el-table-column
              label="用例ID">
              <template slot-scope="scope">
                 {{scope.row.caseId}}
              </template>
            </el-table-column>
            <el-table-column
              label="执行时间"
              prop="name">
              <template slot-scope="scope">
                 {{scope.row.create_time}}
              </template>
            </el-table-column>
            <el-table-column
              label="执行类型"
              prop="name">
              <template slot-scope="scope">
                 {{scope.row.source}}
              </template>
            </el-table-column>
            <el-table-column
              label="Case数量"
              prop="name">
              <template slot-scope="scope">
                 {{scope.row.amount}}
              </template>
            </el-table-column>
            <el-table-column
              label="Fail失败"
              prop="name">
              <template slot-scope="scope">
                {{scope.row.error_num}}
              </template>
            </el-table-column>
            <el-table-column
              label="测试消耗"
              prop="name">
              <template slot-scope="scope">
                  {{scope.row.time}} 秒
              </template>
            </el-table-column>
            <el-table-column
              label="阅读状态"
              prop="name">
              <template slot-scope="scope">
                 {{scope.row.is_read}}
              </template>
            </el-table-column>
            <el-table-column
              align="right">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="search"
                  size="mini"
                  placeholder="输入关键字搜索"/>
              </template>

              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="lookReport(scope.row.caseId,scope.row.logType)">查看报告</el-button>
                <!-- <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">Delete</el-button> -->
              </template>
            </el-table-column>
      </el-table>

      </div>
      <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :total="pageCount"
      style="display:flex;justify-content:center;margin-top:50px"
      >
    </el-pagination>
    </div>
</template>

<script>
 import GLOBAL from '../../utils/global_variable.js';
export default {
  created: function () {
       console.log(GLOBAL.orderNo)
       this.getReports(1)
  },
  data() {
      return {
          tableData: [],
          caseId: 0,
          reportDatas: [],
          search: '',
          pageCount: 0
      }
  },
  mounted(){
  },
  methods: {
      getReports(page){
        this.$axios.get(
                    '/alter/common/getReports',
                    {
                       params: {
                          page_index: page
                      }
                    }
                    
          ).then(data => {
              var dataObj = data.data.obj
              this.$data.reportDatas = dataObj.relust
              this.$data.pageCount = dataObj.pageCount

          })
      },
      handleCurrentChange(val){
        console.log(val)
        this.getReports(val)
      },

      lookReport(caseId,logType) {
        // 查看报告
        // this.$router.push({name: 'reportDetail',params:{ caseId: caseId}});
        if (logType === "1"){
            let routeObj = this.$router.resolve('/uiReportDetail/' + caseId);
            window.open(routeObj.href, '_blank');

        }else{
            let routeObj = this.$router.resolve('/reportDetail/' + caseId);
            window.open(routeObj.href, '_blank');
        }
       


       
      },
      handleDelete(index, row) {
        console.log(index, row);
      }
  }
}
</script>

<style scoped>
.utils{
  
    background: white;

}
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
