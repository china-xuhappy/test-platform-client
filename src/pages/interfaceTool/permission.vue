<template>
  <div class="file">
    <p>请选择yml文件，并点击提交。</p>    
    <div style="margin:20px auto; width:200px;">
        <el-upload
        class="upload-demo"
        ref="upload"
        action="/alter/common/permission/"
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

  </div>
</template>

<script>
import GLOBAL from '../../utils/global_variable.js';
export default {
  mounted(){
  },
  methods: {
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

<style>
.file{
    width: 300px;
    margin: 50px auto;

    font-size: 20px;
    color: red;
    text-align: center;
}
</style>
