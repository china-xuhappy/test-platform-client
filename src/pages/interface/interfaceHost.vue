<template>
    <div class="interfaceHost">
        <el-select v-model="environmentId" placeholder="请选择" 
            @change = "changeEnvironment">
            <el-option
            v-for="item in environments"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>

        <el-button
        class="addBtn"
        type="primary "
        @click="addHost"
        size="small"
        style="margin-bottom:10px;"
        >新增Host(地址)</el-button>

        <el-table
        ref="multipleTable"
        :data="hosts"
        tooltip-effect="dark"
        style="width: 100%"
        >
        <el-table-column v-for="(col,index) in hostsCols" :label="col.label" width="150" :key="index">
            <template slot-scope="scope">
                <el-row class="demo-autocomplete">
                    <el-col :span="102" >
                    <div  >
                        <p>{{scope.row[col.label]}}</p>
                    </div>
                    </el-col>
                </el-row>
                </template>
        </el-table-column>

        <el-table-column
            label="操作"
            width="300"> 
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="medium"  circle  @click="editActivity(scope.row.hostId,scope.row.name,scope.row.host,scope.row.environmentId)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="medium" circle @click="delectHost(scope.row.hostId)"></el-button>
            </template> 
        </el-table-column>
        </el-table>

      <el-dialog title="新增动态配置" :visible.sync="hostDialog" width="800px" append-to-body >
        <el-form ref="form" :model="form" label-width="100px" >
            <div >
                <el-form-item label="名字(Name)"  style="width:300px;">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>

                <el-form-item label="地址(Host)">
                    <el-input v-model="form.host" style="width:300px;"></el-input>
                </el-form-item>

                  <el-form-item label="选择环境：">
                    <el-select v-model="form.environmentId" placeholder="选择环境：" >
                        <el-option
                        v-for="item in environments"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
            </el-form-item>
            </div>
        </el-form>
        <el-button type="primary" v-if="isHostAdit == true" style="margin:auto;display:flex;" @click="addHost('保存')">保存</el-button>
        <el-button type="primary" v-if="isHostAdit == false" style="margin:auto;display:flex;" @click="addHost('编辑')">编辑</el-button>
      </el-dialog>
    </div>
</template>

<script>
var gHostId = 0
import GLOBAL from '../../utils/global_variable.js';
export default {
  data() {
      return {
          hosts: [],
          hostsCols: [],
          form: {
              name: "",
              host: "",
              environmentId: 0
          },
          hostDialog: false,
          isHostAdit: false,
          environmentId: 0,
          environments:[]
      }
  },
   mounted(){
        this.getEnvironment()
  },
  methods: {
      getEnvironment(){
          this.$axios.get(
            '/alter/common/getEnvironment/'
        ).then(data => {
            var dataObj = data.data.obj
            this.$data.environments = dataObj
            this.$data.environmentId = dataObj[0].value
            this.getHosts(dataObj[0].value)
        })
    },
    addHost(scene){
        console.log(scene)
        if (scene != '保存' && scene != '编辑'){
            this.$data.isHostAdit = true
            this.$data.hostDialog = true
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
            url: '/alter/common/hostManage',
            method: 'POST',
            data: {
                name: this.$data.form.name,
                host: this.$data.form.host,
                hostId: gHostId,
                typeStatus: typeStatus,
                environmentId: this.$data.form.environmentId
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
                this.getHosts(this.$data.environmentId)
            } else {
                this.$message({
                message: dataObj.message,
                type: 'warning'
                });
            } 
        })
    },
    delectHost(hostId){
        this.$axios(
        {
            url: '/alter/common/hostManage',
            method: 'POST',
            data: {
                hostId: hostId,
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
                this.getHosts(this.$data.environmentId)
            } else {
                this.$message({
                message: dataObj.message,
                type: 'warning'
                });
            } 
        })
    },
     editActivity(id,name,host,environmentId){
         this.$data.form.name = name
         this.$data.form.host = host
         this.$data.form.environmentId = environmentId
         this.$data.hostDialog = true
         this.$data.isHostAdit = false
         gHostId = id
     },
    changeEnvironment(environmentId){
        this.getHosts(environmentId)
    },
    getHosts(environmentId){
        this.$axios.get(
            '/alter/common/getHosts/',
            {
                params: {
                    environmentId: environmentId
                }
            }
        ).then(data => {
            var dataObj = data.data.obj
            this.$data.hosts = dataObj.hosts
            this.$data.hostsCols = dataObj.hostsCols
        })
    },
  }
}
</script>