<template>
    <div class="project">

        <el-button
            class="addBtn"
            type="primary "
            @click="addProject"
            size="small"
            style="margin-bottom:10px;"
            >添加项目</el-button>

        <el-table
            :data="interfaceProjectList" 
            style="width: 100%">
            <el-table-column
              label="Id">
              <template slot-scope="scope">
                 {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column
              label="项目名称"
              prop="name">
              <template slot-scope="scope">
                 {{scope.row.projectName}}
              </template>
            </el-table-column>
            <el-table-column
              label="项目类型"
              prop="project_type">
              <template slot-scope="scope">
                 <el-tag v-if="scope.row.project_type == '0'" type="success">接口自动化</el-tag>
                 <el-tag v-if="scope.row.project_type == '1'" type="success">APP自动化</el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="负责任"
              prop="users">
              <template slot-scope="scope">
                <div style="display:flex;">
                  <p v-for="(value, key, index) in scope.row.users" :key="index">
                      {{value.username}} &nbsp;
                  </p>
                </div>
              </template>
            </el-table-column> -->
            <el-table-column
              label="代码文件"
              prop="python">
              <template slot-scope="scope">
                <div style="display:flex;">
                  <p v-for="(value, key, index) in scope.row.python_files" :key="index">
                      {{value.file_name}} &nbsp;
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="是否私有"
              prop="is_read">
              <template slot-scope="scope">
                 {{scope.row.is_read}}
              </template>
            </el-table-column>
            <el-table-column
              align="right">
              

              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit" circle
                  @click="editProject(scope.row.id,scope.row.projectName,scope.row.project_type,scope.row.users,scope.row.python_files,scope.row.is_read)"></el-button>
                <el-button
                  type="primary"
                  icon="el-icon-delete" circle
                  @click="deleteProject(scope.row.id)"></el-button>
              </template>
            </el-table-column>
      </el-table>


      <el-dialog title="添加项目" :visible.sync="dialogFormProject" width="500px" append-to-body>
        <el-form :model="form" label-width="100px">
          <el-form-item label="项目名称：">
            <el-input v-model="form.projectName"></el-input>
          </el-form-item>
          <!-- <el-form-item label="负责任：">
            <el-select v-model="form.dutyPerson" multiple placeholder="负责任">
                <el-option
                v-for="item in dutyPersonList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId">
                </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="代码文件：">
            <el-select v-model="form.python_files" multiple placeholder="代码文件">
                <el-option
                v-for="item in pythonFiles"
                :key="item.value"
                :label="item.value"
                :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否私有：">
            <el-switch v-model="form.isPrivate"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addProject('确定')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import GLOBAL from '../../utils/global_variable.js';
var isEdit = 0 //0新增，1编辑
var gprojectId = 0
export default {
  data() {
      return {
          interfaceProjectList: [], //所有项目
          dutyPersonList: [
              {value: 1, label: '徐开心'}
          ], //负责人list
          pythonFiles:[],
          dialogFormProject: false, 
          form: {
              projectName: '', //项目名
              dutyPerson: '', //负责人
              isPrivate: false, //是否私有
              python_files: ''
          }
      }
  },
  mounted(){
    var userId = this.getCookie('userId');
    if (userId == null&& userId == ""){
      this.$router.push({name:'login'});
    }else{
      this.$axios.get(
                '/alter/user/getUser'
      ).then(data => {
          var dataObj = data.data.obj
          this.$data.dutyPersonList = dataObj
      })

      this.$axios.get(
                '/alter/func/getPythonFiles'
      ).then(data => {
          var dataObj = data.data.obj
          this.$data.pythonFiles = dataObj
      })

      this.getProject()
    }
      
  },
  methods: {
     editProject(projectId,projectName,project_type,users,python_files,is_read){
       console.log(users)
       var dutyPerson = []
        for (var i=0; i< users.length;i++){
            dutyPerson.push(users[i].username)
        }
       this.$data.dialogFormProject = true
       this.$data.form.projectName = projectName
       this.$data.form.dutyPerson = dutyPerson
       this.$data.form.isPrivate = is_read
       this.$data.form.python_files = python_files
       isEdit = 1
       gprojectId = projectId
     },
     deleteProject(projectId){
       if(GLOBAL.userInfo === null){
          this.$router.push({name:'login'});
       }
        this.$axios({
            url: '/alter/project/deleteProject',
            method: 'POST',
            data: {
              projectId: projectId,
              userId: GLOBAL.userInfo.userId
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(data => {
          this.$message({
            message: data.data.message,
            type: 'success'
          });
          this.getProject()
        })
     },
      addProject(scene) {
            if (scene === '确定') {
              console.log(this.$data.form)
              this.$axios({
                url: '/alter/project/projectManage',
                method: 'POST',
                data: {
                  projectName: this.$data.form.projectName,
                  dutyPerson: [this.$data.form.dutyPerson],
                  isPrivate: 1,
                  pythonFiles: [this.$data.form.python_files],
                  isEdit: parseInt(isEdit),
                  projectId: gprojectId
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(data => {
                this.$data.dialogFormProject = false
                this.$data.form.projectName = ""
                this.$data.form.dutyPerson =  ""
                this.$data.form.isPrivate =  ""
                this.$data.form.python_files =  ""
                isEdit = 0
                gprojectId = 0
                this.getProject()
            })
          } else {
            this.$data.dialogFormProject = true
            isEdit = 0
            gprojectId = 0
          }
      },
      getProject(){
          this.$axios.get(
                  '/alter/project/getProjects'
        ).then(data => {
            var dataObj = data.data
            this.$data.interfaceProjectList = dataObj.obj
            GLOBAL.interfaceProjectId = dataObj.obj[0].id
        })
      }
  }
}
</script>