<template>
    <div id="login" class="login">
        <el-form ref="loginForm" :model="loginForm" label-width="80px" class="login-page" >
            <h2>凹凸接口自动化平台</h2>
            <el-form-item label="用  户:" prop="username">
                <el-input v-model="loginForm.username"  name="username"  placeholder="请输入用户名" auto-complete="on">
                <el-button slot="prepend" icon="el-icon-user"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="密 码:">
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码">
                <el-button slot="prepend" icon="el-icon-key"></el-button>
                </el-input>
            </el-form-item>
                <el-button type="primary" icon="el-icon-user-solid" @click="handleLogin">登 录</el-button>
        </el-form>
    </div>
</template>


<script>
import GLOBAL from '../../utils/global_variable.js';

export default {
  data() {
    return {
        loginForm:{
            username: 'admin',
            password: '123456'
        }
    }
  },
  mounted(){
    var userId = this.getCookie('userId');
    if (userId != null && userId != ""){
        this.$axios.get(
                    '/alter/user/getUser',
                    {
                        params: {
                            userId: userId
                        }
                    }
        ).then(data => {
            var dataObj = data.data.obj
            GLOBAL.userInfo = dataObj
            console.log(GLOBAL.userInfo)
            // this.$router.push({path: '/aotuTest/project'});
            this.$router.push({path: '/aotuUITest/config'});
        })
    }
  },
  methods: {
        handleLogin (){
            // 新工单保存
            this.$axios({
                url: '/alter/user/login',
                method: 'post',
                data: {
                    username: this.$data.loginForm.username,
                    password: this.$data.loginForm.password
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(data => {
                var dataObj = data.data
                if (dataObj.status === 200) {
                    this.$message({
                        message: '登录成功',
                        type: 'success'
                    });
                    GLOBAL.userInfo = dataObj.obj
                    this.setCookie('userId', dataObj.obj.userId, 360);
                    // this.$data.newTask = false;
                    // this.dateClickhandler(this.$data.default_date)
                    //  this.$router.push({name:'project'});
                    // this.$router.push({path: '/aotuTest/project'});

                    this.$router.push({path: '/aotuUITest/config'});
                    
                } else {
                    this.$message({
                      message: dataObj.message,
                      type: 'warning'
                    });
                }
            })
      }
  }
};
</script>
<style scoped>
.login {
  margin-top: 200px;
  width: 100%;
  height: 100%;
}
.login-page {
  border-radius: 5px;
  margin: auto;
  width: 350px;
  padding: 35px 55px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  text-align: center;
}
</style>