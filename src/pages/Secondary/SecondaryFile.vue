<template>
    <div class="interfaceHost">
        <div style="margin:20px auto; width:200px;">
            <el-upload
            class="upload-demo"
            ref="upload"
            action="/alter/common/secondary_upload/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
            :multiple="true"
            :name="file"
            :on-success	= "handleAvatarSuccess"
            :data="uploadImagePar">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">提交上传</el-button>
            </el-upload>
        </div>

        <el-table
            ref="multipleTable"
            :data="fileData"
            tooltip-effect="dark"
            style="width: 100%"
            @header-click="headerChange"
            >
            <el-table-column
                 prop="fileId"
                label="fileId"
                  width="150">
            </el-table-column>
            <el-table-column
                 prop="fileName"
                label="fileName"
                  width="400">
            </el-table-column>
            <el-table-column
                 prop="filePath"
                label="filePath"
                  width="650">
            </el-table-column>
            <el-table-column
                 prop="typeName"
                label="typeName"
                  width="200">
            </el-table-column>
                 <el-table-column
                label="操作"
                width="300"> 
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="medium"  @click="checkSecondary(scope.row.fileId,scope.row.type)">查看</el-button>
                </template> 
            </el-table-column>
            </el-table>
        
        <el-table
        ref="multipleTable"
        :data="secondarysRelust"
        tooltip-effect="dark"
        style="width: 100%;margin-top:50px;"
        @header-click="headerChange"
        >
        <el-table-column v-for="(col,index) in secondaryCols" :label="col.label" width="150" :key="index">
            <template slot-scope="scope">
                <el-row class="demo-autocomplete">
                    <el-col :span="102" >
                    <div  >
                        <p>{{scope.row[index]["value"]}}</p>
                    </div>
                    </el-col>
                </el-row>
            </template> 
        </el-table-column>
        </el-table>
    </div>
</template>

<script>
var gHostId = 0
import GLOBAL from '../../utils/global_variable.js';
export default {
  data() {
      return {
          secondarysRelust: [],
          secondaryCols: [],
          fileData: [],
          fileCols: []
      }
  },
   mounted(){
       this.getSecondaryFiles()
  },
  methods: {
        headerChange(e){
            console.log(e.label)
        },
        getPayDetail(fileId){
            this.$axios.get(
                '/alter/common/analysisSecondary/',
                {
                    params: {
                        fileId: fileId
                    }
                }
            ).then(data => {
                var dataObj = data.data.obj
                this.$data.secondarysRelust = dataObj.secondarysRelust
                this.$data.secondaryCols = dataObj.secondaryCols
            })
        },
        checkSecondary(fileId,fileType){
            console.log(fileId,fileType)
            // 查看文件
            this.getPayDetail(fileId)
        },
        getSecondaryFiles(environmentId){
            this.$axios.get(
                '/alter/common/getSecondaryFiles/',
                {}
            ).then(data => {
                var dataObj = data.data.obj
                this.$data.fileData = dataObj.fileData
                this.$data.fileCols = dataObj.fileCols
            })
        },
        handleClick(tab, event) {
            console.log(tab, event);
         },
         submitUpload() {
             console.log(this.$data.uploadImagePar)
             this.$refs.upload.submit();
         },
         handleRemove(file, fileList) {
            console.log(file, fileList);
         },
         handlePreview(file) {
            console.log(file);
         },
         handleAvatarSuccess(res, file){
            console.log(res,file)
             if (res.status === 200) {
                this.$message({
                    message: res.message,
                    type: 'success'
                });
                // this.$axios.get(
                //                 '/alter/common/get_excle/' + file.name,
                //                 {
                //                 responseType: 'blob'
                //                 }
                //     ).then(data => {
                //         let blob = new Blob([data.data], {
                //         type: 'application/vnd.ms-excel'
                //         })
                //         let fileName = file.name + Date.parse(new Date()) + '.xls'
                //         if (window.navigator.msSaveOrOpenBlob) {
                //             navigator.msSaveBlob(blob, fileName)
                //         } else {
                //         // console.log(3)
                //             var link = document.createElement('a')
                //             link.href = window.URL.createObjectURL(blob)
                //             link.download = fileName
                //             link.click()
                //             //释放内存
                //             window.URL.revokeObjectURL(link.href)
                //         } 
                //     })
            } else {
                this.$message({
                    message: res.message,
                    type: 'warning'
                });
            } 
         }
  }
}
</script>