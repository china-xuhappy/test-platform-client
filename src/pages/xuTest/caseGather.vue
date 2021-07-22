<template>
    <div id="box">
         <el-form ref="form" :model="search" label-width="80px" style="display:flex;">
            <el-form-item label="项目：">
            <el-select v-model="project_name" placeholder="请选择" 
                @change = "changeProject">
                <el-option
                v-for="item in interfaceProjectList"
                :key="item.id"
                :label="item.projectName"
                :value="item.id">
                </el-option>
            </el-select>
            </el-form-item>

          <!-- <el-form-item label="接口名称">
            <el-input v-model="search.interfaceName"></el-input>
          </el-form-item> -->

          <el-form-item>
              <el-button class="addBtn" type="primary " @click="addGather" size="small" style="margin-bottom:10px;" >新增用例</el-button>

              <el-button class="addBtn" type="primary " @click="addFlows('',0,0)" size="small" style="margin-bottom:10px;">添加步骤</el-button>

              <el-button class="addBtn" type="primary " @click="runFlows" size="small" style="margin-bottom:10px;">执行步骤</el-button>


              <!-- <el-button class="addBtn" type="primary " @click="savaFlows" size="small" style="margin-bottom:10px;" >保存用例</el-button> -->
            <!-- <el-button type="primary" @click="searchInterfase">搜索接口</el-button> -->
            <!-- <el-button type="primary"> 添加接口 </el-button> -->
            <!-- <el-button type="primary"  @click="addCatalogue">添加目录</el-button> -->
          </el-form-item>
      </el-form>

        <div style="display:flex;">
            <div class="box" v-infinite-scroll="load" infinite-scroll-disabled="disabled" >
                <!-- <p style="text-align:center;display:block;height:50px;font-size:23px;color:red;">测试用例集</p> -->
                <ul class="list" >
                    <li v-for="(i,index) in list" class="list-item" :key="index" @click="changeGather(i.id);" :class="{clickstyle:changeGatherNum == i.id}" >{{ i.gatherName }}</li>
                </ul>
                <!-- <p v-if="loading" style="margin-top:10px;" class="loading">
                <span></span>
                </p> -->
                <!-- <p v-if="noMore" style="margin-top:10px;font-size:13px;color:#ccc;text-align:center;">没有更多了</p> -->
            </div>

            <div style="width:100%;">
                <el-table :data="cases"
                    border
                    ref="multipleTable"
                    row-key="id"
                    align="left"
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                    >
                    <el-table-column
                        type="selection"
                        width="40">
                    </el-table-column>
                      <!-- (flowId) -->
                    <el-table-column 
                        label="步骤ID" 
                        width="70"> 
                        <template slot-scope="scope">
                            {{scope.row.flowId}}
                        </template>
                    </el-table-column>

                    <el-table-column 
                        label="参数Id"
                        width="70"> 
                        <template slot-scope="scope">
                            {{scope.row.params['id']}}
                        </template>
                    </el-table-column>

                    <el-table-column 
                        label="接口名"
                        width="500"> 
                        <template slot-scope="scope">
                            {{scope.row.params['describe']}}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column v-for="(item, index) in col"
                        :key="`col_${index}`"
                        :prop="dropCol[index].prop"
                        :label="item.label"
                        width="600"> 
                    <template slot-scope="scope">
                            {{scope.row.params[item['prop']]}}
                        </template>
                    </el-table-column> -->

                    <el-table-column
                        label="操作"
                        width="400"> 
                        <template slot-scope="scope">
                            <el-button type="primary" round @click="openInterfasUseDatas(scope.row.flowId)">动态参数</el-button>
                            <el-button type="danger" icon="el-icon-delete" circle @click="delectInterfas(scope.row.flowId)"></el-button>
                            <el-button type="primary" icon="el-icon-top" circle @click="topCases(scope.row.flowId)"></el-button>
                            <el-button type="primary" round @click="openInterfasParameter(scope.row.flowId)">参数操作</el-button>
                        </template> 
                    </el-table-column>
            </el-table>
            </div>
        </div>
        
      <el-dialog title="接口动态参数" :visible.sync="interfaceDatasDialog" width="1300px" append-to-body :before-close="useDatasClose" :top="10" >
          <!-- 动态参数 -->
          <div style="display:flex;align-items:center;">            
              <el-checkbox-group v-model="flow.isSavaVariable" @change="changeSavaVariable">
                <el-checkbox label="是否把返回结果保存变量" name="type"></el-checkbox>
              </el-checkbox-group>
              <el-input
                  placeholder="请输入变量名"
                  v-model="flow.variableName"
                  style="width:250px;"
                  v-if="flow.variableInput === true"
                  ></el-input>
          </div>
         
          <!-- 数据断言 -->
          <div v-for="(testsValue, testsIndex) in initialTests" class="asserts">
              <el-alert
              title="接口动态参数"
              type="success"
              effect="dark"
              :closable="false"></el-alert>
              <el-table
                ref="multipleTable"
                :data="flow.interfaceUseDatas"
                tooltip-effect="dark"
                class="assert"
                >
                <el-table-column
                  label="参数名"
                  width="200">
                  <template slot-scope="scope">
                    <el-row class="demo-autocomplete">
                    <el-col :span="102" >
                        <div  >
                          <el-input
                            class="inline-input"
                            v-model="scope.row.variableName"
                            placeholder="请输入变量名"
                          ></el-input>
                        </div>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="参数值"
                  width="800">
                  <template slot-scope="scope" >
                      <el-col :span="502" style="display:flex;">
                        <el-select v-model="scope.row.typeOptions" placeholder="请选择" style="width:180px;">
                          <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <div style="width:100%;display:flex;">
                            <el-input
                            v-for="(valueVariable, keyVariable, indexVariable) in scope.row.variableValue"
                              class="inline-input"
                              v-model="scope.row.variableValue[keyVariable]"
                              placeholder="请输入变量值"
                            ></el-input>
                          </div>
                      </el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="操作"
                  width="100">
                  <template slot-scope="scope" >
                      <el-col :span="502" >
                        <div style="width:100%">
                            <i class="el-icon-plus" @click="plusDataProcedure(1)"></i>
                            <i class="el-icon-close" @click="closeDataProcedure(scope.$index,1)"></i>
                          </div>
                      </el-col>
                  </template>

                </el-table-column>
              </el-table>

             <el-alert
              title="请输入前置执行SQL"
              type="success"
              effect="dark"
              :closable="false"></el-alert>
              <div v-for="(sql,index) in testsValue.beforeSqls" class="assert" style="display: flex;">
                <el-input
                type="textarea"
                :autosize="{ minRows: 2}"
                placeholder="请输入前置执行SQL"
                v-model="testsValue.beforeSqls[index]"
                style="width:90%;"
                ></el-input>

                <div class="before_sqls_cz">
                  <i class="el-icon-plus" @click="addTestBeforeSqls(testsIndex)"></i>
                  <i class="el-icon-close" @click="closeTestBeforeSqls(testsIndex,index)"></i>
                </div>
              </div>

            <el-alert
              title="断言步骤："
              type="success"
              effect="dark"
              :closable="false"></el-alert>
              <el-table
                ref="multipleTable"
                :data="testsValue.assertData"
                tooltip-effect="dark"
                class="assert">
               
                <el-table-column
                  label="断言步骤"
                  width="400">
                  <template slot-scope="scope">
                    <el-row class="demo-autocomplete">
                     <el-col :span="102" >
                        <div  v-for="(value, key, index) in scope.row">
                          <el-input
                           v-for="(valueProcedures, keyProcedures, indexProcedures) in value.procedures"
                            placeholder="选择断言内容"
                            v-model="valueProcedures.procedure"
                          ></el-input>
                        </div>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="断言数据"
                  width="400">
                  <template slot-scope="scope">
                     <el-col :span="102">
                       <div  v-for="(value, key, index) in scope.row">
                          <el-input
                            v-for="(valueAssert, keyAssert, indexAssert) in value.asserts"
                            class="inline-input"
                            v-model="valueAssert.assert"
                            placeholder="选择断言内容"
                          ></el-input>
                        </div>
                    </el-col>
                  </template>
                </el-table-column>

                 <el-table-column
                  prop="name"
                  label="操作"
                  width="200">
                  <template slot-scope="scope">
                     <el-col :span="102">
                          <i class="el-icon-plus" @click="plusProcedure(testsIndex)"></i>
                          <i class="el-icon-close" @click="closeProcedure(testsIndex,scope.$index)"></i>
                    </el-col>
                  </template>
                </el-table-column>
                
              </el-table>

            
            <el-alert
              title="后置SQL断言"
              type="success"
              effect="dark"
              :closable="false"></el-alert>
             

            <div v-for="(value, index) in testsValue.assertSqls" class="assert" style="position:relative;">
                 
              <div class="after_sqls_cz">
                  <i class="el-icon-plus" @click="addAssertSqls"></i>
                  <i class="el-icon-close" @click="closeAssertSqls(index)"></i>
                </div>

              <el-input
                type="textarea"
                :autosize="{ minRows: 2}"
                placeholder="请输入后置断言SQL"
                v-model="value.sql"
                ></el-input>
                <el-button type="success" size="mini" round @click="runSql(testsIndex,index)" style="display:flex;margin:auto;">执行断言SQL</el-button>

                
                <el-table
                ref="multipleTable"
                :data="value.sqlsTableDatas"
                tooltip-effect="dark"
                style="width: 100%"
               >
               
                <el-table-column 
                    v-for="col in value.actualCols"
                    :label="col.label"
                    width="160"
                    >
                   <template slot-scope="scope">
                    <el-row class="demo-autocomplete">
                     <el-col :span="102" >
                        <div  >
                          <el-input
                            class="inline-input"
                            v-model="scope.row[col.label].value"
                            placeholder="请输入内容"
                          ></el-input>
                        </div>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                
              </el-table>
              
              
            </div>

          </div>

      </el-dialog>

      <el-dialog title="添加流程接口" :visible.sync="flowsDialogFormProject" width="500px" append-to-body>
        <el-form :model="form">
          <!-- <el-form-item label="流程名" :label-width="formLabelWidth">
            <el-input v-model="flowName" autocomplete="off"></el-input>
          </el-form-item> -->

          <el-select v-model="interfaceValue" filterable placeholder="接口" style="width:100%">
            <el-option
                v-for="item in interfaces"
                :key="item.value"
                :paramId="item.paramId"
                :value="item.value"
                >
            </el-option>
        </el-select>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addFlows('确定',1,0)">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加用例集" :visible.sync="gatherDialogFormProject" width="500px" append-to-body>
        <el-form :model="form">
          <el-form-item label="用例集名" :label-width="formLabelWidth">
            <el-input v-model="gatherName" autocomplete="off"></el-input>
          </el-form-item>

          
        </el-form>
          <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addGather('确定',0)">保存</el-button>
            </div>
      </el-dialog>


         
      <el-dialog title="操作参数" :visible.sync="interfaceParameterDialog" width="1300px" append-to-body :before-close="parametersClose">
          <!-- 操作参数 -->
          <el-table
            ref="multipleTable"
            :data="interfaceParameterDatas"
            tooltip-effect="dark"
            style="width: 100%"
            >
            <el-table-column
              label="变量名"
              width="200">
              <template slot-scope="scope">
                <el-row class="demo-autocomplete">
                <el-col :span="102" >
                    <div  >
                      <el-input
                        class="inline-input"
                        v-model="scope.row.variableName"
                        placeholder="请输入变量名"
                      ></el-input>
                    </div>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="变量值"
              width="900">
              <template slot-scope="scope" >
                  <el-col :span="502" style="display:flex;">
                    <el-select v-model="scope.row.typeOptions" placeholder="请选择" style="width:180px;">
                      <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <div style="width:100%;display:flex;">
                        <el-input
                          class="inline-input"
                          v-model="scope.row.variableValue"
                          placeholder="请输入变量值"
                        ></el-input>
                      </div>
                  </el-col>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="操作"
              width="100">
              <template slot-scope="scope" >
                  <el-col :span="502" style="display:flex;">
                    <div style="width:100%;">
                        <i class="el-icon-plus" @click="plusDataProcedure(2)"></i>
                        <i class="el-icon-close" @click="closeDataProcedure(scope.$index,2)"></i>
                      </div>
                  </el-col>
              </template>

            </el-table-column>
          </el-table>
      </el-dialog>

    </div>
</template>

<script>
var gatherId = 0
var gParamId = 0
var gFlowId = 0
var initTableData = 
                [
                  {
                    procedures: [
                      {
                        procedure: ''
                      }
                    ],
                    asserts: [{
                      assert: ''
                    }],
                    results: [{
                      result: '成功',
                      type: 'warning'
                    }]
                  }
                ]
var sqlInitTableData = 
      [{
        sql: '',
        actualCols: [],
        sqlsTableDatas : [{
              fieldName: '',
              fieldValue: '',
              results: [{
                result: '成功',
                type: 'warning'
              }]
          }]
      }]
import GLOBAL from '../../utils/global_variable.js';
export default {
  data() {
      return {
        count:1,
        changeGatherNum:0,
        loading: false,
        totalPages: "",
        list: [],
        project_name: '',
        interfaceProjectList: [],
        interfaceParameterDatas:[],
        cases: [],
        flow:{
          interfaceUseDatas:[],
          isSavaVariable: false,
          variableName: '',
          variableInput: false
        },
        interfaceDatasDialog: false,
        flowsDialogFormProject: false,
        interfaceParameterDialog: false,
        flowName: '',
        interfaces: [],
        interfaceValue: '',
        gatherName: '',
        gatherDialogFormProject: false,
        initialTests: [
          {
            assertData: [initTableData],
            beforeSqls: [''],
            assertSqls: sqlInitTableData
          }
        ],
        restaurants: [],
        typeOptions:[
           {
            value: 'String',
            label: 'String数据'
          },
          {
            value: 'Int',
            label: 'Int数据'
          },
          {
            value: 'Json',
            label: 'json数据'
          },
          // {
          //   value: 'interface',
          //   label: '请求接口'
          // }
        ]
      }
  },
  computed: {
    // noMore() {
    //   //当起始页数大于总页数时停止加载
    //   return this.count >= this.totalPages - 1;
    // },
    disabled() {
      return this.loading || this.noMore;
    }
  },
  created() {
    this.getCaseGather();
    if (GLOBAL.projectId === 0 || GLOBAL.interfaceProjectList.length === 0){
      this.$axios.get(
                      '/alter/project/getProjects'
        ).then(data => {
            var dataObj = data.data
            GLOBAL.interfaceProjectList = dataObj.obj
            GLOBAL.projectName = dataObj.obj[0].projectName
            GLOBAL.projectId = dataObj.obj[0].id

            this.$data.interfaceProjectList = dataObj.obj
            this.$data.project_name = dataObj.obj[0].projectName
        })
    }else{
      this.$data.interfaceProjectList = GLOBAL.interfaceProjectList
      this.$data.project_name = GLOBAL.projectName
    }
    

    
  },
  methods: {
    //   从用例集删除
      delectInterfas(flowId){
        this.$axios({
                url: '/alter/case/deleteCases',
                method: 'POST',
                data: {
                  flowId: flowId
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(data => {
                this.$message({
                  message: "删除成功",
                  type: 'success'
                });
                this.changeGather(gatherId)
            })
      },
      openInterfasUseDatas(flowId){
        gFlowId = flowId
        this.$data.interfaceDatasDialog = true
        this.$axios.get(
                    '/alter/interface/getInterfaceDatas',
                  {
                    params: {
                      flowId: flowId
                    }
                  }
        ).then(data => {
            var dataObj = data.data.obj
            this.$data.flow.interfaceUseDatas = dataObj.dynamicVariable
            var rests = dataObj.rests
            this.$data.initialTests = dataObj.initialTests

            rests = JSON.parse(rests)
            this.$data.flow.variableName = rests.variableName
            if (rests.isVariable === "false" || rests.isVariable === false){
              this.$data.flow.isSavaVariable = false
              this.$data.flow.variableInput = false
            }else{
              this.$data.flow.isSavaVariable = true
              this.$data.flow.variableInput = true
            }
          })
      },
      openInterfasParameter(flowId){
          gFlowId = flowId
          this.$data.interfaceParameterDialog = true
          this.$axios.get(
                      '/alter/interface/getInterfaceParameters',
                    {
                      params: {
                        flowId: flowId
                      }
                    }
          ).then(data => {
              var dataObj = data.data.obj
              this.$data.interfaceParameterDatas = JSON.parse(dataObj.Parameters)
        })
    },
    load() {
      //滑到底部时进行加载
      if (this.$data.count < 2){
          setTimeout(() => {
            this.$data.count += 1; //页数+1
            this.getCaseGather(); //调用接口，此时页数+1，查询下一页数据
        }, 2000);
      }
      
    },
    getCaseGather() {
      this.$axios.get(
            '/alter/case/caseGatherOperation',
            {
                params: {
                    projectId: GLOBAL.projectId,
                    page_index: this.$data.count
                }
            }
        ).then(data => {
          this.$data.list = this.$data.list.concat(data.data); //因为每次后端返回的都是数组，所以这边把数组拼接到一起
          this.totalPages = 3;
          this.loading = false;
        })
    },
     changeProject(projectId,v){
        GLOBAL.projectId = projectId
         var project = this.$data.interfaceProjectList.find((item)=>{
              console.log(item.value)
            return item.id === projectId;
          });
         GLOBAL.projectName = project.projectName
        this.$data.count = 1
        this.$data.list = []
        this.getCaseGather()
    },

    changeGather(gather){
        this.$data.changeGatherNum = gather
        gatherId = gather
        this.$axios.get(
            '/alter/case/getCases',
            {
                params: {
                    gatherId: gatherId
                }
            }
        ).then(data => {
            var dataObj = data.data
            this.$data.cases = dataObj.obj
        })
        
    },
    addGather(scene){
        if (scene === '确定') {
            this.$axios(
                {
                    url: '/alter/case/caseGatherOperation',
                    method: 'POST',
                    data: {
                        gatherName: this.$data.gatherName,
                        projectId: GLOBAL.projectId
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(data => {
                 this.$data.gatherDialogFormProject = false
                 this.$data.count = 1
                 this.$data.list = []
                this.getCaseGather()
            })
        }else{
            this.$data.gatherDialogFormProject = true

        }

    },
    useDatasClose (done){
      console.log(1111)
      this.addFlows('确定',2,1)
      done()
    },
    parametersClose(done){
      this.addFlows('确定',2,2)
      done()
    },
    runFlows() {
        if (gatherId === 0){
            this.$message({
                  message: "请选择用例集",
                  type: 'warning'
                });
            return;
        }
        this.$axios(
            {
                url: '/alter/project/runFlows',
                method: 'POST',
                data: {
                    flows: [this.multipleSelection],
                    environment: GLOBAL.interceptor,
                    gatherId: gatherId,
                    projectId: GLOBAL.projectId,
                    userId: GLOBAL.userInfo.userId
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(data => {
            var dataObj = data.data
            this.$data.reportId = dataObj.obj
            if (dataObj.status === 200) {
                let routeObj = this.$router.resolve('/reportDetail/' + dataObj.obj);
                window.open(routeObj.href, '_blank');
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
      // savaFlows() {
      //   this.$axios(
      //       {
      //           url: '/alter/project/savaFlows',
      //           method: 'POST',
      //           data: {
      //               flows: [this.multipleSelection]
      //           },
      //           headers: {
      //               'Content-Type': 'application/json'
      //           }
      //       }
      //   ).then(data => {
      //       var dataObj = data.data
      //       this.$data.reportId = dataObj.obj
      //       if (dataObj.status === 200) {
      //           this.$message({
      //               message: dataObj.message,
      //               type: 'success'
      //           });
      //       } else {
      //           this.$message({
      //             message: dataObj.message,
      //             type: 'warning'
      //           });
      //       } 
      //   })
      // },
      addFlows(scene,newType,typeStatus){
           if (gatherId === 0){
                this.$message({
                    message: "请选择用例集",
                    type: 'warning'
                    });
                return;
            }
          var params = this.$data.interfaces.find((item)=>{
              console.log(item.value)
            return item.value === this.$data.interfaceValue;
          });
          if (newType === 1){
            var variableName = ''
            var isVariable = false
            var dynamicVariable = [params.dynamicVariable]
            var initialTests = [JSON.parse(params.initialTests)]
            gParamId = params.paramId
            gFlowId = params.flowId
            var parameters = []
          }else if(newType === 2){
            var dynamicVariable = [this.$data.flow.interfaceUseDatas]
            var variableName = this.$data.flow.variableName
            var isVariable =  this.$data.flow.variableInput
            var initialTests = [this.$data.initialTests]
            var parameters = [this.$data.interfaceParameterDatas]
          }
          if (scene === '确定') {
              this.$axios({
                url: '/alter/project/flowOperation',
                method: 'POST',
                data: {
                  name: this.$data.flowName,
                  paramsId: gParamId,
                  gatherId: gatherId,
                  dynamicVariable: dynamicVariable,
                  initialTests: initialTests,
                  parameters: parameters,
                  rests: {
                    variableName: variableName,
                    isVariable: isVariable
                  },
                  flowId: gFlowId,
                  typeStatus: typeStatus
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(data => {
                this.$data.flowsDialogFormProject = false
                this.changeGather(gatherId)
            })
          } else {
            this.$data.flowsDialogFormProject = true
            this.$axios.get(
                    '/alter/interface/getIterfaces',
                    {
                        params:{
                            projectId: GLOBAL.projectId
                        }
                    }
            ).then(data => {
                var dataObj = data.data.obj
                this.$data.interfaces = dataObj

            })
          }
      },
      topCases (flowId){
          this.$axios({
              url: '/alter/case/topCases',
              method: 'POST',
              data: {
                flowId: flowId,
                gatherId: gatherId
              },
              headers: {
                  'Content-Type': 'application/json'
              }
          }).then(data => {
              var dataObj = data.data
              this.$message({
                  message: dataObj.message,
                  type: 'success'
              });
              this.changeGather(gatherId)
          })
      },
      plusDataProcedure(type) {
        console.log(type)
        if (type === 1){
          var dynamicVariable = this.$data.flow.interfaceUseDatas
          var length = dynamicVariable[0].variableValue.length
          var variableValues = []
          for (var i=0; i< length;i++){
              variableValues.push('')
          }
          this.$data.flow.interfaceUseDatas.push({
                variableName: '',
                variableValue: variableValues,
                typeOptions: 'String'
          })
        }else if (type === 2){
          this.$data.interfaceParameterDatas.push({
                variableName: '',
                variableValue: '',
                typeOptions: 'String'
          })
        }
      },
      closeDataProcedure(rowIndex,type) {
        if (rowIndex === 0) {
          return;
        }
        if (type === 1){
          this.$data.flow.interfaceUseDatas.splice(rowIndex, 1)
        }else if (type === 2){
          this.$data.interfaceParameterDatas.splice(rowIndex, 1)
        }
      },
           
      changeSavaVariable() {
        this.$data.flow.variableInput = !this.$data.flow.variableInput
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection)
      },
      addTestBeforeSqls(testId){
        this.$data.initialTests[testId].beforeSqls.push('')
      },
      closeTestBeforeSqls(testId,index){
        if (index === 0) {
          return;
        }
        this.$data.initialTests[testId].beforeSqls.splice(index, 1)
      },
      changeProcedure(rowIndex, index, indexProcedures, inputEvent) {
           var assertDatas = this.$data.initialTests.assertData
           var procedures = assertDatas[rowIndex][index].procedures
           console.log(inputEvent)
           if (inputEvent === '' || inputEvent === undefined) {
              procedures.splice(indexProcedures + 1, indexProcedures + 1);
              queryResults = this.$data.result
              this.$data.initialTests.assertData = assertDatas
              this.getTestData(inputEvent)
              return;
           }
           var procedure = procedures[procedures.length - 1].procedure
           if (procedure === '' || procedure === undefined) {
             return;
           }
           if (this.getTestData(inputEvent)) {
              procedures.push({
                procedure: ''
              })
              console.log(queryResults)
              //  this.restaurants = this.restaurants.inputEvent
              this.$data.initialTests.assertData = assertDatas
           }
        },
       querySearch(queryString, cb) {
         console.log(queryString)
        var restaurants = this.$data.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      plusProcedure(testsId) {
          this.$data.initialTests[testsId].assertData.push( [
                  {
                    procedures: [
                      {
                        procedure: ''
                      }
                    ],
                    asserts: [{
                      assert: ''
                    }],
                    results: [{
                      result: '成功',
                      type: 'warning'
                    }]
                  }
                ])
            // queryResults = restaurantsObj
            // this.getTestData(null)
      },
      // 插入删减参数
      operateParameter (flowId){

      },
      closeProcedure(testsId,rowIndex) {
        if (rowIndex === 0) {
          return;
        }
        this.$data.initialTests[testsId].assertData.splice(rowIndex, 1)
      },
      addAssertSqls(){
        this.$data.initialTests[0].assertSqls.push({
                sql: '',
                actualCols: [],
                sqlsTableDatas : [{
                      fieldName: '',
                      fieldValue: [''],
                      results: [{
                        result: '成功',
                        type: 'warning'
                      }]
                  }]
              })
      },
      closeAssertSqls(index){
        if (index === 0) {
            return;
          }
          this.$data.initialTests[0].assertSqls.splice(index, 1)
      },
      runSql(testsIndex,index){
        var assertSql = this.$data.initialTests[testsIndex].assertSqls[index]
        console.log(assertSql)
        this.$axios.get(
                    '/alter/common/runSql',
                    {
                      params: {
                        sql: assertSql.sql,
                        interceptor: GLOBAL.interceptor
                      }
                    }
        ).then(data => {
            var dataObj = data.data
            assertSql.sqlsTableDatas = dataObj.obj.sqlsTableDatas
            assertSql.actualCols = dataObj.obj.actualCols
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
      }

  }
}
</script>
<style scoped>
#box{
    width: 100%;
  height: 100%;
  background: white;
  
}
.before_sqls_cz{
  display: flex;
  align-items: center;
  justify-content: space-around;
  width:100px;
}
.after_sqls_cz{
  display: flex;
  align-items: center;
  justify-content: space-around;
  width:100px;
  position:absolute;
  z-index:999;
  right: 0px;
  align-items: center;
  align-content: center;
  height: 100%;
  font-size: 21px;
}
.box {
  width: 200px;
  height: 100%;
  /* position: absolute; */
  /* overflow-y: auto; */
  border-right: 1px solid red;
}
.list {
  padding: 0;
  font-size: 14px;
}
.clickstyle{
    	background-color: #C0C0C0;
        color:red;
        font-weight: bold;
        border-radius:8px;
    }
.list-item {
  text-align: center;
  width: 100%;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  list-style: none;
  padding: 0 1rem;
  box-sizing: border-box;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #e7e7e7;
  cursor:pointer;
}
.asserts{
  padding: 20px 20px;
  border: 2px solid #C0C0C0;
}

.assert{
  margin-bottom: 50px;
  width:1100px;
  margin: 10px auto 40px auto;
}
.loading span {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #409eff;
  border-left: transparent;
  animation: zhuan 0.5s linear infinite;
  border-radius: 50%;
}

</style>