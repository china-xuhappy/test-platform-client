<template>
  <div class="layout">
    <div class="siderbar-wrapper" :style="{width: this.isCollapsed?'64px':'200px'}" >
      <div class="logo-wrapper">
        <p style="font-size:20px;color:black;font-weight:bold;">自动化测试平台</p>
      </div>
      <el-menu
        background-color="#fff"
        text-color="#000"
        active-text-color="black"
        class="menu-wrapper"
        router
        unique-opened
        :collapse="isCollapsed"
        :default-active="$route.path">
        <template v-for="(item, index) in sider_menu_data" >
          <el-menu-item class="menu-item" v-if="!item.children" :index="item.path" :key="index">
            <i :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
          <el-submenu v-else :index="item.path" :key="index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{item.title}}</span>
            </template>
            <el-menu-item class="menu-item" v-for="(sub_item, sub_index) in item.children" :index="sub_item.path"
                          :key="sub_index">
              <span slot="title" style="margin-left:12px;">{{sub_item.title}}</span>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </div>
    <div class="topbar-wrapper" :style="{left: this.isCollapsed?'64px':'200px'}" style="display:flex;">
      <div class="menu-collapse-wrapper float-left" @click="toggleMenu">
        <i class="el-icon-adm-menu" :style="{transform: 'rotateZ(' + (this.isCollapsed ? '90' : '0') + 'deg)'}"></i>
      </div>
      <div class="title float-left">自动化测试平台</div>

        <div class="interceptor">
        <el-radio-group v-model="interceptor" @change="changeInterceptor">
          <el-radio  label="6" border checked>fat1</el-radio>
          <el-radio  label="7" border checked>fat2</el-radio>
          <el-radio  label="8" border checked>fat3</el-radio>
          <el-radio  label="5" border checked>test5</el-radio>
        </el-radio-group>
      </div>


      <el-dropdown trigger="click">
      <span class="el-dropdown-link">
      <div class="avatar">
        <!-- <el-avatar :size="50" :src="circleUrl"></el-avatar> -->
      </div>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="openUserDatas">用户变量</el-dropdown-item>
        <el-dropdown-item @click.native="quitUser">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>



      <div class="select">
        <!-- <input type="text" placeholder="订单号"  ref="orderNo" v-model="order">
        <button @click="getViolationTrans" style="width:100px;">确定</button> -->
       
      </div>
      
    </div>
    <div class="content-wrapper" ref="content-wrapper" :style="{left: this.isCollapsed?'64px':'200px'}">
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
<!--  -->
    <el-dialog title="接口动态参数" :visible.sync="userDatasDialog" width="1300px" append-to-body :before-close="useDatasClose">
          <el-table
          ref="multipleTable"
          :data="userDatas"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column
            label="变量名"
            width="400">
            <template slot-scope="scope">
              <el-row class="demo-autocomplete">
              <el-col :span="102" >
                  <div  >
                    <el-input
                      class="inline-input"
                      v-model="scope.row.variableName"
                      placeholder="请输入变量名"
                    ></el-input>
                  </div>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="变量值"
            width="700">
            <template slot-scope="scope" >
                <el-col :span="502" style="display:flex;">
                  <el-select v-model="scope.row.typeOptions" placeholder="请选择" style="width:180px;">
                    <el-option
                      v-for="item in typeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <div style="width:100%;display:flex;">
                      <el-input
                      v-for="(valueVariable, keyVariable, indexVariable) in scope.row.variableValue"
                        :key="indexVariable"
                        class="inline-input"
                        v-model="scope.row.variableValue[keyVariable]"
                        placeholder="请输入变量值"
                      ></el-input>
                     
                    </div>
                </el-col>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="操作"
            width="100">
            <template slot-scope="scope" >
                <el-col :span="502" style="display:flex;">
                  <div style="width:100%;">
                      <i class="el-icon-plus" @click="plusDataProcedure(scope.$index)"></i>
                      <i class="el-icon-close" @click="closeDataProcedure(scope.$index)"></i>
                    </div>
                </el-col>
            </template>

          </el-table-column>
        </el-table>
      </el-dialog>

  </div>
</template>
<script>
  import {sessionStorage} from 'src/assets/js/storage';
  import GLOBAL from '../../utils/global_variable.js';
  export default {
    created() {
      this.checkAuth();
      GLOBAL.interceptor = this.$data.interceptor
      var userId = this.getCookie('userId');
      console.log(userId, "userId")
      if (userId == null && userId == ""){
        this.$router.push({name:'login'});
      }else{
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
        })
      }

    },
    mounted(){
      if(GLOBAL.userInfo === null){
          this.$router.push({name:'login'});
       }
      
    },
    data() {
      return {
        userDatasDialog: false,
        userDatas: [],
        interfaceProjectList: [],
        typeOptions:[
           {
            value: 'String',
            label: 'String数据'
          },
          {
            value: 'int',
            label: 'Int数据'
          },
          {
            value: 'dict',
            label: 'json数据'
          },
          {
            value: 'interface',
            label: '请求接口'
          }
        ],
        sider_menu_data: [
          
          {
            path: '/aotuTestTool',
            title: '自动化基础',
            icon: 'el-icon-adm-linechart',
            children: [
              {path: '/aotuTest/project', title: '项目管理'},
              {path: '/aotuTest/reportList', title: '测试报告'},
              {path: '/aotuTestTool/python', title: 'Python脚本'},
              {path: '/aotuTest/task', title: '定时任务'},
              // {path: '/aotuTestTool/templateParams', title: '参数模板管理'}
            ]
          },
          {
            path: '/aotuTest',
            title: '接口自动化',
            icon: 'el-icon-adm-linechart',
            children: [
              {path: '/aotuTest/interface', title: '接口信息'},
              {path: '/aotuTest/caseGather', title: '测试用例'},
              {path: '/aotuTest/interfaceHost', title: 'HOST配置'},
            ]
          },
          {
            path: '/testUtils',
            title: '测试工具',
            icon: 'el-icon-adm-linechart',
            children: [
              {path: '/testUtils/test', title: '测试常用工具'},
              {path: '/testUtils/orderEs', title: 'ES数据查看'},
              // {path: '/aotuTestTool/xmind', title: 'Xmind转用例'},
              // {path: '/aotuTestTool/permission', title: '管理后台导权限'}
            ]
          },
          // {
          //   path: '/Secondary',
          //   title: '二清文件工具',
          //   icon: 'el-icon-adm-linechart',
          //   children: [
          //     {path: '/Secondary/SecondaryFile', title: '二清文件工具'},
          //     {path: '/Secondary/secondaryInterface', title: '二清接口工具'},
          //   ]
          // },
          {
            path: '/aotuUITest',
            title: 'UI自动化',
            icon: 'el-icon-adm-linechart',
            children: [
              {path: '/aotuUITest/devices', title: '设备管理'},
              {path: '/aotuUITest/activitys', title: '页面管理'},
              {path: '/aotuUITest/config', title: '元素管理'},
              {path: '/aotuUITest/case', title: '用例管理'},
              {path: '/aotuUITest/suite', title: '套件管理'},
            ]
          },
          // {
          //   path: '/about',
          //   title: '关于',
          //   icon: 'el-icon-adm-linechart',
          // },
        ],
        isCollapsed: false,
        adminMenuShow: false,
        interceptor: '2'
      }
    },
    computed: {
      user() {
        return this.$store.state.user;
      }
    },
    
    methods: {
      quitUser() {
        this.setCookie("userId","",-1)
        this.$router.push({path: '/'});
      },
      changeInterceptor() {
        GLOBAL.interceptor = this.$data.interceptor
      },
      getViolationTrans() {
          var orderNo = this.$refs.orderNo.value
          if (orderNo === '' || orderNo === null) {
            return;
          }
          GLOBAL.orderNo = orderNo
      },
      handleCommand(command) {
        console.log(command);
      },
      toggleMenu() {
        this.isCollapsed = !this.isCollapsed;
      },
      checkAuth() {
        let token = this.$store.state.token || sessionStorage.getItem('token');
        if (!token) {
          this.$router.replace('/aotuTest/project');
        } else {
          // this.getUser();
        }
      },
    useDatasClose (done){
      this.$axios({
          url: '/alter/user/updateUser',
          method: 'POST',
          data: {
            userId: GLOBAL.userInfo.userId,
            useDatas: [this.$data.userDatas]
          },
          headers: {
              'Content-Type': 'application/json'
          }
      }).then(data => {
        var dataObj = data.data

        if (dataObj.status === 200) {
          // GLOBAL.userInfo.useDatas = dataObj.obj
          // this.$message({
          //     message: dataObj.message,
          //     type: 'success'
          // });
            GLOBAL.userInfo.useDatas = dataObj.obj
          done()
        }else{
          this.$message({
              message: "请求失败",
              type: 'warning'
          });
        }
      })
      
    },
      openUserDatas(){
        console.log(GLOBAL.userInfo)
        console.log(GLOBAL.userInfo.useDatas)
        this.$data.userDatas = JSON.parse(GLOBAL.userInfo.useDatas)
        this.$data.userDatasDialog = true
      },
      plusDataProcedure() {
        this.$data.userDatas.push({
              variableName: '',
              variableValue: [""],
              typeOptions: 'String'
          })
      },
      closeDataProcedure(rowIndex) {
        if (rowIndex === 0) {
          return;
        }
         this.$data.userDatas.splice(rowIndex, 1)
      },
    }
  }
</script>
<style >
    #input_xu {
      display: none;
  }
  .el-submenu__title {
      font-weight: bold;
      font-size: 15px;
    }
</style>
<style lang="scss" scoped>
  .interceptor{
    margin: 0px auto;
    text-align: center;    
  }
  .avatar{
    height: 52px;
  }
  .select{
      display: flex;
      position:absolute;
      right: 0;
      top: 0;
  }
  .select input{
      width: 200px;
  }

      
  @import '../../assets/styles/variable';
  
  .siderbar-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: $siderbarWidth;
    z-index: 11;
    background-color: $siderbarBackgroundColor;
    transition: all 0.3s ease-in-out;
    
    .logo-wrapper {
      height: 40px;
      line-height: 40px;
      padding: 16px 0;
      text-align: center;
      font-size: 24px;
      color: #FFFFFF;
    }
    
    .menu-wrapper {
      position: absolute;
      top: 72px;
      bottom: 0;
      width: 100%;
      border-right: none;
      transition: all 0.3s ease-in-out;
      
      
      &:not(.el-menu--collapse) {
        overflow-y: auto;
        overflow-x: hidden;
      }
      
      i {
        color: black;
        font-weight: bold;
      }
      
      .menu-item {
        
        &.is-active, &:hover {
          background-color:#e6f7ff !important;
          color:#1890ff !important;
          font-weight: bold;
          i {
            color: black !important;
          }
        }
        
      }
     
      .el-submenu__title:hover {
        color: black !important;
        font-weight: bold;
        i {
          color: black !important;
          font-weight: bold;
        }
      }
      
      .el-submenu, .el-menu-item {
        width: 100%;
      }
    }
  }
  
  .topbar-wrapper {
    position: fixed;
    left: $siderbarWidth;
    right: 0;
    top: 0;
    height: $topbarHeight;
    line-height: $topbarHeight;
    padding: 0 24px 0 0;
    background-color: $topbarBackgroundColor;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    transition: all 0.3s ease-in-out;
    z-index: 12;
    
    .menu-collapse-wrapper {
      height: 100%;
      width: 48px;
      text-align: center;
      cursor: pointer;
      
      i {
        transition: all 0.3s ease-in-out;
      }
    }
    
    .title {
      height: 100%;
      font-weight: bold;
    }
    
    .menu-list {
      .menu-item {
        position: relative;
        float: left;
        padding: 0 15px;
        min-width: 45px;
        height: 48px;
        text-align: center;
        font-size: 0px;
        
        &:hover {
          cursor: pointer;
          background-color: #F5F5F5;
        }
        
        .icon {
          vertical-align: middle;
          font-size: 24px;
        }
        
        .text {
          display: inline-block;
          vertical-align: middle;
          margin-left: 4px;
          font-size: 16px;
        }
      }
    }
  }

  .content-wrapper {
    position: fixed;
    left: $siderbarWidth;
    right: 0;
    top: $topbarHeight;
    bottom: 0;
    padding: 16px;
    overflow: auto;
    transition: all 0.3s ease-in-out;
    
    .content {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
</style>
