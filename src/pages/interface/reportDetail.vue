<template>
    <div class="reportDetail">
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
                <li><p class="describe_title">|项目名|:</p><p class="describe_content">{{caseLogObject.projectName}}</p></li>
                <li><p class="describe_title">|测试日期|: </p><p class="describe_content">{{caseLogObject.caseDate}}</p></li>
                <li><p class="describe_title">|测试耗时|: </p><p class="describe_content">{{caseLogObject.caseTime}} s</p></li>
                <li><p class="describe_title">|用例总数|: </p><p class="describe_content">{{caseLogObject.amount}}</p></li>
                <li><p class="describe_title">|通过|: </p><p class="describe_content" style="color:green">{{caseLogObject.success_num}}</p></li>
                <li><p class="describe_title">|失败|: </p><p class="describe_content" style="color:red">{{caseLogObject.error_num}}</p></li>
              </ul>
          </div>
          <!-- <div id="casePic" :style="{width: '400px', height: '310px', margin: '0px 300px 0px '}"></div> -->
          
      </div>
      <div style="float:right;margin-bottom:10px;margin-right:10px;">
            <el-select v-model="gather_name" placeholder="请选择" 
                  @change = "changeGathers">
                  <el-option
                  v-for="item in resultGathers"
                  :key="item.gatherId"
                  :label="item.gatherName"
                  :value="item.gatherId">
                  </el-option>
              </el-select>
        </div>

      <!-- <div id="casePic" :style="{width: '400px', height: '310px'}"></div> -->
      
      <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand" style="display: flex;flex-grow: initial;flex-flow: row;flex-wrap: wrap;justify-content: space-between;">
                 <el-form-item label="返回结果：">
                    <json-viewer
                    style="width:600px;"
                    :value="props.row.result"
                    :expand-depth=2
                    copyable
                    boxed
                    sort></json-viewer>
                </el-form-item>
                <!-- <el-form-item label="接口请求头：">
                  <json-viewer
                    style="width:600px;"
                    :value="props.row.headers"
                    :expand-depth=0
                    boxed
                    sort></json-viewer>
                </el-form-item> -->
                <el-form-item label="断言数据：">
                    <el-table
                      ref="multipleTable"
                      :data="props.row.useCase"
                      tooltip-effect="dark"
                      >
                      <el-table-column
                      prop="procedures"
                        label="断言步骤"
                        width="400">
                        <template slot-scope="scope">
                          <el-row class="demo-autocomplete">
                          <el-col :span="102" >
                              <div  v-for="(value, key, index) in scope.row" :key="index" style="width:400px;display:flex;">
                                <div  v-for="(valueProcedures, keyProcedures, indexProcedures) in value.procedures" :key="indexProcedures">
                                  <p style="margin-right:5px;width:100px;">  {{valueProcedures.procedure}}</p>
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="procedures"
                        label="断言数据"
                        width="200">
                        <template slot-scope="scope">
                          <el-col :span="102">
                              <div  v-for="(value, key, index) in scope.row" :key="index">
                                <div  v-for="(valueAssert, keyAssert, indexAssert) in value.asserts" :key="indexAssert" >
                                  {{valueAssert.assert}}
                                </div>
                              </div>
                          </el-col>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="断言结果"
                        width="150">
                        <template slot-scope="scope">
                          <el-col :span="102">
                            <div  v-for="(value, key, index) in scope.row" :key="index">
                                <el-tag  v-for="(valueResult, keyResult, indexResult) in value.results" :type="valueResult.type" :key="indexResult">{{valueResult.result}}</el-tag>
                            </div>
                          </el-col>
                        </template>
                      </el-table-column>
                  </el-table> 
                </el-form-item>
                
                 <div>
                  <el-alert title="请求前Sql：" type="success" effect="dark" :closable="false"></el-alert>
                  <div v-for="(sql,index) in props.row.beforeSqls" :key="index">
                        <el-card shadow="always">
                          {{props.row.beforeSqls[index]}}
                      </el-card>
                  </div>
                </div>

                 <div>
                  <el-alert title="请求前Redis: " type="success" effect="dark" :closable="false"></el-alert>
                  <div v-for="(sql,index) in props.row.beforeRedis" :key="index" style="width:100%;">
                        <el-card shadow="always">
                          {{props.row.beforeRedis[index]}}
                        </el-card>
                  </div>
                </div>
                  <!-- <span>{{ props.row.useDatas }}</span>
                </el-form-item>  -->
               
                <el-form-item label="接口参数：">
                    <json-viewer
                    style="width:600px;"
                    :value="props.row.params"
                    :expand-depth=0
                    copyable
                    boxed
                    sort></json-viewer>
                </el-form-item>

                <el-form-item label="请求后SQL断言：">
                    <div v-for="(value, index) in props.row.assertSqls" :key="index">
                      {{value.sql}}
                       
                      <el-table
                        ref="multipleTable"
                        :data="value.sqlsTableDatas"
                        tooltip-effect="dark"
                        style="width: 100%"
                      >
                        <el-table-column
                          label="断言结果"
                          width="100">
                          <template slot-scope="scope">
                            <el-col :span="102">
                                <el-tag :type="scope.row['results'].type" >{{scope.row["results"].result}}</el-tag>
                            </el-col>
                          </template>
                        </el-table-column>
                      
                        <el-table-column 
                            v-for="(col,index) in value.sqlCols"
                            :key="index"
                            :label="col.label"
                            width="200"
                            >
                          <template slot-scope="scope">
                            <el-row class="demo-autocomplete">
                            <el-col :span="102" >
                                <div  >
                                  <el-tag v-if="scope.row[col.label].status == 0" type="success">{{scope.row[col.label].value}}</el-tag>
                                  <el-tag v-if="scope.row[col.label].status == 1" type="danger">{{scope.row[col.label].value}}</el-tag>
                                </div>
                              </el-col>
                            </el-row>
                          </template>
                        </el-table-column>
                      </el-table>
                  </div>
                </el-form-item>
                
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="测试用例集"
            prop="gatherName">
          </el-table-column>
          <el-table-column
            label="测试步骤ID"
            prop="flowId">
          </el-table-column>
          <el-table-column
            label="接口名"
            prop="interfaceName">
          </el-table-column>
          <el-table-column
            label="用例描述"
            prop="describe">
          </el-table-column>
          <el-table-column
            label="执行时间"
            prop="waiting">
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

      <el-pagination
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :total="pageCount"
      style="display:flex;justify-content:center;margin-top:50px"
      ></el-pagination>
    </div>
</template>

<script>
var gcaseId = 0
var GgatherId = 0
export default {
  mounted: function () {
      console.log(this.$route)
      var caseId = this.$route.params.caseId
      var that = this
      gcaseId = caseId
      that.getRunLog(caseId,1)
      // var interval3 = setInterval(function(){
      //   console.log(11)
      // },2000);
  },
  data() {
      return {
          tableData: [],
          charts: null,
          opinion:['用例通过','用例失败', '用例跳过'],
          pageCount: 0,
          opinionData: [],
          caseLogObject: {
            projectName: "", //项目名
            caseDate: "", //日期
            caseTime: "", //耗时
            amount: "", //测试总数量
            error_num: "", //测试失败数量
            success_num: "" //测试成功数量
          },
          resultGathers: [],
          gather_name: ""
      }
  },
  methods: {
    // changeEnt() {
    //     console.log(this.$data.environment)
    // },
     handleCurrentChange(val){
        console.log(val)
        this.getRunLog(gcaseId,val)
    },
    changeGathers(gatherId,v){
      GgatherId = gatherId
      this.getRunLog(gcaseId,1)
      this.$data.gather_name = GgatherId
    },
    getRunLog(caseId,page){
          this.$axios.get(
                    '/alter/project/getRunLog',
                    {
                      params: {caseId: caseId,page : page,gatherId: GgatherId}
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
              this.$data.caseLogObject = dataObj.caseLogObject
              this.$data.pageCount = dataObj.pageCount
              // this.createCasePic();

              this.$data.resultGathers = dataObj.resultGathers
              // this.$data.gather_name = dataObj.resultGathers[0].gatherId
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
.describe_content{
  color: rgb(118,138,167);
  font-size: 17px;
}
.el-form--inline .el-form-item{
  width: 760px;
  display:flex;
  flex-flow: column;
  font-weight: bold;
}
.describe_title{
  font-weight: bold;
  color: rgb(118,138,167);
  font-size: 20px;
  margin-right: 10px;
}
.describe li{
  display: flex;
  padding: 10px;
  line-height: 25px;
  float: left;
  margin-right: 20px;
}
.report_describe{
  display: flex;
  width: 80%;
  margin: auto;
  justify-content:center;
}
</style>