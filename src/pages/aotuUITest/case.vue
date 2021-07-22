<template>
    <div class="uicase">
        <el-table
        ref="multipleTable"
        :data="caseDatas"
        tooltip-effect="dark"
        style="width: 100%"
        >
        <el-table-column v-for="(col,index) in caseCols" :label="col.label" width="200" :key="index">
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
                <el-button type="primary" icon="el-icon-edit" size="medium"  circle  @click="editCase(scope.row.caseId,scope.row.caseName,scope.row.projectName,scope.row.describe)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="medium" circle @click="delectCase(scope.row.caseId)"></el-button>
            </template> 
        </el-table-column>
        </el-table>

      <el-dialog title="新增用例" :visible.sync="caseDialog" width="1400px" append-to-body :top="0">
        <el-form ref="form" :model="form" label-width="80px" >
            <div style="display:flex;">
                <el-form-item label="用例名称">
                    <el-input v-model="form.caseName"></el-input>
                </el-form-item>

                <el-form-item label="手机设备">
                    <el-select v-model="runConfig.device" placeholder="请选择" 
                    @change = "changeProject">
                        <el-option
                        v-for="item in devicesList"
                        :key="item.device"
                        :label="item.device"
                        :value="item.device">
                        </el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="用例描述">
                     <!-- type="textarea" -->
                    <el-input
                        placeholder="请输入描述内容"
                        v-model="form.describe"
                        maxlength="100"
                        style="width:500px;"
                        >
                        </el-input>
                </el-form-item>
            </div>

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
            

            <el-form-item label="步骤">
                <!-- <el-input v-model="form.name"></el-input> -->
                <el-button type="primary" plain size="mini" @click="addSteps">添加步骤</el-button>
                <el-button type="primary" plain size="mini" @click="runSteps">执行步骤</el-button>

                <el-button type="success" size="small" style="margin-left:50px;" @click="savaSteps">保存用例</el-button>
                <el-table
                ref="stepMultipleTable"
                :data="stepDatas"
                tooltip-effect="dark"
                style="width: 100%; height:100%;"
                border
                height="645"
                 @selection-change="handleSelectionChange"
               >    
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    
                    <el-table-column
                    label="序号"
                    prop="ID"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    width="220">
                    <template slot-scope="scope">
                        <el-row class="demo-autocomplete">
                        <el-col :span="102" >
                             <el-select v-model="scope.row.operation" placeholder="请选操作"
                                @change = "changeOperation($event,scope.$index)">
                                <el-option
                                v-for="item in operations"
                                :key="item.operationId"
                                :label="item.operationName"
                                :value="item.operationName"
                                >
                                </el-option>
                            </el-select>
                        </el-col>
                        </el-row>
                    </template>
                    </el-table-column>

                     <el-table-column
                    label="页面"
                    width="220">
                    <template slot-scope="scope">
                        <el-row class="demo-autocomplete">
                        <el-col :span="102" >
                             <el-select v-if="scope.row.isActivity === true"  v-model="scope.row.activityId" placeholder="请选页面"
                                @change = "changeActivity($event,scope.$index)">
                                <el-option
                                v-for="item in scope.row.activitys"
                                :key="item.activityId"
                                :label="item.activityName"
                                :value="item.activityId">
                                </el-option>
                            </el-select>
                        </el-col>
                        </el-row>
                    </template>
                    </el-table-column>

                     <el-table-column
                    label="元素"
                    width="220">
                    <template slot-scope="scope">
                        <el-row class="demo-autocomplete">
                        <el-col :span="102" >
                             <el-select v-if="scope.row.isElement === true" v-model="scope.row.elementId" placeholder="请选页面"
                                >
                                <el-option
                                v-for="item in scope.row.elements"
                                :key="item.id"
                                :label="item.element_name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        </el-row>
                    </template>
                    </el-table-column>
                    <el-table-column
                    label="内容"
                    width="250">
                    <template slot-scope="scope">
                        <el-row class="demo-autocomplete">
                        <el-col :span="102" >
                            <div  >
                            <el-input
                                v-if="scope.row.isInput === true"
                                class="inline-input"
                                v-model="scope.row.content"
                                placeholder="请输入内容"
                            ></el-input>
                            </div>
                        </el-col>
                        </el-row>
                    </template>
                    </el-table-column>

                    <el-table-column
                    prop="name"
                    label="操作"
                    width="100">
                    <template slot-scope="scope" >
                        <el-col :span="502" style="display:flex;">
                            <div style="width:100%;">
                                <i class="el-icon-close" @click="deleteStepData(scope.$index,scope.row.ID)"></i>
                                <i class="el-icon-top" @click="topStep(scope.$index,scope.row.ID)"></i>
                            </div>
                        </el-col>
                    </template>

                    </el-table-column>
                </el-table>
               
            </el-form-item>

        </el-form>
      </el-dialog>
    </div>
</template>

<script>
var gCaseId = 0
import GLOBAL from '../../utils/global_variable.js';
export default {
  data() {
      return {
        caseDatas: [],
        caseCols: [],
        caseDialog: false,
        form: {
            caseName: "",
            projectName: "",
            describe: "",
            operation: 0
        },
        runConfig:{
            device: ""
        },
        activitysList: [],
        uiProjectList: [],
        stepDatas: [],
        operations: [],
        activitys: [],
        elements: [],
        stepsSelection: [],
        devicesList: []
      }
  },
   mounted(){
    this.getCases()
    this.getActivitys(24)

    if (GLOBAL.uiProjectId === 0 || GLOBAL.uiProjectList.length === 0){
        this.$axios.get(
                      '/alter/project/getProjects',
                      {
                             params: {
                                  type: 1
                              }
                          }
        ).then(data => {
            var dataObj = data.data
            GLOBAL.interfaceProjectList = dataObj.obj
            GLOBAL.projectName = dataObj.obj[0].projectName
            GLOBAL.interfaceProjectId = dataObj.obj[0].id

            this.$data.interfaceProjectList = dataObj
            this.$data.project_name = dataObj.obj[0].id
        })
    }else{
        this.$data.uiProjectList = GLOBAL.uiProjectList
        this.$data.project_name = GLOBAL.uiProjectId
    }
    

  },
  methods: {
      getCases(){
        this.$axios.get(
            '/alter/ui_case/uICaseOperation',
        ).then(data => {
            var dataObj = data.data.obj
            this.$data.caseCols = dataObj.caseCols
            this.$data.caseDatas = dataObj.cases
        })
      },

    //   获取步骤，编辑用例
      getSteps(caseId){
          this.$axios.get(
            '/alter/ui_case/uiStepOperation',
            {
                params: {
                    caseId: caseId
                }
            }
        ).then(data => {
            var dataObj = data.data.obj
            this.$data.stepDatas = dataObj.steps
            this.$data.operations = dataObj.operations
            this.$data.activitys = dataObj.activitys
        })
      },
      getElements(activityId,stepId){
        this.$axios.get(
            '/alter/element/elementsOperation',
            {
                params: {
                    activityId: activityId
                }
            }
        ).then(data => {
            var dataObj = data.data
            this.$data.elements = dataObj
            if (dataObj.length === 0){
                return
            }
            console.log(this.$data.stepDatas)
            this.$data.stepDatas[stepId].elements = dataObj
            // this.$data.stepDatas[stepId].element_name = dataObj[0].element_name
            console.log(this.$data.stepDatas)
            this.$data.stepDatas = this.$data.stepDatas

        })
     },
     topStep(){

     },

     changeActivity(activityId,stepId){
         this.getElements(activityId,stepId)
        //  this.$data.stepDatas[stepId].element_name = this.$data.elements[0].element_name
     },

     runSteps(){
         if (this.$data.runConfig.device === undefined || this.$data.runConfig.device === ""){
            this.$message({
                message: "请选择手机设备",
                type: 'warning'
            });
            return
         }
         if (this.$data.stepsSelection.length === 0){
            this.$message({
                message: "请选择需要执行的步骤",
                type: 'warning'
            });
            return
         }
         
        this.$axios(
            {
                url: '/alter/ui_case/runSteps',
                method: 'POST',
                data: {
                    device: this.$data.runConfig.device,
                    steps: this.$data.stepsSelection,
                    isAgain: 0
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(data => {
            // this.getElements(gActivityId)
             var dataObj = data.data
            if (dataObj.status === 200) {
                this.$message({
                    message: dataObj.message,
                    type: 'success'
                });
                // 步骤执行完， 取消选择项
                this.$refs.stepMultipleTable.clearSelection();
            } else {
                this.$message({
                    message: dataObj.message,
                    type: 'warning'
                });
            } 
        })


     },
     editCase(caseId,caseName,projectName,describe){
         this.$data.form.caseName = caseName
        //  this.$data.form.projectName = projectName
         this.$data.form.describe = describe
         this.$data.caseDialog = true
         gCaseId = caseId
        this.getSteps(caseId)
        this.$axios.get(
            '/alter/ui_suite/getStartupConfig',
        ).then(data => {
            var dataObj = data.data.obj
            this.$data.devicesList = dataObj.devices
            this.$data.runConfig.device = dataObj.devices[0].device
        })
     },
     changeOperation(operationName,stepId) {
          this.$data.stepDatas[stepId].isActivity = true
          this.$data.stepDatas[stepId].isElement = true
          this.$data.stepDatas[stepId].isInput = false

         
          if (operationName === "输入"){
              this.$data.stepDatas[stepId].isInput = true
          }

          if (operationName === "断言跳转" || operationName === "切换界面"){
              this.$data.stepDatas[stepId].isElement = false
          }

          if (operationName === "左滑" || operationName === "右滑" || operationName === "上滑" || operationName === "下滑" || operationName === "返回"){
              this.$data.stepDatas[stepId].isActivity = false
              this.$data.stepDatas[stepId].isElement = false
          }
          
     },
      handleSelectionChange(val) {
        this.$data.stepsSelection = val;
      },
      getActivitys(projectId){
        this.$axios.get(
            '/alter/element/activityManage',
            {
                params: {
                    projectId: projectId
                }
            }
        ).then(data => {
            var dataObj = data.data
            this.$data.activitys = dataObj
        })
    },
      addSteps(){
          this.$data.stepDatas.push({
              operation: '点击',
              activityId: null,
              elementId: null,
              content: '',
              activitys: this.$data.activitys,
              elements: [],
              isInput: false,
              isElement: true,
              isActivity: true
          })
    },
    savaSteps(){
        var caseName = this.$data.form.caseName
        // var projectName = this.$data.form.projectName
        var describe = this.$data.form.describe
        var stepDatas = this.$data.stepDatas

        this.$axios(
            {
                url: '/alter/ui_case/uiStepOperation',
                method: 'POST',
                data: {
                    caseId: gCaseId,
                    stepDatas: stepDatas,
                    caseName: caseName,
                    describe: describe
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(data => {
            // this.getElements(gActivityId)
             var dataObj = data.data
            if (dataObj.status === 200) {
                this.$message({
                    message: dataObj.message,
                    type: 'success'
                });
                this.getSteps(gCaseId)
            } else {
                this.$message({
                    message: dataObj.message,
                    type: 'warning'
                });
            } 
        })
    },
    delectCase(caseId) {
        this.$axios(
            {
                url: '/alter/ui_case/delectCase',
                method: 'POST',
                data: {
                    caseId: caseId
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(data => {
            this.getCases()
        })
    },
    deleteStepData(rowIndex,stepId) {
        this.$data.stepDatas.splice(rowIndex, 1)
        console.log(stepId)
        if (stepId === undefined){
            return
        }
        this.$axios(
            {
                url: '/alter/ui_case/deleteStep',
                method: 'POST',
                data: {
                    stepId: stepId
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(data => {
            
        })
    }, 
  }
}
</script>