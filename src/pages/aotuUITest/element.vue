<template>
    <div class="elements">
        <div class="activitys">
            <el-select v-model="project_name" placeholder="请选择" 
                @change = "changeProject">
                <el-option
                v-for="item in uiProjectList"
                :key="item.id"
                :label="item.projectName"
                :value="item.id">
                </el-option>
            </el-select>
            <!-- <el-select v-model="activity_Id" filterable placeholder="请选择"
                @change = "changeActivity">
                <el-option
                v-for="item in activitysList"
                :key="item.id"
                :label="item.activity_name"
                :value="item.id">
                </el-option>
            </el-select> -->

            <el-button type="primary" @click="addElement" size="small" >添加元素</el-button>
            <el-button type="primary" @click="savaElements" size="small" >保存元素</el-button>


            <!-- <p>请选择yml文件，并点击提交。</p>     -->
            <div style="margin:20px auto; width:200px;">
                <el-upload
                class="upload-demo"
                ref="upload"
                action="/alter/element/elementXmlImport"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="true"
                :multiple="true"
                :name="file"
                :on-success	= "handleAvatarSuccess"
                :data="uploadElementXmlData">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">提交上传</el-button> -->
                </el-upload>
            </div>

        </div>
        <div class="activity-box" v-infinite-scroll="load" infinite-scroll-disabled="disabled" >
                <ul class="activity-box-list" >
                    <li v-for="(i,index) in activitysList" class="activity-box-list-item" :key="index" @click="changeActivity(i.id,i.img_url);" :class="{clickstyle:changeGatherNum == i.id}" >
                      <div>{{ i.activity_name }}</div>
                      <!-- <div>
                        <el-image 
                          style="width: 27px; height: 50px"
                          :src="i.img_url"
                          :preview-src-list="[i.img_url]">
                        </el-image>
                      </div> -->
                    </li>
                </ul>
            </div>
        <div style="display:flex;align-items:center;background: white;">
            <div>
              <!-- <el-tree
              :data="data"
              node-key="id"
              default-expand-all
              @node-drag-start="handleDragStart"
              @node-drag-enter="handleDragEnter"
              @node-drag-leave="handleDragLeave"
              @node-drag-over="handleDragOver"
              @node-drag-end="handleDragEnd"
              @node-drop="handleDrop"
              draggable
              :allow-drop="allowDrop"
              :allow-drag="allowDrag">
            </el-tree> -->
          </div>
          <div>
            <img 
                style="width: 320px;margin-right:10px;border-radius:10px;margin-left:20px;"
                :src="locationImg"
                @click="uiAppClick"
              />
          </div>
          <div class="elements">
             <el-table
                :data="elementDatas"
                style="width: 100%"
                height="690"
                >
                
                <el-table-column
                  label="element_name"
                  width="250">
                  <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
                  <template slot-scope="scope">
                    <el-row class="demo-autocomplete">
                     <el-col :span="102" >
                        <div  >
                          <el-input
                            class="inline-input"
                            v-model="scope.row.element_name"
                            placeholder="请输入元素名"
                          ></el-input>
                        </div>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>

                <el-table-column
                  label="element_type"
                  width="200">
                  <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
                  <template slot-scope="scope">
                    <el-row class="demo-autocomplete">
                     <el-col :span="102" >
                        <el-select v-model="scope.row.element_type" placeholder="请选择" style="width:180px;">
                          <el-option
                            v-for="item in uiTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>

                <el-table-column
                  label="element_path"
                  width="450">
                  <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
                  <template slot-scope="scope">
                    <el-row class="demo-autocomplete">
                     <el-col :span="102" >
                        <div  >
                          <el-input
                            class="inline-input"
                            v-model="scope.row.element_path"
                            placeholder="请输入element path"
                            style="width:400px;"
                          ></el-input>
                        </div>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>

                <el-table-column
                    label="操作"
                    width="250"> 
                    <template slot-scope="scope">
                            <el-button type="danger" size="mini" @click="deleteElement(scope.$index,scope.row.id)">删除</el-button>
                            <el-button type="primary" size="mini" @click="acquireActivitySign(scope.row.id)">位置</el-button>
                    </template> 
                </el-table-column>
            </el-table>
          </div>
        </div>
    </div>
</template>

<script>
import GLOBAL from '../../utils/global_variable.js';
var gActivityId = 0
export default {
  data() {
      return {
        data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, 
        {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, 
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
           {
            id: 8,
            label: '二级 3-2',
            children: [{
             id: 11,
              label: '三级 3-2-1'
            }, {
              id: 12,
              label: '三级 3-2-2'
            }, {
              id: 13,
              label: '三级 3-2-3'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        changeGatherNum:0,
        locationImg:"https://xu-happy.oss-cn-beijing.aliyuncs.com/QQ%E5%9B%BE%E7%89%8720210118111016.png",
        uiProjectList: [],
        project_name: "",
        uploadElementXmlData:{

        },
        activitysList: [],
        activity_Id: "",
        elementDatas: [],
        uiTypeOptions:[
           {
            value: 'ID',
            label: 'ID'
          },
          {
            value: 'XPath',
            label: 'XPath'
          },
          {
            value: 'Name',
            label: 'Name'
          },
          {
            value: 'ClassName',
            label: 'ClassName'
          }
        ],
      }
  },
  mounted(){
      this.$axios.get(
                      '/alter/project/getProjects',
                      {
                             params: {
                                  type: 1
                              }
                          }
        ).then(data => {
            var dataObj = data.data
            GLOBAL.uiProjectList = dataObj.obj
            GLOBAL.projectName = dataObj.obj[0].projectName
            GLOBAL.interfaceProjectId = dataObj.obj[0].id

            this.$data.uiProjectList = dataObj.obj
            this.$data.project_name = dataObj.obj[0].id
        })
  },
  methods: {
    handleDragStart(node, ev) {
        console.log('drag start', node);
      },
      handleDragEnter(draggingNode, dropNode, ev) {
        console.log('tree drag enter: ', dropNode.label);
      },
      handleDragLeave(draggingNode, dropNode, ev) {
        console.log('tree drag leave: ', dropNode.label);
      },
      handleDragOver(draggingNode, dropNode, ev) {
        console.log('tree drag over: ', dropNode.label);
      },
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        console.log('tree drag end: ', dropNode && dropNode.label, dropType);
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        console.log('tree drop: ', dropNode.label, dropType);
      },
      allowDrop(draggingNode, dropNode, type) {
        if (dropNode.data.label === '二级 3-1') {
          return type !== 'inner';
        } else {
          return true;
        }
      },
      allowDrag(draggingNode) {
        return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
      },
    uiAppClick(event){
      console.log(event)
       const rect=event.target.getBoundingClientRect()//获取点击的dom的位置
            console.log(rect)
    },
    changeProject(projectId,vent){
        GLOBAL.uiProjectId = projectId
        var project = this.$data.uiProjectList.find((item)=>{
            console.log(item.value)
            return item.id === projectId;
        });
        GLOBAL.projectName = project.projectName
        this.getActivitys(projectId)
    },
    deleteElement(rowIndex,elementId){
        this.$data.elementDatas.splice(rowIndex, 1)
        if (elementId === undefined){
            return
        }
        this.$axios(
            {
                url: '/alter/element/deleteElement',
                method: 'POST',
                data: {
                    elementId: elementId
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(data => {
            
        })
    },
    changeActivity(activityId, locationImg) {
        gActivityId = activityId
        this.$data.changeGatherNum = activityId
        this.$data.locationImg = locationImg
        this.$data.uploadElementXmlData = {
          activityId: activityId
        }
        this.getElements(activityId)
    },
    acquireActivitySign(elementId){
       this.$axios.get(
            '/alter/element/acquireActivitySign',
            {
                params: {
                    elementId: elementId
                }
            }
        ).then(data => {
            var dataObj = data.data
            this.$data.locationImg = "data:image/jpg;base64,"+dataObj.obj.base64
        })
    },
    // 获取项目下面的页面
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
            this.$data.activitysList = dataObj
            this.$data.activity_Id = dataObj[0].id
            this.$data.changeGatherNum = this.$data.activity_Id
            this.getElements(dataObj[0].id)
        })
    },
    getElements(activityId){
        this.$axios.get(
            '/alter/element/elementsOperation',
            {
                params: {
                    activityId: activityId
                }
            }
        ).then(data => {
            var dataObj = data.data
            this.$data.elementDatas = dataObj
        })
    },
    savaElements(){
        this.$axios(
            {
                url: '/alter/element/elementsOperation',
                method: 'POST',
                data: {
                    elementDatas: [this.$data.elementDatas],
                    activityId: gActivityId
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
                this.getElements(gActivityId)
            } else {
                this.$message({
                    message: dataObj.message,
                    type: 'warning'
                });
            } 
        })
    },
    addElement (){
        this.$data.elementDatas.push({
            "element_name": "",
            "element_type": "ID",
            "element_path": ""
        })
    }
  }
}
</script>
<style scoped>

.activity-box {
  width: 100%;
  /* height: 300px; */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-x: hidden;
  overflow-y: auto;
  border-bottom: 1px solid #C0C0C0;
  background: white;
}
.activity-box::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.activity-box-list {
  padding: 0;
  font-size: 14px;
  display: flex;
}
.clickstyle{
  background-color:#e6f7ff;
  color:#1890ff;
  font-weight: bold;
  border-radius:5px;
}
.activity-box-list-item:hover{
    background-color:#e6f7ff;
    color:#1890ff;
    font-weight: bold;
    border-radius:5px;
}

.activity-box-list-item {
  text-align: center;
  width: 200px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  list-style: none;
  padding: 0 1rem;
  box-sizing: border-box;
  height: 50px;
  line-height: 50px;
  border-right: 1px solid #e7e7e7;
  cursor:pointer;
  display: flex;
  justify-content: space-around;
}
</style>