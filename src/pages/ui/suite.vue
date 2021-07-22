<template>
    <div class="suite">
       <el-table
        ref="multipleTable"
        :data="suiteDatas"
        tooltip-effect="dark"
        style="width: 100%"
        >
        <el-table-column 
            v-for="(col,index) in suiteCols"
            :label="col.label"
            :key="index"
            width="200"
            >
            <template slot-scope="scope">
                <el-row class="demo-autocomplete">
                    <el-col :span="102" >
                    <div  >
                        <el-tag  type="success">{{scope.row[col.label]}}</el-tag>
                    </div>
                    </el-col>
                </el-row>
                </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="400"> 
            <template slot-scope="scope">
                <el-button type="primary"  icon="el-icon-edit"  circle  size="medium"  @click="editSuite(scope.row.suiteId,scope.row.suiteName,scope.row.projectName,scope.row.describe,scope.row.caseIds)"></el-button>
                <el-button type="primary" icon="el-icon-video-play"  circle size="medium"  @click="runSuite(scope.row.suiteId)"></el-button>
            </template> 
        </el-table-column>
        </el-table>

      <el-dialog title="新增用例" :visible.sync="suiteDialog" width="1000px"  append-to-body :top="20">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="套件名名: ">
                <el-input v-model="form.suiteName" style="width:300px;"></el-input>
            </el-form-item>
              <!-- <el-form-item label="所属项目">
                 <el-select v-model="form.projectName" placeholder="请选择" 
                @change = "changeProject">
                    <el-option
                    v-for="item in uiProjectList"
                    :key="item.id"
                    :label="item.projectName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item> -->

            <el-form-item label="测试用例: ">
                <el-transfer style="display:flex;align-items:center;justify-content:center;height:400px;" v-model="caseValue" filterable :data="caseData" :titles="['用例集', '执行用例']" :button-texts="['取消执行', '加入执行']">
                </el-transfer>
            </el-form-item>

            <el-form-item label="用例描述: ">
                <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="form.describe"
                    maxlength="100"
                    show-word-limit
                    >
                    </el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" style="margin:auto;display:flex;" @click="savaSuite">保存</el-button>
      </el-dialog>

      
      <el-dialog title="启动配置" :visible.sync="suiteRunDialog" width="1300px"  append-to-body>
        <el-form ref="runConfig" :model="runConfig" label-width="80px">
              <el-form-item label="手机设备">
                 <el-select v-model="runConfig.deviceId" placeholder="请选择" 
                @change = "changeProject">
                    <el-option
                    v-for="item in devicesList"
                    :key="item.id"
                    :label="item.device"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-button type="primary" style="margin:auto;display:flex;" @click="startSuite">运行</el-button>
      </el-dialog>
    </div>
</template>

<script>
var gSuiteId = 0
export default {
  data() {
      return {
        suiteDatas: [],
        suiteCols: [],
        suiteDialog: false,
        suiteRunDialog: false,
        form: {
            suiteName: "",
            projectName: "",
            describe: ""
        },
        runConfig:{
          deviceId: ""
        },
        caseData: [],
        caseValue: [],
        devicesList: []
      }
  },
  mounted(){
    this.getSuites()
  },
  methods: {
    getSuites(){
      this.$axios.get(
          '/alter/ui_suite/uiSuiteOperation',
      ).then(data => {
          var dataObj = data.data.obj
          this.$data.suiteCols = dataObj.suiteCols
          this.$data.suiteDatas = dataObj.suites
      })
    },
    runSuite(suiteId){
      gSuiteId = suiteId
      this.$data.suiteRunDialog = true
      this.$axios.get(
          '/alter/ui_suite/getStartupConfig',
      ).then(data => {
          var dataObj = data.data.obj
          this.$data.devicesList = dataObj.devices
          this.$data.runConfig.deviceId = dataObj.devices[0].id
      })
    },
    editSuite(suiteId,suiteName,projectName,describe){
        this.$data.form.suiteName = suiteName
      //  this.$data.form.projectName = projectName
        this.$data.form.describe = describe
        this.$data.suiteDialog = true
        gSuiteId = suiteId
        this.getUiCases(24,suiteId)
     },
     startSuite(){
        var deviceId = this.$data.runConfig.deviceId
        this.$axios(
            {
                url: '/alter/ui_suite/runSuite',
                method: 'POST',
                data: {
                    suiteId: gSuiteId,
                    userId: 2,
                    deviceId: deviceId,
                    isAgain: 0
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(data => {
             var dataObj = data.data
            if (dataObj.status === 200) {
                this.$message({
                    message: dataObj.message,
                    type: 'success'
                });
            } else {
                this.$message({
                    message: dataObj.message,
                    type: 'warning'
                });
            } 
        })
     },
     savaSuite(){
        var suiteName = this.$data.form.suiteName
        // var projectName = this.$data.form.projectName
        var describe = this.$data.form.describe
        var caseValue = this.$data.caseValue

        this.$axios(
            {
                url: '/alter/ui_suite/uiSuiteOperation',
                method: 'POST',
                data: {
                    suiteId: gSuiteId,
                    caseValue: caseValue,
                    suiteName: suiteName,
                    describe: describe
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(data => {
            // this.getUiCases(24)
            this.getSuites()
        })
     },
     getUiCases(projectId,suiteId){
        this.$axios.get(
          '/alter/ui_case/getUiCases',
          {
          params: {
                    projectId: projectId,
                    suiteId: suiteId
                }
            }
        ).then(data => {
            var dataObj = data.data.obj
            this.$data.caseData = dataObj.cases
            this.$data.caseValue = dataObj.caseIds
        })
     }
  }
}
</script>
<style scoped>

.el-transfer-panel{
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    display: inline-block;
    vertical-align: middle;
    width: 250px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
}

</style>