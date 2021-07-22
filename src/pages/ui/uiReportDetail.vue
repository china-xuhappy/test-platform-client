<template>
    <div class="uiReportDetail">
        <p style="font-size:20px;text-align:center;">测试报告明细</p>
        <!-- <el-select v-model="environment" @change="changeEnt" placeholder="请选择">
          <el-option
            v-for="item in environmentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
      <div class="report_describe">
          <div class="describe">
              <ul>
                <li><p class="describe_title">项目名: </p><p>测试登录</p></li>
                <li><p class="describe_title">测试日期: </p><p>202005</p></li>
                <li><p class="describe_title">测试耗时: </p><p>360s</p></li>
                <li><p class="describe_title">用例总数: </p><p>111</p></li>
                <li><p class="describe_title">通过: </p><p>111</p></li>
                <li><p class="describe_title">失败: </p><p>111</p></li>
              </ul>
          </div>
          <div id="casePic" :style="{width: '400px', height: '310px', margin: '0px 300px 0px '}"></div>

          
      </div>

      <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand" style="display: flex;flex-grow: initial;flex-flow: row;flex-wrap: wrap;justify-content: space-between;">
                 <el-form-item label="返回结果：">
                    <json-viewer
                    style="width:600px;"
                    :value="props.row.resultLog"
                    :expand-depth=0
                    copyable
                    boxed
                    sort></json-viewer>
                </el-form-item>

                <el-form-item label="错误日志：">
                  {{props.row.errorLog}}
                </el-form-item>

                <el-form-item label="错误图片：">
                      <el-image :src="props.row.errImage" style="width: 300px; height: 500px"></el-image>

                </el-form-item>
                
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="用例ID"
            prop="caseId">
          </el-table-column>
          <el-table-column
            label="用例名称"
            prop="caseName">
          </el-table-column>
          <el-table-column
            label="用例步骤"
            prop="caseTitle">
          </el-table-column>
          <el-table-column
            label="运行时间"
            prop="caseTime">
          </el-table-column>
          <el-table-column
            prop="caseResult"
            label="测试结果"
            width="100"
            :filters="[{ text: '成功', value: 0 }, { text: '失败', value: 1 }]"
            :filter-method="filterTag"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status === 0 ? 'success' : 'danger'"
                disable-transitions>{{scope.row.status === 0 ? '成功':'失败'}}</el-tag>
            </template>
          </el-table-column>
      </el-table>

    </div>
</template>

<script>
export default {
  mounted: function () {
      console.log(this.$route)
      this.getRunLog(this.$route.params.caseId)
  },
  data() {
      return {
          tableData: [],
          charts: null,
          opinion:['用例通过','用例失败', '用例跳过'],
          opinionData: []
      }
  },
  methods: {
    // changeEnt() {
    //     console.log(this.$data.environment)
    // },
    getRunLog(caseId){
          this.$axios.get(
                    '/alter/ui_suite/getRunLog',
                    {
                      params: {caseId: caseId}
                }
          ).then(data => {
              var dataObj = data.data.obj
              this.$data.tableData = dataObj.runResults
              var executeResult = dataObj.executeResult
              this.$data.opinionData = [
                {value: executeResult.successNum, name:'用例通过'},
                {value: executeResult.errorNum, name:'用例失败'},
                {value: executeResult.skipNum, name:'用例跳过'},
              ]
              this.createCasePic();
          })
      },
     resetDateFilter() {
        this.$refs.filterTable.clearFilter('date');
      },
      clearFilter() {
        this.$refs.filterTable.clearFilter();
      },
      formatter(row, column) {
        return row.address;
      },
      filterTag(value, row) {
        return row.status === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      createCasePic (){
        this.charts = this.$echarts.init(document.getElementById('casePic'))
        this.charts.resize();
        this.charts.setOption({
              tooltip: {
                trigger: 'item',
              },
              legend: {
                orient: 'vertical',
                x: 'left',
                data:this.opinion
              },
              series: [
                {
                  name:'用例通过率',
                  type:'pie',
                  radius: '50%',
                  avoidLabelOverlap: false,
                  label: {
                    normal: {
                      show: false,
                      position: 'top'
                    },
                    emphasis: {
                      show: true,
                      textStyle: {
                        fontSize: '150',
                        fontWeight: 'blod'
                      }
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: this.opinionData
                }
              ],
              color:['green', 'red','yellow']
            })
      }
  }
}
</script>
<style scoped>
.el-form--inline .el-form-item{
  width: 760px;
  display:flex;
  flex-flow: column;
  font-weight: bold;
}
.describe_title{
  font-weight: bold;
  font-size: 18px;
  margin-right: 5px;
}
.describe li{
  display: flex;
  padding: 10px;
}
.report_describe{
  display: flex;
  width: 80%;
  margin: auto;
}
</style>