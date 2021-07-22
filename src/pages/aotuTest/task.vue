<template>
    <div class="utils">
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

          <el-form-item>
              <el-button class="addBtn" type="primary " @click="taskOperation" size="small" style="margin-bottom:10px;" >添加定时任务</el-button>

          </el-form-item>
      </el-form>
      <div style="width:100%;">
            <el-table :data="tasks"
                    border
                    ref="multipleTable"
                    row-key="id"
                    align="left"
                    >

                    <el-table-column 
                        label="定时任务名称"
                        width="350"> 
                        <template slot-scope="scope">
                            {{scope.row.taskName}}
                        </template>
                    </el-table-column>

                    <el-table-column 
                        label="定时任务Cron"
                        width="350"> 
                        <template slot-scope="scope">
                            {{scope.row.taskCron}}
                        </template>
                    </el-table-column>

                    <el-table-column 
                        label="定时任务状态"
                        width="350"> 
                        <template slot-scope="scope">
                            {{scope.row.taskStatus}}
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
                        :label="操作"
                        width="280"> 
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" circle @click="editTask(scope.row.id)"></el-button>
                            <el-button type="primary" icon="el-icon-delete" circle @click="deleteTask(scope.row.id)"></el-button>
                            <el-button type="primary" icon="el-icon-video-pause"  circle @click="pauseTask(scope.row.id)"></el-button>
                            <el-button type="primary" icon="el-icon-video-play"  circle  @click="resumeTask(scope.row.id)"></el-button>
                        </template> 
                    </el-table-column>
            </el-table>
            </div>

        <el-dialog title="添加用例集" :visible.sync="taskDialogFormProject" width="1000px" append-to-body>
        <el-form :model="task">
          <el-form-item label="定时任务名称" :label-width="formLabelWidth">
            <el-input v-model="task.taskName" autocomplete="off"></el-input>
          </el-form-item>
            <el-form-item label="定时任务Cron">
                <el-input v-model="task.taskCron"></el-input>
            </el-form-item>
            <el-form-item label="定时任务类型：">
                <el-select v-model="taskTypeName" placeholder="请选择定时任务类型" 
                    @change = "changeTaskType">
                    <el-option
                    v-for="item in taskTypes"
                    :key="item.taskTypeId"
                    :label="item.taskTypeName"
                    :value="item.taskTypeId">
                    </el-option>
                </el-select>
            </el-form-item>

            <div  v-show="interfaceVisible">
                <el-form-item label="选择接口：">
                    <el-select v-model="task.taskArgsInterface" multiple placeholder="选择接口" style="width:100%;">
                        <el-option
                        v-for="item in interfaces"
                        :key="item.interfaceId"
                        :label="item.value"
                        :value="item.interfaceId">
                        </el-option>
                    </el-select>
            </el-form-item>
         </div>   

        <div  v-show="gatherVisible">
                <el-form-item label="选择测试集合：">
                    <el-select v-model="task.taskArgsInterface" multiple placeholder="选择测试集合：" style="width:100%;">
                        <el-option
                        v-for="item in interfaces"
                        :key="item.value"
                        :paramId="item.paramId"
                        :value="item.value">
                        </el-option>
                    </el-select>
            </el-form-item>
         </div>  

         <div  v-show="projectVisible">
                <el-form-item label="选择项目：">
                    <el-select v-model="task.taskArgsInterface" multiple placeholder="选择项目：" style="width:100%;">
                        <el-option
                        v-for="item in interfaces"
                        :key="item.value"
                        :paramId="item.paramId"
                        :value="item.value">
                        </el-option>
                    </el-select>
            </el-form-item>
         </div>  

        </el-form>
          <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="taskOperation('确定')">保存</el-button>
            </div>
      </el-dialog>

    </div>
</template>

<script>
var gEnterStatus = 0
var gTaskType = 0
import GLOBAL from '../../utils/global_variable.js';

export default {
  data() {
      return {
        taskDialogFormProject: false,
        task:{
            taskCron:'? ? ? ? ? */15',
            taskName: '下单到结算',
            taskArgsInterface: []
        },
        interfaces: [],
        tasks: [],
        interfaceProjectList: [],
        project_name:'',
        taskTypeName: '接口定时任务',
        interfaceVisible: true,
        gatherVisible: false,
        projectVisible: false,
        taskTypes: [
            {
                taskTypeName: "接口定时任务",
                taskTypeId: 0
            },
             {
                taskTypeName: "测试集合定时任务",
                taskTypeId: 1
            },
             {
                taskTypeName: "项目定时任务",
                taskTypeId: 2
            }
        ]
      }
  },
   created() {
    this.getTasks();
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
            console.log("111")
          this.$data.interfaceProjectList = GLOBAL.interfaceProjectList
          this.$data.project_name = GLOBAL.interfaceProjectId
        }
  },
  methods: {
    resumeTask(taskId){
        var task = this.$data.tasks.find((item)=>{
              console.log(item.value)
            return item.id === taskId
        });
        gEnterStatus = 4
        this.$data.task.taskName = task.taskName
        this.taskOperation("确定")
    },
    pauseTask(taskId){
        var task = this.$data.tasks.find((item)=>{
              console.log(item.value)
            return item.id === taskId
        });
        gEnterStatus = 3
        this.$data.task.taskName = task.taskName
        this.taskOperation("确定")
    },
    deleteTask(taskId){
        var task = this.$data.tasks.find((item)=>{
              console.log(item.value)
            return item.id === taskId
        });
        gEnterStatus = 2
        this.$data.task.taskName = task.taskName
        this.taskOperation("确定")
    },
    editTask(taskId){
        var task = this.$data.tasks.find((item)=>{
              console.log(item.value)
            return item.id === taskId
        });
        this.$data.taskDialogFormProject = true
        this.$data.task.taskCron = task.taskCron
        this.$data.task.taskName = task.taskName
        gEnterStatus = 1
    },
     getTasks(){
        this.$axios.get(
            '/alter/common/taskOperation',
            {
                params: {
                    projectId: GLOBAL.interfaceProjectId
                }
            }
        ).then(data => {
            var dataObj = data.data
            this.$data.tasks = dataObj.obj
        })
     },

     taskOperation(scene){
         console.log(GLOBAL.userInfo)
         if (scene === '确定') {
        //      var params = this.$data.interfaces.find((item)=>{
        //       console.log(item.value)
        //     return item.value === this.$data.interfaceValue;
        //   });

            this.$axios({
                url: '/alter/common/taskOperation',
                method: 'POST',
                data: {
                    taskCron: this.$data.task.taskCron,
                    taskName: this.$data.task.taskName,
                    projectId: GLOBAL.interfaceProjectId,
                    userId: GLOBAL.userInfo.userId,
                    taskArgs: [this.$data.task.taskArgsInterface],
                    enterStatus: gEnterStatus,
                    taskType: gTaskType,
                    environment: GLOBAL.interceptor === '' ? 0 : GLOBAL.interceptor
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(data => {
                var dataObj = data.data
                if (dataObj.status === 200) {
                    this.taskDialogFormProject = false
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
         }else{
             this.taskDialogFormProject = true
             enterStatus = 0
         }
     },
      changeProject(projectId){
        GLOBAL.interfaceProjectId = projectId
         var project = this.$data.interfaceProjectList.find((item)=>{
              console.log(item.value)
            return item.id === projectId;
          });
         GLOBAL.projectName = project.projectName
         
        this.$data.tasks = []
        this.getTasks()
        this.getInterfaces()
    },
    changeTaskType(typeId) {
        console.log(typeId)
        this.$data.interfaceVisible = false
        this.$data.gatherVisible = false
        this.$data.projectVisible = false
        if (typeId === 0) {
            this.$data.interfaceVisible = true
        }else if (typeId === 1 ){
            this.$data.gatherVisible = true
        }else if (typeId === 2 ){
            this.$data.projectVisible = true
        }
        gTaskType = typeId
    },
    getInterfaces(){
        this.$axios.get(
            '/alter/interface/getIterfaces',
            {
                params:{
                    projectId: GLOBAL.interfaceProjectId
                }
            }
            ).then(data => {
                var dataObj = data.data.obj
                this.$data.interfaces = dataObj
        })
    }
  }
}
</script>