<template>
    <div class="suite">

        <el-button
            class="addBtn"
            type="primary "
            @click="addDevices"
            size="small"
            style="margin-bottom:10px;"
            >新增设备</el-button>

       <el-table
        ref="multipleTable"
        :data="devicesDatas"
        tooltip-effect="dark"
        style="width: 100%"
        >
        <el-table-column 
            v-for="(col,index) in devicesCols"
            :label="col.label"
            width="180"
            :key="index"
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
            width="200"> 
            <template slot-scope="scope">
                <el-button type="primary" size="mini" round @click="editDevice(scope.row.deviceId,scope.row.device_bp,scope.row.device_port,scope.row.describe)">编辑</el-button>
                <el-button type="primary" size="mini" round @click="quitDevice(scope.row.deviceId)">关闭设备</el-button>
                <!-- <el-button type="danger" icon="el-icon-delete" circle @click="delectInterfas(scope.row.flowId)"></el-button> -->
                <!-- <el-button type="primary" icon="el-icon-top" circle @click="topCases(scope.row.flowId)"></el-button> -->
            </template> 
        </el-table-column>
        </el-table>

      <el-dialog title="新增设备" :visible.sync="deviceDialog" width="500px"  append-to-body>
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="手机设备">
                 <el-select v-model="form.deviceName" placeholder="请选择" 
                @change = "changeProject">
                    <el-option
                    v-for="item in devicesList"
                    :key="item.device"
                    :label="item.device"
                    :value="item.device">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="设备(PORT): ">
                <el-input v-model="form.devicePort"></el-input>
            </el-form-item>
            <el-form-item label="设备(BPORT): ">
                <el-input v-model="form.deviceBp"></el-input>
            </el-form-item>
            <el-form-item label="设备描述: ">
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
        <el-button type="primary" style="margin:auto;display:flex;" @click="addDevices('确定')">保存</el-button>
      </el-dialog>

    </div>
</template>
<script>
var gSuiteId = 0
export default {
    data() {
        return {
            devicesDatas: [],
            devicesCols: [],
            form: {
                deviceName: "",
                describe:"",
                devicePort: "",
                deviceBp: ""
            },
            deviceDialog: false,
            devicesList: []
        }
    },
    mounted(){
        this.getDevices()
    },
    methods: {
        editDevice(deviceId,deviceBp,devicePort,describe){
            // this.$data.form.deviceName = deviceName
            this.$data.form.describe = describe
            this.$data.form.devicePort = devicePort
            this.$data.form.deviceBp = deviceBp
            this.$data.deviceDialog = true

        },
        getDevices(){
            this.$axios.get(
                '/alter/ui_case/uiDevicesOperation',
            ).then(data => {
                var dataObj = data.data.obj
                this.$data.devicesDatas = dataObj.devices
                this.$data.devicesCols = dataObj.devicesCols
            })
        },
        quitDevice(deviceId){
            this.$axios(
                {
                    url: '/alter/ui_suite/quitServer',
                    method: 'POST',
                    data: {
                        deviceId: deviceId,
                        quitType: 1
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
                        this.getDevices()
                    } else {
                        this.$message({
                        message: dataObj.message,
                        type: 'warning'
                        });
                    } 
                })
        },
        addDevices(scene) {
            if (scene === '确定') {
                this.$axios(
                {
                    url: '/alter/ui_case/uiDevicesOperation',
                    method: 'POST',
                    data: {
                        deviceName: this.$data.form.deviceName,
                        describe: this.$data.form.describe,
                        devicePort: this.$data.form.devicePort,
                        deviceBp: this.$data.form.deviceBp,
                        type: 0
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
                        this.getDevices()

                    } else {
                        this.$message({
                        message: dataObj.message,
                        type: 'warning'
                        });
                    } 
                })
            }else{
                this.$data.deviceDialog = true
                this.$axios.get(
                    '/alter/ui_suite/getStartupConfig',
                ).then(data => {
                    var dataObj = data.data.obj
                    this.$data.devicesList = dataObj.devices
                    this.$data.form.deviceName = dataObj.devices[0].label
                })
            }

        }
    }
  
}
</script>