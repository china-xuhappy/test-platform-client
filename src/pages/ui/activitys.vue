<template>
    <div class="uiactivity">
        <el-button
        class="addBtn"
        type="primary "
        @click="addActivity"
        size="small"
        style="margin-bottom:10px;"
        >新增页面</el-button>

        <el-table
        ref="multipleTable"
        :data="activitys"
        tooltip-effect="dark"
        style="width: 100%"
        >
        <el-table-column v-for="(col,index) in activityCols" :label="col.label" width="150" :key="index">
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
        prop="name"
        label="页面地址"
        width="600">
        <template slot-scope="scope" >
            <el-col :span="102" >
                    <div  >
                        <el-tag  type="success">{{scope.row.activityPath}}</el-tag>
                    </div>
                    </el-col>
        </template>
        </el-table-column>

        <el-table-column
            label="操作"
            width="300"> 
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="medium"  circle  @click="editActivity(scope.row.id,scope.row.activityName,scope.row.activityPath,scope.row.describe)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="medium" circle @click="delectActivity(scope.row.id)"></el-button>
            </template> 
        </el-table-column>
        </el-table>

      <el-dialog title="新增页面" :visible.sync="activityDialog" width="1000px" append-to-body :top="0">
        <el-form ref="form" :model="form" label-width="80px" >
            <div >
                <el-form-item label="页面名称"  style="width:300px;">
                    <el-input v-model="form.activityName"></el-input>
                </el-form-item>

                <el-form-item label="页面地址">
                    <el-input v-model="form.activityPath" style="width:500px;"></el-input>
                </el-form-item>

                 <el-form-item label="页面描述">
                     <!-- type="textarea" -->
                    <el-input
                        placeholder="请输入描述内容"
                        v-model="form.describe"
                        maxlength="100"
                        >
                        </el-input>
                </el-form-item>
            </div>
        </el-form>
        <el-button type="primary" v-if="isActivityAdit == true" style="margin:auto;display:flex;" @click="addActivity('保存')">保存</el-button>
        <el-button type="primary" v-if="isActivityAdit == false" style="margin:auto;display:flex;" @click="addActivity('编辑')">编辑</el-button>
      </el-dialog>
    </div>
</template>

<script>
var gActivityId = 0
var projectId = 24
import GLOBAL from '../../utils/global_variable.js';
export default {
  data() {
      return {
          activitys: [],
          activityCols: [],
          form: {
              activityName: "",
              activityPath: "",
              describe: ""
          },
          activityDialog: false,
          isActivityAdit: false,
      }
  },
   mounted(){
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
    addActivity(scene){
        console.log(scene)
        if (scene != '保存' && scene != '编辑'){
            this.$data.isActivityAdit = true
            this.$data.activityDialog = true
            return
        }
        var typeStatus = 0
        if (scene === '保存') {
            typeStatus = 0
        }else if (scene === '编辑') {
            typeStatus = 1
        }
        this.$axios(
        {
            url: '/alter/element/activityManage',
            method: 'POST',
            data: {
                activityName: this.$data.form.activityName,
                activityPath: this.$data.form.activityPath,
                describe: this.$data.form.describe,
                activityId: gActivityId,
                typeStatus: typeStatus,
                projectId: projectId
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
                this.$data.activityDialog = false
                this.getActivitys(projectId)
            } else {
                this.$message({
                message: dataObj.message,
                type: 'warning'
                });
            } 
        })
    },
    delectActivity(activityId){
        this.$axios(
        {
            url: '/alter/element/activityManage',
            method: 'POST',
            data: {
                activityId: activityId,
                typeStatus: 2
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
                this.getActivitys(projectId)
            } else {
                this.$message({
                message: dataObj.message,
                type: 'warning'
                });
            } 
        })
    },
     editActivity(id,activityName,activityPath,describe){
         this.$data.form.activityName = activityName
         this.$data.form.activityPath = activityPath
         this.$data.form.describe = describe
         this.$data.activityDialog = true
         this.$data.isActivityAdit = false
         gActivityId = id
     },
      getActivitys(projectId){
        this.$axios.get(
            '/alter/element/getActivitys',
            {
                params: {
                    projectId: projectId
                }
            }
        ).then(data => {
            var dataObj = data.data.obj
            this.$data.activitys = dataObj.activitys
            this.$data.activityCols = dataObj.activityCols
        })
    },
  }
}
</script>