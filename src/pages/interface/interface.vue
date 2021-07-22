<template>
  <div class="interface_name">
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
            <el-button type="primary"  @click="addCatalogue(0)">添加目录</el-button>
          </el-form-item>
      </el-form>

    <div class="left">
       <div v-show="menuVisible">
                <ul id="menu" class="menu" @mouseleave="foo">
                    <li class="menu_item" @click="editInterface">编辑</li>
                    <li class="menu_item" @click="deleteInterface">删除</li>
                </ul>
            </div>

        <el-collapse accordion v-for="(value, key) in catalogues" :key="key" v-model="cataloguesId">
          <el-collapse-item :name = "value.id">
            <template slot="title" >
              <div style="padding:20px;font-size:16px;font-weight:bold;" class="catalogueStyle">
                <i class="el-icon-folder-opened" style="font-weight:bold;"></i> {{value.catalogueName}}
              </div>
            </template>

            <el-collapse accordion v-for="(value, key) in value.sonCatalogues" :key="key" v-model="sonCataloguesId" >
              <el-collapse-item :name = "value.id" >
                <template slot="title" >
                  <div style="padding:30px;font-size:14px;width:100%;display: flex; align-items: center;">
                    <i class="el-icon-folder-opened" style="font-weight:bold;"></i>
                    <div style="margin-left:20px;width:100%;display:flex;justify-content: space-between;align-items: center;">
                       <div>{{value.catalogueName}}</div>  <div>{{value.count}}</div>
                    </div>
                  </div>
                </template>
                <div class="interface-vessel">
                    <div class="interface"  v-for="(paramsValue, paramsKey) in value.params" @click="pasteParams(paramsValue.id, value.id)" 
                    :key="paramsKey"
                    :class="{clickstyle:changeActive == paramsValue.id}" @contextmenu.prevent="interfaceRightClick(paramsValue.id, paramsValue.describe, value.id ,paramsKey, $event)" @node-click="handlClick">
                      {{paramsValue.flag == 1?"是":"否"}} - {{paramsValue.method}}: {{paramsValue.describe}} ({{paramsValue.id}})
                    </div>
                </div>
              </el-collapse-item>
              <div class="setting">
                <el-dropdown >
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="savaInterface('addRequest',value.id)">添加接口</el-dropdown-item>
                  <el-dropdown-item @click.native="editCatalogues(value.id,value.catalogueName)">编辑目录</el-dropdown-item>
                  <el-dropdown-item @click.native="delectCatalogues(value.id)">删除目录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              </div>
            </el-collapse>

          </el-collapse-item>
          <div class="setting">
            <el-dropdown >
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addCatalogue(value.id)">添加目录</el-dropdown-item>
              <el-dropdown-item @click.native="delectCatalogues(value.id)">删除目录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          </div>
        </el-collapse>
      </div>
    <div class="right">
        
      <div class="right-top">
        <el-input class="input-with-select" id="input_xu">
          <el-select v-model="form.region" slot="prepend" placeholder="请选择" style="width:110px;">
            <el-option label="POST" value="POST"></el-option>
            <el-option label="GET" value="GET"></el-option>
            <el-option label="PUT" value="PUT"></el-option>
          </el-select>
          <el-select v-model="form.type" slot="prepend" placeholder="请选择" style="margin-left:6px;width:110px;">
            <el-option label="HTTP://" value="HTTP://"></el-option>
            <el-option label="HTTPS://" value="HTTPS://"></el-option>
          </el-select>
           <template slot="prepend"><el-input v-model="form.host" placeholder="ip:端口" style="margin-left:20px;width:250px;"></el-input></template>
          <template slot="prepend"><el-input v-model="form.route" placeholder="请输入路由" style="margin-left:3px;width:720px;"></el-input></template>

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
              placeholder="请输入请求参数"
              v-model="form.body"
              ></el-input>

              <el-input
              type="textarea"
              :autosize="{ minRows: 8}"
              placeholder="请输入参数备注"
              v-model="form.paramsDesc"
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

          <div v-for="(testsValue, testsIndex) in tests" :key="testsIndex" class="asserts">
             <el-alert
              title="请输入前置执行SQL"
              type="success"
              effect="dark"
              :closable="false"></el-alert>
              <div v-for="(sql,index) in testsValue.beforeSqls" class="assert" :key="index" style="display: flex;">
                <el-input
                type="textarea"
                :autosize="{ minRows: 1}"
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
              title="请输入前置执行Redis"
              type="success"
              effect="dark"
              :closable="false"></el-alert>
              <div v-for="(sql,index) in testsValue.beforeRedis" class="assert" :key="index" style="display: flex;">
                <el-input
                type="textarea"
                :autosize="{ minRows: 1}"
                placeholder="请输入前置执行Redis"
                v-model="testsValue.beforeRedis[index]"
                style="width:90%;"
                ></el-input>

                <div class="before_sqls_cz">
                  <i class="el-icon-plus" @click="addTestBeforeReids(testsIndex)"></i>
                  <i class="el-icon-close" @click="closeTestBeforeReids(testsIndex,index)"></i>
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
                  width="700">
                  <template slot-scope="scope">
                    <el-row class="demo-autocomplete">
                     <el-col :span="102" >
                        <div  v-for="(value, key, index) in scope.row">
                          <el-input
                            v-for="(valueProcedures, keyProcedures, indexProcedures) in value.procedures"
                            class="inline-input"
                            v-model="valueProcedures.procedure"
                            placeholder="选择断言内容"
                          ></el-input>
                        </div>
                      </el-col>
                      <el-col :span="102">
                        <div style="height: 40px;display: flex;align-items: center;justify-content: space-around;width: 60px;">
                          <i class="el-icon-plus" @click="plusProcess(testsIndex, scope.$index)"></i>
                          <i class="el-icon-close" @click="closeProcess(testsIndex, scope.$index)"></i>
                        </div>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="断言数据"
                  width="300">
                  <template slot-scope="scope">
                     <el-col :span="102">
                       <div  v-for="(value, key, index) in scope.row" :key="index">
                          <el-input
                            v-for="(valueAssert, keyAssert, indexAssert) in value.asserts"
                            :key="indexAssert"
                            class="inline-input"
                            v-model="valueAssert.assert"
                            placeholder="选择断言内容"
                            style="width:200px;"
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
                  width="250">
                  <template slot-scope="scope">
                    <el-row class="demo-autocomplete">
                     <el-col :span="102" >
                        <div  >
                          <el-input
                            class="inline-input"
                            v-model="scope.row.variableName"
                            placeholder="请输入变量名"
                            style="width:200px;"
                          ></el-input>
                        </div>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="变量值"
                  width="870">
                  <template slot-scope="scope" >
                      <el-col :span="502" style="display:flex;align-items:center;">
                          <el-select v-model="scope.row.typeOptions" placeholder="请选择" style="width:180px;">
                            <el-option
                              v-for="item in typeOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                          <div style="width:100%;display:flex;align-items:center;">
                              <el-input
                                v-if="scope.row.typeOptions != 'dict'"
                              v-for="(valueVariable, keyVariable, indexVariable) in scope.row.variableValue"
                                :key="indexVariable"
                                class="inline-input"
                                v-model="scope.row.variableValue[keyVariable]"
                                style="width:300px;"
                                placeholder="请输入变量值"
                              ></el-input>

                              <el-input
                                v-if="scope.row.typeOptions == 'dict'"
                                v-for="(valueVariable, keyVariable, indexVariable) in scope.row.variableValue"
                                :key="indexVariable"
                                type="textarea"
                                :autosize="{ minRows: 5}"
                                placeholder="请输入变量值"
                                style="width:550px;"
                                v-model="scope.row.variableValue[keyVariable]"
                                ></el-input>
                                
                              <el-input
                                v-if="scope.row.typeOptions == 'dict'"
                                class="inline-input"
                                v-model="scope.row.remark"
                                style="width:150px;"
                                placeholder="请输入备注"
                              ></el-input>
                              <el-input
                                v-if="scope.row.typeOptions != 'dict'"
                                class="inline-input"
                                v-model="scope.row.remark"
                                style="width:400px;"
                                placeholder="请输入备注"
                              ></el-input>
                            </div>
                        </el-col>
                      
                  </template>

                </el-table-column>

                 <el-table-column
                  label="是否必填"
                  width="100">
                  <template slot-scope="scope">
                      <el-switch
                        v-model="scope.row.required"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="name"
                  label="操作"
                  width="100">
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
<!-- 
         <el-tab-pane label="SQL(接口SQL)" name="SQL(接口SQL)">
           <div v-for="(sql,index) in form.sqls" class="assert" style="display: flex;" :key="index">
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
        </el-tab-pane> -->

        <el-tab-pane label="Result(返回结果)" name="Result(返回结果)" style="font-weight:bold;">
          <el-tabs tab-position="left" >
           <el-tab-pane 
              v-for="(value, key, index) in results" 
              :key="index"
              :label="value.id" class="result">
            <div style="margin-top:0px;">
                <el-alert type="success" effect="dark" :closable="false" style="font-size:20px;">
                  返回结果 < 状态: {{value.status_code}} > ----
                  
                  请求耗时: < {{value.waiting}} >
                </el-alert>
                <!-- <p>{{value.status_code}}</p> -->

                <p>{{value.result_text}}</p>
                <json-viewer
                  v-if="value.status_code == 200"
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
            <div v-for="(sql,index) in value.beforeSqls" :key="index" style="width:100%;">
                  <el-card shadow="always">
                    {{value.beforeSqls[index]}}
                  </el-card>
            </div>
          </div>

           <div>
            <el-alert title="请求前Redis: " type="success" effect="dark" :closable="false"></el-alert>
            <div v-for="(sql,index) in value.beforeRedis" :key="index" style="width:100%;">
                  <el-card shadow="always">
                    {{value.beforeRedis[index]}}
                  </el-card>
            </div>
          </div>

          <div>
            <div v-for="(value, index) in value.assertSqls" :key="index">
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

      <el-dialog title="项目目录信息" :visible.sync="dialogFormProject" width="500px" append-to-body>
        <el-form :model="form">
          <el-form-item label="目录名" :label-width="formLabelWidth">
            <el-input v-model="catalogueName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" v-if="isdialogFormProjectEdit == true" @click="addCatalogue('保存')">确 定</el-button>
          <el-button type="primary" v-if="isdialogFormProjectEdit == false" @click="addCatalogue('编辑')">确 定</el-button>
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
var catalogueId = 0
var interfaceName = ''
var currentCatalogueId = 0
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
        sonCataloguesId: 0,
        cataloguesId: 0,
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
        isdialogFormProjectEdit: true,
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
          sqls: [""],
          paramsDesc: ""
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
            beforeRedis: [''],
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
        if (GLOBAL.interfaceProjectId === 0 || GLOBAL.interfaceProjectList.length === 0){
            this.$axios.get(
                      '/alter/project/getProjects',
                      {
                             params: {
                                  type: 0
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
          this.$data.interfaceProjectList = GLOBAL.interfaceProjectList
          this.$data.project_name = GLOBAL.interfaceProjectId
        }

    },
    created () {
      this.getProject(GLOBAL.interfaceProjectId)
    },
    methods: {
      delectCatalogues(catalogueId){
          this.$axios.get(
                    '/alter/common/deleteCatalogue',
                    {
                      params: {
                        catalogueId: catalogueId
                      }
                    }
            ).then(data => {
                var dataObj = data.data
                if (dataObj.status === 200) {
                    this.$message({
                        message: dataObj.message,
                        type: 'success'
                    });
                    this.getProject(GLOBAL.interfaceProjectId)
                } else {
                    this.$message({
                      message: dataObj.message,
                      type: 'warning'
                    });
                }

            })
      },
      searchInterfase(){
        var interfaceName = this.$data.search.interfaceName
        if (interfaceName == "") {
            this.$message({
              message: "请输入内容",
              type: 'warning'
            });
            return
        }
        this.$axios.get(
                    '/alter/interface/searchInterface',
                    {
                      params: {
                        interfaceName: interfaceName
                      }
                    }
              ).then(data => {
                  var dataObj = data.data.obj

                  if (data.data.status != 200) {
                      this.$message({
                        message: data.data.message,
                        type: 'warning'
                      });
                      return
                  }
                  this.changeProject(dataObj.projectId)
                  this.$data.sonCataloguesId = dataObj.sonCatalogueId
                  this.$data.cataloguesId = dataObj.catalogueId
                  var paramsObj = dataObj.paramsObj
                  this.pasteParams(paramsObj.paramsId,dataObj.sonCatalogueId)
              })
      },
      handlClick() {
            },
      //右键点击
      interfaceRightClick(paramsId, describe, catalogue, index, MouseEvent, object, Node, element) { 
          interfaceName = describe
          this.pasteParams(paramsId, catalogue)
          this.menuVisible = false 
          this.menuVisible = true  
          var menu = document.querySelector('#menu')
          document.addEventListener('click', this.foo) 
          menu.style.display = "block";
          menu.style.left = MouseEvent.clientX - 200 + 'px'
          menu.style.top = MouseEvent.clientY - 125 + 'px'
      },
      foo() { // 取消鼠标监听事件 菜单栏
          this.menuVisible = false
          document.removeEventListener('click', this.foo) 
      },
      plusVariables(){
        var length = this.$data.dataTableDatas.length
        for (var i=0; i< length;i++){
            
          this.$data.dataTableDatas[i].variableValue.push('')
        }
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
      },
      requestInterface() {
        


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
            return null;
        }

        this.tabsActiveName = "Result(返回结果)"
        const loading = this.$loading({
          lock: true,
          text: '请求中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

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
                dynamicVariable: this.$data.dataTableDatas, 
                headers: this.$data.headersTableDatas,
                params: JSON.parse(body),
                paramsId: paramsId,
                projectId: GLOBAL.interfaceProjectId
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
      },
      
      submitInterface() {
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
              projectId: GLOBAL.interfaceProjectId,
              curlToJson: curlToJson,
              curlType: curlType,
              interfaceId: interfaceId,
              typeStatus: interfaceType,
              interfaceName: interfaceName,
              dynamicVariable: [this.$data.dataTableDatas],
              headers: [this.$data.headersTableDatas],
              rests: {
                variableName: this.$data.form.variableName,
                isVariable: this.$data.variableInput,
                sqls: this.$data.form.sqls
              },
              initialTests: [this.$data.tests],
              paramsDesc: this.$data.form.paramsDesc
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
                this.getProject(GLOBAL.interfaceProjectId)
            } else {
                this.$message({
                  message: dataObj.message,
                  type: 'warning'
                });
            }
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
              this.$data.tests.assertData = assertDatas
           }
        },

      handleSelectionChange(val) {
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
        this.$data.restaurants = result
        queryResults = dataObj
        return true;
      },
      
      savaInterface(scene, catalogue) {
        if (scene === 'addRequest') {
          this.$data.dialogFormInterface = true
          this.$data.isEdit = true
          interfaceId = 0
          catalogueId = catalogue
          interfaceType = 1
          this.$data.form.interfaceName = ""
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
          interfaceType = 1
          this.submitInterface()
          return;
        }
      },

      addCatalogue(scene) {
        var type = 1
        if (scene === '编辑') {
          type = 2
        }
         if (scene === '编辑' || scene === '保存') {
          this.$axios({
            url: '/alter/project/catalogueOperation',
            method: 'POST',
            data: {
              projectId: GLOBAL.interfaceProjectId,
              catalogueName: this.$data.catalogueName,
              catalogueId: catalogueId,
              type: type,
              currentCatalogueId: currentCatalogueId
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
                this.getProject(GLOBAL.interfaceProjectId)
                this.$data.catalogueName = ""
            } else {
                this.$message({
                  message: dataObj.message,
                  type: 'warning'
                });
            }
        })
        }else{
          catalogueId = scene
          this.$data.dialogFormProject = true
          this.$data.isdialogFormProjectEdit = true
        }
      },
      editCatalogues(catalogueId,catalogueName){
          this.$data.dialogFormProject = true
          this.$data.catalogueName = catalogueName
          this.$data.isdialogFormProjectEdit = false
          currentCatalogueId = catalogueId
      },
      pasteParams(paramsId, catalogue) {
         this.$axios.get(
                    '/alter/interface/getInterfaceMsg',
                    {
                      params:{
                        paramsId: paramsId
                      }
                    }
        ).then(data => {
            var dataObj = data.data
            var paramsValue = dataObj.obj
            
            this.$data.changeActive = paramsValue.id
            var headers = paramsValue.headers
            var sqls = paramsValue.sqls
            var assertSqls = paramsValue.assertSqls
            var dynamicVariable = paramsValue.dynamicVariable
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

            var paramsDesc = paramsValue.paramsDesc
            this.$data.form.paramsDesc = paramsDesc

            this.$data.form.interfaceName = paramsValue.describe


            if (useCase === '' || useCase === null || useCase === undefined) {
              this.$data.tests.assertData = [initTableData]
            } else {
              this.$data.tests.assertData = JSON.parse(useCase)
            }

            if (dynamicVariable === '' || dynamicVariable === null || dynamicVariable === undefined) {
              var length = dataInitTableData.variableValue.length
              var variableValues = []
              for (var i=0; i< length;i++){
                  variableValues.push('')
              }
              
              this.$data.dataTableDatas = [{
                  variableName: '',
                  variableValue: variableValues,
                  typeOptions: 'String',
                  required: false
              }]
            } else {
              this.$data.dataTableDatas = dynamicVariable
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

            if (initialTests === '' || initialTests === null || initialTests === undefined) {
              this.$data.tests = [
                {
                  assertData: [initTableData],
                  beforeSqls: [''],
                  beforeRedis: [''],
                  assertSqls: sqlInitTableData
                }
              ]
            } else {
              this.$data.tests = initialTests
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
            this.tabsActiveName = "Body(请求报文)"
            this.addTab({
              describe: describe,
              paramsId: paramsValue.id,
              paramsValue: paramsValue
            })
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
      closeProcess(testsId,processId) {
        if (this.$data.tests[testsId].assertData[processId][0].procedures.length == 1){
          return
        }
        this.$data.tests[testsId].assertData[processId][0].procedures.pop()
      },

      plusProcess(testsId,processId) {
          this.$data.tests[testsId].assertData[processId][0].procedures.push({
            procedure: ''
          })
      },
      plusProcedure(testsId) {
        this.$data.tests[testsId].assertData.push([
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
      },

      closeProcedure(testsId,rowIndex) {
        if (rowIndex === 0) {
          return;
        }
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
        var length = dataInitTableData.variableValue.length
        var variableValues = []
        for (var i=0; i< length;i++){
            variableValues.push('')
        }
          
          this.$data.dataTableDatas.push({
              variableName: '',
              variableValue: variableValues,
              typeOptions: 'String',
              required: false
          })
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
      addTestBeforeReids(testId){
        this.$data.tests[testId].beforeReids.push('')
      },
      closeTestBeforeReids(testId,index){
        if (index === 0) {
          return;
        }
        this.$data.tests[testId].beforeReids.splice(index, 1)
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
          GLOBAL.interfaceProjectId = projectId
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
    background-color:#e6f7ff;
    color:#1890ff;
    font-weight: bold;
    border-radius:5px;
}
.interface:hover{
    background-color:#e6f7ff;
    color:#1890ff;
    font-weight: bold;
    border-radius:5px;
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
  width: 245px;
  display: flex;
  height: 25px;
}
.catalogueStyle{
  text-align: center;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  white-space:nowrap;
  cursor:pointer;
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
    width: 300px;
    position:absolute;
    left: -1px;
    text-align:center;
  }
  .right{
    display: flex;
    justify-content: center;
    align-items: center;
    /* background: white; */
    margin-left: 300px;
    width: 82%;
    flex-wrap: wrap;
  }
  .interface-vessel{
    width: 250px;
    flex-wrap: wrap;
    margin-left: 50px;
    height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
  }
   /* for Chrome */
.interface-vessel::-webkit-scrollbar {
    display: none;
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

