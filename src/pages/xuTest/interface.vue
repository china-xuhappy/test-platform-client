<template>
  <div class="interface_name">
     <!-- <el-container style="height: 630px">
        <el-aside width="300px">
            <el-tree :data="productTypes" :props="defaultProps" node-key="id"
                     @node-contextmenu="rightClick" @node-click="handlClick">
            </el-tree>
            
        </el-aside>
        <el-main>
        </el-main>
    </el-container> -->

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

          <el-form-item label="接口名称">
            <el-input v-model="search.interfaceName"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="searchInterfase">搜索接口</el-button>
            <!-- <el-button type="primary"> 添加接口 </el-button> -->
            <el-button type="primary"  @click="addCatalogue">添加目录</el-button>
          </el-form-item>
      </el-form>
       <!-- <el-row style="height:40px;line-height:40px;"> -->
          <!-- <el-button type="success" size="mini" round @click="addCatalogue">添加项目</el-button> -->
          <!-- <el-button type="success" size="mini" round @click="runAllCase">全跑用例</el-button> -->
        <!-- </el-row> -->
    <div class="left">
       <div v-show="menuVisible">
                <ul id="menu" class="menu" @mouseleave="foo">
                    <li class="menu_item" @click="editInterface">编辑</li>
                    <li class="menu_item" @click="deleteInterface">删除</li>
                </ul>
            </div>

        <el-collapse accordion v-for="(value, key, index) in catalogues">
          <el-collapse-item >
            <template slot="title" >
              <div style="padding:20px;font-size:16px;font-weight:bold;">
                <i class="el-icon-folder-opened" style="font-weight:bold;"></i> {{value.catalogueName}}
              </div>
            </template>
            <div style="  width: 240px;
                display: flex;
                flex-wrap: wrap;
                margin: auto;">
            <div class="interface"  v-for="(paramsValue, paramsKey, index) in value.params" @click="pasteParams(paramsValue, value.id ,paramsKey)" 
            :class="{clickstyle:changeActive == paramsValue.id}" @contextmenu.prevent="interfaceRightClick(paramsValue, value.id ,paramsKey, $event)" @node-click="handlClick">
              {{paramsValue.method}}: {{paramsValue.describe}} ({{paramsValue.id}})
            </div>

           

            </div>
          </el-collapse-item>
          <div class="setting">
            <i class="el-icon-caret-right" @click="runTests(value.id)"></i>
            <el-dropdown >
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-plus" @click.native="savaInterface('addRequest',value.id)">Add Request</el-dropdown-item>
              <!-- <el-dropdown-item icon="el-icon-plus" @click.native="runTests(value.id)">Run Tests</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
          </div>
        </el-collapse>
      </div>
    <div class="right">
        
      <div class="right-top">
        <!-- 每次打开都会显示，上面的选择
           <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="pasteParams">
          <el-tab-pane
            v-for="item in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
            :dataContent="item.content"
          >
          </el-tab-pane>
        </el-tabs> -->

        <el-input class="input-with-select" id="input_xu">
          <el-select v-model="form.region" slot="prepend" placeholder="请选择" style="width:110px;">
            <el-option label="POST" value="POST"></el-option>
            <el-option label="GET" value="GET"></el-option>
          </el-select>
          <el-select v-model="form.type" slot="prepend" placeholder="请选择" style="margin-left:6px;width:110px;">
            <el-option label="HTTP://" value="HTTP://"></el-option>
            <el-option label="HTTPS://" value="HTTPS://"></el-option>
          </el-select>
           <template slot="prepend"><el-input v-model="form.host" placeholder="ip:端口" style="margin-left:20px;width:250px;"></el-input></template>
          <template slot="prepend"><el-input v-model="form.route" placeholder="请输入路由" style="margin-left:3px;width:760px;"></el-input></template>

          <el-button slot="append" icon="el-icon-search"  @click="requestInterface">请求</el-button>
          <el-button slot="append" icon="el-icon-search" @click="savaInterface">保存</el-button>
        </el-input>

        <el-tabs type="border-card" v-model="tabsActiveName">

        <el-tab-pane label="Body(请求报文)" name="Body(请求报文)">
          <div >            

            <el-checkbox-group v-model="form.isFormData" @change="changeisFormData">
                <el-checkbox label="Form Date" name="type"></el-checkbox>
                </el-checkbox-group>
         </div>
          <el-input
              type="textarea"
              :autosize="{ minRows: 5}"
              placeholder="请输入内容"
              v-model="form.body"
              ></el-input>
        </el-tab-pane>
          
        <el-tab-pane label="Headers(请求头)" name="Headers(请求头)">
            <div>
              <el-table
                ref="multipleTable"
                :data="headersTableDatas"
                tooltip-effect="dark"
                style="width: 100%"
               >
                <el-table-column
                  label="Header Key"
                  width="400">
                  <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
                  <template slot-scope="scope">
                    <el-row class="demo-autocomplete">
                     <el-col :span="102" >
                        <div  >
                          <el-input
                            class="inline-input"
                            v-model="scope.row.headersKey"
                            placeholder="请输入Header Key"
                          ></el-input>
                        </div>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="Header Value"
                  width="500">
                  <template slot-scope="scope" >
                      <div >
                          <el-input
                            class="inline-input"
                            v-model="scope.row.headersValue"
                            placeholder="请输入Header Value值"
                            style="width:400px;"
                          ></el-input>
                          <i class="el-icon-plus" @click="plusHeaderProcedure()"></i>
                          <i class="el-icon-close" @click="closeHeaderProcedure(scope.$index)"></i>
                        </div>
                  </template>

                </el-table-column>
              </el-table>
            </div>
        </el-tab-pane>

        <el-tab-pane label="Test(测试断言)" name="Test(测试断言)" style="text-align:center;">

          <!-- <el-button type="primary" @click="addInitialTest" style="margin-bottom:10px;">添加断言</el-button> -->

          <div v-for="(testsValue, testsIndex) in tests" class="asserts">
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
                style="width: 100%"
                class="assert"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  label="断言步骤"
                  width="400">
                  <template slot-scope="scope">
                    <el-row class="demo-autocomplete">
                     <el-col :span="102" >
                        <div  v-for="(value, key, index) in scope.row">
                          <el-autocomplete
                            v-for="(valueProcedures, keyProcedures, indexProcedures) in value.procedures"
                            class="inline-input"
                            v-model="valueProcedures.procedure"
                            :fetch-suggestions="querySearch"
                            placeholder="选择断言内容"
                            @select="handleSelect"
                            @input="changeProcedure(scope.$index,key,keyProcedures,$event)"
                          ></el-autocomplete>
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
                <el-button type="success" size="mini" round @click="runSql(testsIndex,index)" >执行断言SQL</el-button>

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


        </el-tab-pane>

        <el-tab-pane label="Datas(动态参数)" name="Datas(动态参数)">
            <div>
              
              <el-table
                ref="multipleTable"
                :data="dataTableDatas"
                tooltip-effect="dark"
                style="width: 100%"
               >
                <el-table-column
                  label="变量名"
                  width="400">
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
                  width="600">
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
                        <div style="width:100%;">
                            <el-input
                             v-for="(valueVariable, keyVariable, indexVariable) in scope.row.variableValue"
                              class="inline-input"
                              v-model="scope.row.variableValue[keyVariable]"
                              placeholder="请输入变量值"
                            ></el-input>
                            <i class="el-icon-plus" @click="plusVariables"></i>
                            <i class="el-icon-close" @click="closeVariables"></i>
                          </div>
                      </el-col>
                  </template>

                </el-table-column>
                <el-table-column
                  prop="name"
                  label="操作"
                  width="300">
                  <template slot-scope="scope" >
                      
                      <el-col :span="502" style="display:flex;">
                        <div style="width:100%;">
                            <i class="el-icon-plus" @click="plusDataProcedure()"></i>
                            <i class="el-icon-close" @click="closeDataProcedure(scope.$index)"></i>
                          </div>
                      </el-col>
                  </template>

                </el-table-column>
              </el-table>
            </div>
        </el-tab-pane>

         <el-tab-pane label="SQL(接口SQL)" name="SQL(接口SQL)">
           <div v-for="(sql,index) in form.sqls" class="assert" style="display: flex;">
                <el-input
                type="textarea"
                :autosize="{ minRows: 2}"
                placeholder="请输入接口用到的SQL"
                v-model="form.sqls[index]"
                style="width:90%;"
                ></el-input>

                <div class="before_sqls_cz">
                  <i class="el-icon-plus" @click="addInterfaceSqls(index)"></i>
                  <i class="el-icon-close" @click="closeInterfaceSqls(index)"></i>
                </div>
              </div>
        </el-tab-pane>

        <el-tab-pane label="StressTest" name="StressTest">
            <div>
              <div>
                <div style="margin: 20px;">
                  <el-form :label-position="right" label-width="80px" :model="pressure" style="display:flex;">
                    <el-form-item label="总用户">
                      <el-input v-model="pressure.locust_count"></el-input>
                    </el-form-item>
                    <el-form-item label="每秒用户" >
                      <el-input v-model="pressure.hatch_rate"></el-input>
                    </el-form-item>
                    <el-form-item label="host">
                      <el-input v-model="pressure.host"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onPressure">立即请求</el-button>
                    </el-form-item>
                  </el-form>
                  </div>
              </div>


              <el-table
                :data="stats"
                style="width: 100%">
                <el-table-column
                  v-for="(value, key, index) in props" 
                  :prop="value.prop"
                  :label="value.label"
                  >
                </el-table-column>
              </el-table>
            </div>
        </el-tab-pane>

        <el-tab-pane label="Result(返回结果)" name="Result(返回结果)" style="font-weight:bold;">
          <el-tabs tab-position="left" >
           <el-tab-pane 
              v-for="(value, key, index) in results" 
              :label="value.id" class="result">
            <div style="margin-top:0px;">
                <el-alert title="返回结果: " type="success" effect="dark" :closable="false"></el-alert>

                <json-viewer
                  :value="value.result"
                  :expand-depth=10
                  copyable
                sort></json-viewer>
            </div>

            <div>
              <el-alert title="请求参数: " type="success" effect="dark" :closable="false"></el-alert>

              <json-viewer
                :value="value.params"
                :expand-depth=0
                copyable
                sort></json-viewer>
            </div>

            <!--<el-table
                ref="multipleTable"
                :data="value.headers"
                border
                tooltip-effect="dark"
                style="width: 100%"
               >
                <el-table-column
                  prop="headersKey"
                  label="Header Key"
                  width="400">
                </el-table-column>
                <el-table-column
                  prop="headersValue"
                  label="Header Value"
                  width="500">
                </el-table-column>
            </el-table> header-->

           <!-- {{value.useDatas}} -->
            
          <div>
            <el-alert title="断言结果: " type="success" effect="dark" :closable="false"></el-alert>

             <el-table
                ref="multipleTable"
                :data="value.useCase"
                tooltip-effect="dark"
                style="width: 100%">
                <el-table-column
                 prop="procedures"
                  label="断言步骤"
                  width="300">
                  <template slot-scope="scope">
                    <el-row class="demo-autocomplete">
                     <el-col :span="102" >
                        <div  v-for="(value, key, index) in scope.row">
                          <div  v-for="(valueProcedures, keyProcedures, indexProcedures) in value.procedures">
                            {{valueProcedures.procedure}}
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="procedures"
                  label="断言数据"
                  width="400">
                  <template slot-scope="scope">
                     <el-col :span="102">
                         <div  v-for="(value, key, index) in scope.row">
                          <div  v-for="(valueAssert, keyAssert, indexAssert) in value.asserts">
                            {{valueAssert.assert}}
                          </div>
                        </div>
                    </el-col>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="断言结果"
                  width="200">
                  <template slot-scope="scope">
                     <el-col :span="102">
                       <div  v-for="(value, key, index) in scope.row" >
                          <el-tag  v-for="(valueResult, keyResult, indexResult) in value.results" :type="valueResult.type" >{{valueResult.result}}</el-tag>
                      </div>
                    </el-col>
                  </template>
                </el-table-column>
            </el-table> 
          </div>


          <div>
            <el-alert title="请求前SQL: " type="success" effect="dark" :closable="false"></el-alert>
            <div v-for="(sql,index) in value.beforeSqls" style="width:100%;">
                  <el-card shadow="always">
                    {{value.beforeSqls[index]}}
                  </el-card>
            </div>
          </div>

          <div>
            <div v-for="(value, index) in value.assertSqls" >
              <el-alert title="请求后Sql断言: " type="success" effect="dark" :closable="false"></el-alert>
                <el-card shadow="always">
                  {{value.sql}}
                </el-card>
                
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
                    v-for="col in value.sqlCols"
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
              </div><!--assertSqls--> 
            </div>

            </el-tab-pane>
          </el-tabs>

            
        </el-tab-pane>
        </el-tabs>
      </div>
       
  </div>
      <el-dialog title="提交接口内容" :visible.sync="dialogFormInterface" width="500px" append-to-body>
        <el-form :model="form">
          <el-form-item label="接口名" :label-width="formLabelWidth">
            <el-input v-model="form.interfaceName" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="转换类型">
            <el-select v-model="form.curlType" placeholder="请选择转换类型">
              <el-option label="charles" value="charles"></el-option>
              <el-option label="browser" value="browser"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="Charles" :label-width="formLabelWidth">
                <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入Charles Copy CURL Request"
                v-model="form.curlToJson">
              </el-input>          
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" v-if="isEdit == true" @click="savaInterface('保存新接口')">保存新接口</el-button>
          <el-button type="primary" v-if="isEdit == false" @click="savaInterface('编辑接口名')">保存接口名</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加项目目录" :visible.sync="dialogFormProject" width="500px" append-to-body>
        <el-form :model="form">
          <el-form-item label="目录名" :label-width="formLabelWidth">
            <el-input v-model="catalogueName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addCatalogue('确定')">确 定</el-button>
        </div>
      </el-dialog>
  </div>
  
</template>
<script>
  var interfaceId = 0
  var projectId = 0
  var catalogueId = 0
  var queryResults = []
  var restaurantsObj = []
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
var dataInitTableData = {
              variableName: '',
              variableValue: [''],
              typeOptions: 'String'
          }
var headersInitTableData = {
              headersKey: '',
              headersValue: ''
          }
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
var interfaceType = 0
var interfaceName = ''
import GLOBAL from '../../utils/global_variable.js';
export default {
    data () {
      return {
        isEdit: false,
        menuVisible: false,
        productTypes: [],
        defaultProps: {
            children: 'children',
            label: 'name'
        },
        changeActive: 0,
        project_name:'',
        interfaceProjectList: [],
        results:[],
        editableTabsValue: '1',
        search:{
          interfaceName: ''
        },
        editableTabs: [],
        tabIndex: 2,
        variableInput: false,
        typeOptions:[
           {
            value: 'String',
            label: 'String数据'
          },
          {
            value: 'int',
            label: 'Int数据'
          },
          {
            value: 'dict',
            label: 'json数据'
          },
          {
            value: 'interface',
            label: '请求接口'
          }
        ],
        catalogueName: '',
        tabsActiveName: 'Body(请求报文)',
        dialogFormInterface: false,
        dialogFormProject: false,
        form: {
          route: '',
          type: 'HTTP://',
          region: 'GET',
          body: '',
          interfaceName: '',
          host: '',
          isSavaVariable: false,
          isFormData: false,
          curlToJson: '',
          curlType: 'charles',
          sqls: [""]
        },
        pressure: {
          locust_count: 0,
          hatch_rate: 0,
          host: ''
        },
        catalogues: [],
        result: {},
        dataTableDatas: [dataInitTableData],
        headersTableDatas: [headersInitTableData],

        tests: [
          {
            assertData: [initTableData],
            beforeSqls: [''],
            assertSqls: sqlInitTableData
          }
        ],
        multipleSelection: [],
        restaurants: [],
        state1: '',
        props: [],
        stats: []
      }
    },
    mounted() {
      // const timer = setInterval(() =>{                    
        // this.$axios.get(
        //     '/alter/common/getRequests/'
        // ).then(data => {
        //     var dataObj = data.data.obj
        //     this.$data.props = dataObj.props
        //     this.$data.stats = dataObj.datas.stats
        // })  
      // }, 10000);

        // this.$axios.get(
        //             '/alter/common/getRunLog',
        //             {
        //               params: {
        //                 caseId: 1577285911406
        //               }
        //             }
        //       ).then(data => {
        //           var dataObj = data.data
        //           this.$data.results = dataObj.obj
        //       })
        console.log(GLOBAL.projectId)
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
    created () {
      // {
      //   params: {
      //     userId: 1
      //   }
      // }
      this.getProject(GLOBAL.projectId)
    },
    methods: {
      handlClick() {
            },
      //右键点击
      interfaceRightClick(paramsValue, catalogue, index, MouseEvent, object, Node, element) { // 鼠标右击触发事件
          interfaceName = paramsValue.describe
          this.pasteParams(paramsValue, catalogue, index)
          this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
          this.menuVisible = true  // 显示模态窗口，跳出自定义菜单栏
          var menu = document.querySelector('#menu')
          document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
          menu.style.display = "block";
          menu.style.left = MouseEvent.clientX - 200 + 'px'
          menu.style.top = MouseEvent.clientY - 125 + 'px'
      },
      foo() { // 取消鼠标监听事件 菜单栏
          this.menuVisible = false
          document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
      },
      plusVariables(){
        var length = this.$data.dataTableDatas.length
        for (var i=0; i< length;i++){
            
          this.$data.dataTableDatas[i].variableValue.push('')
        }
        
        // dataInitTableData.variableValue.push('')
      },
      closeVariables(){
        var length = this.$data.dataTableDatas[0].variableValue.length
        if (length === 1){
          return;
        }
        var length = this.$data.dataTableDatas.length
        for (var i=0; i< length;i++){
          this.$data.dataTableDatas[i].variableValue.pop()
        }
        // dataInitTableData.variableValue.pop()
      },
      requestInterface() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        var region = this.$data.form.region
        var route = this.$data.form.route
        var type = this.$data.form.type
        var body = this.$data.form.body
        var host = this.$data.form.host
        var paramsId = this.$data.form.paramsId
        var isFormData = this.$data.form.isFormData
        
        if (region === '' || route === '' || type === '' || host == '') {
              this.$message({
                message: '请填写正确的信息',
                type: 'warning'
            });
            loading.close();
            return null;
        }

        this.$axios({
            url: '/alter/interface/requestInterface',
            method: 'POST',
            data: {
              general: {
                url: type + host + route,
                method: region,
                type: type,
                host: host,
                route: route,
                isFormData: isFormData
              },
              before: {
                datas: this.$data.dataTableDatas, 
                headers: this.$data.headersTableDatas,
                params: JSON.parse(body),
                paramsId: paramsId,
                projectId: GLOBAL.projectId
              },
              after: {
                assertSqls: this.$data.tests.assertSqls,
                tests: this.$data.tests.assertData
              },
              initialTests: [this.$data.tests],
              rests: {
                variableName: this.$data.form.variableName,
                isVariable: this.$data.variableInput,
              },
              userId: GLOBAL.userInfo.userId,
              environment: GLOBAL.interceptor === '' ? 0 : GLOBAL.interceptor
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(data => {
            loading.close();
            var dataObj = data.data.obj
            if (data.data.status === 200) {
              console.log(dataObj)
              this.$data.result = dataObj.interfaceData
              queryResults = dataObj.interfaceData
              restaurantsObj = dataObj.interfaceData
              this.getTestData(null)
              // this.$data.tests.assertData = dataObj.tests
              // this.$data.tests.assertSqls = dataObj.sqlsTableDatas
              this.$axios.get(
                    '/alter/project/getRunLog',
                    {
                      params: {
                        caseId: dataObj.caseId
                      }
                    }
              ).then(data => {
                  var dataObj = data.data
                  this.$data.results = dataObj.obj
                  this.tabsActiveName = "Result(返回结果)"
              })
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
        loading.close();
      },
      
      submitInterface() {
        console.log(catalogueId)
        var region = this.$data.form.region
        var route = this.$data.form.route
        var type = this.$data.form.type
        var body = this.$data.form.body
        var host = this.$data.form.host
        var curlToJson = this.$data.form.curlToJson
        var curlType = this.$data.form.curlType
        var isFormData = this.$data.form.isFormData
        if (isFormData){
          isFormData = "true"
        }else{
          isFormData = "false"
        }
        var interfaceName = this.$data.form.interfaceName
        var beforeSqls = this.$data.tests.beforeSqls
        body = body !== '' ? JSON.parse(body) : {}
        if (typeof body == "string"){
          body = {}
        }

        this.$axios({
            url: '/alter/interface/interfaceOperation',
            method: 'POST',
            data: {
              general: {
                url: type + host +route,
                method: region,
                type: type,
                host: host,
                route: route,
                isFormData: isFormData
              },
              params: body,
              catalogueId: catalogueId,
              projectId: GLOBAL.projectId,
              curlToJson: curlToJson,
              curlType: curlType,
              interfaceId: interfaceId,
              typeStatus: interfaceType,
              interfaceName: interfaceName,
              tests: [this.$data.tests.assertData],
              datas: [this.$data.dataTableDatas],
              headers: [this.$data.headersTableDatas],
              rests: {
                variableName: this.$data.form.variableName,
                isVariable: this.$data.variableInput,
                sqls: this.$data.form.sqls
              },
              before: {
                beforeSqls: beforeSqls == undefined ? [] : beforeSqls
              },
              after: {
                assertSqls: this.$data.tests.assertSqls
              },
              initialTests: [this.$data.tests]
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(data => {
            var dataObj = data.data
            if (dataObj.status === 200) {
                this.$message({
                    message: dataObj.message,
                    type: 'success'
                });
                this.$data.dialogFormInterface = false
                this.$data.form.curlToJson = ''
                this.getProject(GLOBAL.projectId)
            } else {
                this.$message({
                  message: dataObj.message,
                  type: 'warning'
                });
            }
        })
      },
      addInitialTest() {
        this.$data.tests.push({
            assertData: [[
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
          ]],
            beforeSqls: [' DELETE FROM black_name_list WHERE mobile=17601245833'],
            assertSqls: [{
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
        })
      },
        onPressure() {
          this.$axios({
              url: '/alter/common/swarm',
              method: 'POST',
              data: {
                locust_count: this.$data.pressure.locust_count,
                hatch_rate: this.$data.pressure.hatch_rate,
                host: this.$data.pressure.host
              },
              headers: {
                  'Content-Type': 'application/json'
              }
          }).then(data => {
              var dataObj = data.data.obj
              
          })
        },
        changeProcedure(rowIndex, index, indexProcedures, inputEvent) {
           var assertDatas = this.$data.tests.assertData
           var procedures = assertDatas[rowIndex][index].procedures
           console.log(inputEvent)
           if (inputEvent === '' || inputEvent === undefined) {
              procedures.splice(indexProcedures + 1, indexProcedures + 1);
              queryResults = this.$data.result
              this.$data.tests.assertData = assertDatas
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
              this.$data.tests.assertData = assertDatas
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
      handleSelect(item) {
        console.log(item);
      },
      handleSelectionChange(val) {
        // 存储所有被选中的
        this.multipleSelection = val
      },
      getTestData(key) {
        var dataObj = queryResults
        if (key != null && key !== '') {
              dataObj = queryResults[key]
              console.log(dataObj instanceof Object)
              if (!(dataObj instanceof Object)) {
                return false;
              }
              if (JSON.stringify(dataObj) === '{}') {
                return false;
              }
        } 
        var result = []
        Object.keys(dataObj).forEach(function(key) {
               result.push({
                 'value': key
               })
            console.log(key, dataObj[key]);
        });
        console.log(result)
        this.$data.restaurants = result
        queryResults = dataObj
        return true;
      },
      
      savaInterface(scene, catalogue) {
        console.log(catalogueId)
        if (scene === 'addRequest') {
          this.$data.dialogFormInterface = true
          this.$data.isEdit = true
          interfaceId = 0
          catalogueId = catalogue
          interfaceType = 1
          return;
        }
        if (scene === '编辑接口名'){
          interfaceType = 1
          this.submitInterface()
          return;
        }
        if (scene === '保存新接口') {
          interfaceType = 0
          this.$data.form.body = ''
          this.submitInterface()
        } else {
          // this.$data.dialogFormInterface = true
          // interfaceId = 0
          interfaceType = 1
          this.submitInterface()
          return;
        }
      },

      addCatalogue(scene) {
          if (scene === '确定') {
              this.$axios({
                url: '/alter/project/catalogueOperation',
                method: 'POST',
                data: {
                  projectId: GLOBAL.projectId,
                  catalogueName: this.$data.catalogueName
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(data => {
                var dataObj = data.data
                if (dataObj.status === 200) {
                    this.$message({
                        message: dataObj.message,
                        type: 'success'
                    });
                    this.$data.dialogFormProject = false
                    this.getProject(GLOBAL.projectId)
                } else {
                    this.$message({
                      message: dataObj.message,
                      type: 'warning'
                    });
                }
            })
          } else {
            this.$data.dialogFormProject = true
          }
      },
      pasteParams(paramsValue, catalogue, index) {
        this.$data.changeActive = paramsValue.id
        if (paramsValue.id == undefined) {
          paramsValue = paramsValue.$attrs.dataContent
        }
        var headers = paramsValue.headers
        var beforeSqls =  paramsValue.beforeSqls
        var sqls = paramsValue.sqls
        var assertSqls = paramsValue.assertSqls
        var useDatas = paramsValue.useDatas
        var useCase = paramsValue.useCase
        var method = paramsValue.method
        var isFormData = paramsValue.isFormData
        var rests = paramsValue.rests
        var params = paramsValue.params
        var interID = paramsValue.interfaceId
        var describe = paramsValue.describe
        var initialTests = paramsValue.initialTests

        var interfaceObj = paramsValue.interface
        var route = interfaceObj.route
        var host = interfaceObj.host
        var type = interfaceObj.type

        this.$data.form.interfaceName = paramsValue.describe


        if (useCase === '' || useCase === null || useCase === undefined) {
          this.$data.tests.assertData = [initTableData]
        } else {
          this.$data.tests.assertData = JSON.parse(useCase)
        }

        if (useDatas === '' || useDatas === null || useDatas === undefined) {
          var length = dataInitTableData.variableValue.length
          var variableValues = []
          for (var i=0; i< length;i++){
              variableValues.push('')
          }
          
          this.$data.dataTableDatas = [{
              variableName: '',
              variableValue: variableValues,
              typeOptions: 'String'
          }]
        } else {
          this.$data.dataTableDatas = JSON.parse(useDatas)
        }

        if (headers === '' || headers === null || headers === undefined) {
          this.$data.headersTableDatas = [headersInitTableData]
        } else {
          this.$data.headersTableDatas = JSON.parse(headers)
        }
        if (sqls === '' || sqls === null || sqls === undefined) {
          this.$data.form.sqls = [""]
        }else{
          this.$data.form.sqls = JSON.parse(paramsValue.sqls)
        }
        

        if (beforeSqls === '' || beforeSqls === null || beforeSqls === undefined) {
          this.$data.form.beforeSqls = ['']
        } else {
          this.$data.form.beforeSqls = JSON.parse(beforeSqls)
        }

        if (assertSqls === '' || assertSqls === null || assertSqls === undefined) {
          console.log(sqlInitTableData)
          this.$data.form.assertSqls = sqlInitTableData
        } else {
          this.$data.form.assertSqls = JSON.parse(assertSqls)
        }


        if (initialTests === '' || initialTests === null || initialTests === undefined) {
          this.$data.tests = [
          {
            assertData: [initTableData],
            beforeSqls: [''],
            assertSqls: sqlInitTableData
          }
        ]
        } else {
          this.$data.tests = JSON.parse(initialTests)
        }


        

        this.$data.form.host = host
        this.$data.form.route = route
        this.$data.form.region = method
        this.$data.form.body = JSON.stringify(JSON.parse(params),null,1)
        this.$data.form.type = type
        if (isFormData == "true") {
          this.$data.form.isFormData = true
        }else{
          this.$data.form.isFormData = false  
        }
        this.$data.pressure.host = type+host
        this.$data.form.paramsId = paramsValue.id
        
        interfaceId = interID
        catalogueId = catalogue
        this.$data.result = {}
        this.addTab({
          describe: describe,
          paramsId: paramsValue.id,
          paramsValue: paramsValue
        })
      },
      addAssertSqls(){
        this.$data.tests[0].assertSqls.push({
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
          this.$data.tests[0].assertSqls.splice(index, 1)
      },

      // pasteProjectID(proID) {
      //   console.log(proID)
      //   projectId = proID
      // },
      plusProcedure(testsId) {
          this.$data.tests[testsId].assertData.push(initTableData)
            queryResults = restaurantsObj
            this.getTestData(null)
      },
      closeProcedure(testsId,rowIndex) {
        if (rowIndex === 0) {
          return;
        }
        console.log(rowIndex)
        this.$data.tests[testsId].assertData.splice(rowIndex, 1)
      },
      addInterfaceSqls(){
        this.$data.form.sqls.push("")
      },

      closeInterfaceSqls(index){
          if (index === 0) {
            return;
          }
          this.$data.form.sqls.splice(index, 1)
      },

      plusDataProcedure() {
        console.log(this.$data.dataTableDatas)
        var length = dataInitTableData.variableValue.length
        var variableValues = []
        for (var i=0; i< length;i++){
            variableValues.push('')
        }
          
          this.$data.dataTableDatas.push({
              variableName: '',
              variableValue: variableValues,
              typeOptions: 'String'
          })
          console.log(this.$data.dataTableDatas)
      },
      closeDataProcedure(rowIndex) {
        if (rowIndex === 0) {
          return;
        }
        this.$data.dataTableDatas.splice(rowIndex, 1)
      },     
      
      plusHeaderProcedure() {
          this.$data.headersTableDatas.push({
              headersKey: '',
              headersValue: ''
          })
      },
      closeHeaderProcedure(rowIndex) {
        if (rowIndex === 0) {
          return;
        }
        this.$data.headersTableDatas.splice(rowIndex, 1)
      },  
      addTestBeforeSqls(testId){
        this.$data.tests[testId].beforeSqls.push('')
      },
      closeTestBeforeSqls(testId,index){
        if (index === 0) {
          return;
        }
        this.$data.tests[testId].beforeSqls.splice(index, 1)
      },
      // runTests(projectId) {
      //   this.$axios.get(
      //               '/alter/project/runProject',
      //               {
      //                 params: {
      //                   projectId: projectId
      //                 }
      //               }
      //   ).then(data => {
      //       var dataObj = data.data
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
      getProject(projectId) {
        this.$axios.get(
                    '/alter/project/catalogueOperation',
                    {
                      params:{
                        projectId: projectId
                      }
                    }
        ).then(data => {
            var dataObj = data.data
            console.log(dataObj)
            this.$data.catalogues = dataObj
        })
      },

      addTab(params) {
        this.editableTabsValue = 0
        let tabs = this.editableTabs;
        tabs.forEach((tab, index) => {
          if (tab.name === params.paramsId) {
            this.editableTabsValue = params.paramsId
            return;
          }
        });
        if (this.editableTabsValue != 0){
          return;
        }
        this.editableTabs.push({
          title: params.describe,
          name: params.paramsId,
          content: params.paramsValue
        });
        this.editableTabsValue = params.paramsId;
      },

      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      },
       changeProject(projectId,vent){
          GLOBAL.projectId = projectId
           var project = this.$data.interfaceProjectList.find((item)=>{
              console.log(item.value)
            return item.id === projectId;
          });
         GLOBAL.projectName = project.projectName
         this.getProject(projectId)
      },
      // 删除接口
      deleteInterface(){
        interfaceType = 2
        this.$data.form.curlToJson = ''
        this.submitInterface()
      },
      // 编辑接口名
      editInterface(){
          this.$data.isEdit = false
          this.$data.form.interfaceName = interfaceName
          this.$data.dialogFormInterface = true
          this.$data.form.curlToJson = ''
      },

      runSql(testsIndex,index){
        var assertSql = this.$data.tests[testsIndex].assertSqls[index]
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
.asserts{
  padding: 20px 20px;
  border: 2px solid #C0C0C0;
}

.assert{
  margin-bottom: 50px;
}
.clickstyle{
    	background-color: #C0C0C0;
        color:red;
        font-weight: bold;
        border-radius:8px;
    }
.el-input-group__prepend{
  width: 400px;
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
.el-collapse{
  position: relative;
}
.setting{
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-around;
  height: 49px;
  width: 30px;
  background: white;
}
.interface{
  padding: 10px 0px;
  text-align: center;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  cursor:pointer;
  width: 240px;
  display: flex;
}
  .right-tips{
    width: 500px;
    background: white;
  }
  .right-top{
    width:100%;
  }
.jv-container{
  width:100%;
}
.result > div{
  margin-top: 50px;
}

.result-lable{
  font-weight: 100;  
}
  .left{
    width: 260px;
    position:absolute;
    left: -1px;
    text-align:center;
  }
  .right{
    display: flex;
    justify-content: center;
    align-items: center;
    /* background: white; */
    margin-left: 260px;
    width: 85%;
    flex-wrap: wrap;
  }
  
  .el-select .el-input {
    width: 110px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  
 #input_xu {
    display: none;
  }

  .inline-input{
    width: 140px;
  }
   .el-aside {
        border: 1px solid #ccc;
        border-right: none;
    }

    .el-main {
        border: 1px solid #ccc;
    }

    .menu_item {
        line-height: 20px;
        text-align: center;
        margin-top: 10px;
    }

    .menu {
        height: 100px;
        width: 80px;
        position: absolute;
        border-radius: 10px;
        border: 1px solid #999999;
        background-color: #f4f4f4;
    }

    li:hover {
        background-color: #1790ff;
        color: white;
    }
    li{font-size:15px}

    .menu { z-index: 999; height: auto; width: 120px; color: #606266; position: absolute; padding: 0px; box-sizing: border-box; /*border: 1px solid #999999;*/ text-align: center; background-color: #fff; border-radius: .25rem; box-shadow: 0 .5rem 1rem rgba(0,0,0,.15); } li:hover { background-color: rgba(232,237,250,.6); color: darkslategrey; } li{ position: relative; display: flex; font-size: 14px; align-items: center; height: 34px; line-height: 34px; outline: none; margin-top: 0px; padding-left: 20px; padding-right: 5px; }
  
</style>

