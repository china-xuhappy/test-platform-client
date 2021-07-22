<template>
  <div class="file">
    <p>请选择xmind文件，并点击提交。</p>
    <p>(转换完成会自动下载文件)</p>
    
    <div style="margin:20px auto; width:200px;">
        <el-upload
        class="upload-demo"
        ref="upload"
        action="/alter/common/xmindToExcle/"
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

    <!-- <el-button type="primary">下载</el-button> -->

  </div>
</template>

<script>
import GLOBAL from '../../utils/global_variable.js';
export default {
  mounted(){
    var userId = this.getCookie('userId');
    if (userId == null){
      this.$router.push({name:'login'});
    }
    this.$axios.get(
                '/alter/user/getUser',
                {
                  params: {
                    userId: userId
                  }
                }
      ).then(data => {
          var dataObj = data.data.obj
           GLOBAL.userInfo= dataObj
      })
    
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
                this.$axios.get(
                                '/alter/common/get_excle/' + file.name,
                                {
                                responseType: 'blob'
                                }
                    ).then(data => {
                        let blob = new Blob([data.data], {
                        type: 'application/vnd.ms-excel'
                        })
                        let fileName = file.name + Date.parse(new Date()) + '.xls'
                        if (window.navigator.msSaveOrOpenBlob) {
                            navigator.msSaveBlob(blob, fileName)
                        } else {
                        // console.log(3)
                            var link = document.createElement('a')
                            link.href = window.URL.createObjectURL(blob)
                            link.download = fileName
                            link.click()
                            //释放内存
                            window.URL.revokeObjectURL(link.href)
                        } 
                    })
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
