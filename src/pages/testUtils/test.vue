<template>
  <div class="test">
      <el-tabs v-model="testActiveName" type="card" @tab-click="testHandleClick" class="nav-style" stretch >
        <el-tab-pane name="member" style="display:flex;">
            <span slot="label" class="fontClass">会员工具</span>
            <div style="display:flex;">
                <div class="util-view">
                    <div class="order-status-view">
                        <el-form ref="form" :model="member"  style="display:flex;flex-wrap: wrap;align-items: center;justify-content: center;" >
                            <div class="title">凹凸会员</div>
                            <el-form-item style="display:flex;">
                                <div style="display:flex;">
                                    <el-select v-model="member.type" placeholder="请选择类型" style="width:200px;" @change="codeChange">
                                        <el-option label="注册" value="register"></el-option>
                                        <el-option label="认证" value="auth"></el-option>
                                        <el-option label="设置验证码" value="code"></el-option>
                                        <el-option label="短信白名单" value="sms"></el-option>
                                        <el-option label="获取token" value="token"></el-option>
                                    </el-select>
                                    <el-input v-model="member.phone" placeholder="手机号"></el-input>
                                </div>
                            </el-form-item>
                            
                            <div style="margin-bottom:20px;height:40px;">
                                {{member.tips}}
                            </div>
                            <el-form-item>
                                
                                <el-button type="primary" @click="onMemberSubmit" style="width:100px;">确定</el-button>
                                <el-button type="primary" @click="onMemberDelete" v-show="onDeleteShow" style="width:100px;">删除</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="util-view">
                    <div class="order-status-view">
                        <el-form ref="form" :model="memberToken"  style="display:flex;flex-wrap: wrap;align-items: center;justify-content: center;" >
                            <div class="title">通过token获取信息</div>
                            <el-form-item style="display:flex;">
                                <div style="display:flex;">
                                    <el-select v-model="memberToken.type" placeholder="请选择类型" style="width:200px;" @change="codeChange1">
                                        <el-option label="C端" value="c_app"></el-option>
                                        <el-option label="管理后台" value="c_console"></el-option>
                                    </el-select>
                                    <el-input v-model="memberToken.token" placeholder="Token"></el-input>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onTokenSubmit" style="width:100px;">确定</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

                <div class="util-view">
                    <div class="order-status-view">
                        <el-form ref="form" :model="memberToken"  style="display:flex;flex-wrap: wrap;align-items: center;justify-content: center;" >
                            <div class="title">钱包凹凸币</div>
                            <el-form-item style="display:flex;">
                                <el-input v-model="walletInfo.memNo" placeholder="会员号"></el-input>
                                <div style="display:flex;">
                                    <el-select v-model="walletInfo.type" placeholder="请选择类型" style="width:200px;" @change="codeChange1">
                                        <el-option label="钱包" value="wallet"></el-option>
                                        <el-option label="凹凸币" value="icon"></el-option>
                                    </el-select>
                                    <el-input v-model="walletInfo.num" placeholder="num"></el-input>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onTokenSubmit" style="width:100px;">确定</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </el-tab-pane>
        <el-tab-pane label="订单工具" name="order">
            <div style="display:flex;">
                 <!-- 订单流转 -->
                <div class="util-view">
                    <div class="order-status-view">
                        <el-form ref="form" :model="form" label-width="70px" >
                            <div class="title">订单状态流转</div>
                            <el-form-item label="订单号">
                                <el-input v-model="form.orderNo"></el-input>
                            </el-form-item>
                            <el-form-item label="流转状态">
                                <el-select v-model="form.status" placeholder="请选择流转状态" @change="statusChange">
                                    <el-option label="车主接单(1->4)" value="4"></el-option>
                                    <el-option label="待取车(4-16)" value="16"></el-option>
                                    <el-option label="待还车(16-32)" value="32"></el-option>
                                    <el-option label="待结算(32-64)" value="64"></el-option>
                                    <el-option label="租车押金结算(64-128)" value="128"></el-option>
                                    <el-option label="违章押金结算(128-256)" value="256"></el-option>
                                </el-select>
                            </el-form-item>

                            <div v-show="weiZhangShow">
                                <el-form-item label="违章状态">
                                    <el-select v-model="form.wzStatus" placeholder="请选择违章状态" @change="wzStatusChange">
                                        <el-option label="无违章" value="1"></el-option>
                                        <el-option label="有违章" value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>

                            <el-form-item label="违章金额" v-show="weiAmtShow">
                                <el-input v-model="form.wzAmt"></el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" @click="onSubmit" style="width:100px;">确定</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

                <div class="util-view">
                    <div class="order-status-view">
                        <el-form ref="from" :model="createOrderFrom" label-width="70px" >
                            <div class="title">一键生成订单</div>
                            <el-form-item label="会员号：">
                                <el-input v-model="createOrderFrom.memNo"></el-input>
                            </el-form-item>
                            <el-form-item label="车牌号：">
                                <el-input v-model="createOrderFrom.carNo"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-radio-group v-model="createOrderFrom.orderCategory">
                                    <el-radio :label="1">短租</el-radio>
                                    <el-radio :label="3">长租</el-radio>
                                    <!-- <el-radio :label="4">代步车</el-radio>
                                    <el-radio :label="2">OTA</el-radio> -->
                                </el-radio-group>
                             </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="createOrder" style="width:100px;">确定</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>

        </el-tab-pane>
        <el-tab-pane label="车辆工具" name="car">
            <div class="util-view">
                <div class="order-status-view">
                    <el-form ref="form" :model="form" label-width="70px" >
                        <div class="title">清除库存</div>
                        <el-form-item label="车辆号: ">
                            <el-input v-model="car.carNo" placeholder="车辆号, 不是车牌号"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="clearCarInventory" style="width:100px;">确定</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-tab-pane>
        <el-tab-pane label="其他工具" name="rest">其他工具</el-tab-pane>
    </el-tabs>

    <el-drawer
    title="内容"
    :visible.sync="JsonResultDataSync"
    :with-header="false"
    :append-to-body="true">
    <span>
        <json-viewer
            :value="JsonResultData"
            :expand-depth=10
            copyable
            sort>
        </json-viewer>
    </span>
    </el-drawer>

    
  </div>

</template>

<script>
import GLOBAL from '../../utils/global_variable.js';
var deleteType = 0
// 0删除 短信白名单
export default {
 data() {
      return {
          testActiveName: "member",
          weiZhangShow: false,
          weiAmtShow:false,
          codeShow: false,
          onDeleteShow: false,
          JsonResultDataSync: false,
          JsonResultData: {},
          createOrderFrom:{
             orderCategory: 1,
             memNo: null,
             carNo: null
          },
          member:{
              type: "register",
              phone: "",
              code: "",
              tips: " "
          },
          memberToken:{
              type: "c_app",
              token: ""
          },
          walletInfo:{
              type: "wallet",
              num: 0,
              memNo: ""
          },
          form:{
              orderNo: "",
              status: "",
              wzStatus: "",
              wzAmt: ""
          },
          car:{
            carNo: ""
          }
      }
  },
  mounted(){

  },
  methods: {
      onMemberDelete(){
         if(deleteType === 0){
            this.operateSmsWhitet("2")
         }
      },
       testHandleClick(tab, event) {
        console.log(tab, event);
      },
      onMemberSubmit: function(e){
          var mobile = this.$data.member.phone
          var type = this.$data.member.type
          var code = this.$data.member.code
          if(type === "register"){
            this.$axios.get(
                '/api/member/createmember',
                {
                    params: {
                        environment:  GLOBAL.interceptor,
                        mobile : mobile
                    }
                }
            ).then(data => {
                var dataObj = data.data
                var status = dataObj.status
                if(status === 0){
                    this.$message({
                        message: dataObj.data,
                        type: 'success'
                    });
                }else{
                     this.$message({
                        message: dataObj.data,
                        type: 'warning'
                    });
                }
            })
          }else if(type === "auth"){
                this.$axios.get(
                        '/api/member/updateinfo',
                        {
                        params: {
                            environment:  GLOBAL.interceptor,
                            mobile : mobile
                        }
                    }
                ).then(data => {
                    var dataObj = data.data
                    var status = dataObj.status
                    if(status === 0){
                        this.$message({
                            message: dataObj.data,
                            type: 'success'
                        });
                    }else{
                        this.$message({
                            message: dataObj.data,
                            type: 'warning'
                        });
                    }
                })
          }else if(type === "code"){
            this.$axios.get(
                    '/api/other/setlogincode',
                    {
                    params: {
                        environment:  GLOBAL.interceptor,
                        mobile : mobile, 
                        code: code
                    }
                }
            ).then(data => {
                var dataObj = data.data
                var status = dataObj.status
                if(status === 0){
                    this.$message({
                        message: dataObj.data,
                        type: 'success'
                    });
                }else{
                    this.$message({
                        message: dataObj.data,
                        type: 'warning'
                    });
                }
            })
          }else if(type === "sms"){
            this.operateSmsWhitet("1")
          }else if(type === "token"){
            this.$axios.get(
                    '/api/utils/getTokenByMobile',
                    {
                    params: {
                        environment:  GLOBAL.interceptor,
                        mobile : this.$data.member.phone
                    }
                }
            ).then(data => {
                console.log(data)
                this.$data.member.tips = data.data.msg
            })
          }
      },
      createOrder: function(){
         this.$axios.post('/alter/common/createOrder',
            {
                'args': {
                    carNo: this.$data.createOrderFrom.carNo,
                    memNo: this.$data.createOrderFrom.memNo,
                    orderCategory: this.$data.createOrderFrom.orderCategory
                },
                "environment": GLOBAL.interceptor
            }).then((data) => {
                this.$data.JsonResultDataSync = true
                this.$data.JsonResultData = data.data
            }
        )
      },
     onSubmit:function(){
         var orderNo = this.$data.form.orderNo
         var status = this.$data.form.status
         var wzStatus = this.$data.form.wzStatus
         var wzAmt = this.$data.form.wzAmt
         this.$axios.post('/api/newOrder/updateOrderStatus',
            {
                 'orderNo': orderNo,
                 "stepFlag": status,
                 "WzStatus": wzStatus,
                 "wzAmt":wzAmt,
                 "environment": "test_"+GLOBAL.interceptor
             }).then((data) => {
                    var dataObj = data.data
                    var status = dataObj.status
                    if(status === 0){
                        this.$message({
                            message: dataObj.data,
                            type: 'success'
                        });
                    }else{
                        this.$message({
                            message: dataObj.data,
                            type: 'warning'
                        });
                    }
              }
          )
     },
     codeChange: function(e){
        this.$data.member.tips = ""
     },
     statusChange: function(e){
         console.log(e)
         if(e === 256 || e === "256"){
             this.$data.weiZhangShow = true
         }else{
             this.$data.weiZhangShow = false
             this.$data.weiAmtShow = false
              this.$data.form.wzAmt = "0"
         }
     },
     wzStatusChange: function(e){
         console.log(e)
         if(e === 2 || e === "2"){
             this.$data.weiAmtShow = true
         }else{
              this.$data.weiAmtShow = false
              this.$data.form.wzAmt = "0"
         }
     },
    //  toast提示
     warnMessage:function(message){
        this.$message({
            message:message,
            center:true,
            type:"success"
        })
     },
    //  清除库存
    clearCarInventory: function(e){
        var carNo = this.$data.car.carNo
        const loading = this.$loading({
          lock: true,
          text: '请求中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        if  (carNo == null || carNo == ""){
            this.warnMessage("车辆号不能为空")
        }
        else{
            var carNo = this.$data.car.carNo
            this.$axios.post(
                '/alter/common/clearCarInventory',
                {
                    carNo: carNo,
                    environment: GLOBAL.interceptor
                }
            ).then(data => {
                loading.close();
                this.warnMessage(data.data.obj)
            })
            loading.close();
        }
    },
    operateSmsWhitet: function(type){
        this.$axios.post(
                '/api/utils/operateSmsWhitet',
                {
                environment:  GLOBAL.interceptor,mobile : this.$data.member.phone, type: type
            }
        ).then(data => {
            var dataObj = data.data
            console.log(data)
            var obj = dataObj.obj
            if(obj === 1){
                // 已经存在
                this.$message({
                    message: "已经存在",
                    type: 'error'
                });
                this.$data.onDeleteShow = true;
                deleteType = 0
            }else if(obj === 0){
                this.$message({
                    message: "新增成功",
                    type: 'success'
                });
                this.$data.onDeleteShow = false;
            }else if(obj === 2){
                this.$message({
                    message: "删除成功",
                    type: 'success'
                });
                this.$data.onDeleteShow = false;
            }
        })
    },
    onTokenSubmit: function(e){
        var token = this.$data.memberToken.token
        var type = this.$data.memberToken.type
        if(type === "c_app"){
            this.$axios.get(
                    '/api/utils/getMemBaseInfoByToken',
                    {
                    params: {
                        environment: GLOBAL.interceptor,
                        token: token
                    }
                }
            ).then(data => {
                console.log(data)
                this.$data.JsonResultDataSync = true
                this.$data.JsonResultData = data.data.obj
            })
        }
    }
  }
}
</script>

<style scoped>
.fontClass{
    font-size: 16px;
    /* font-weight: bold; */
}
.nav-style{
    background: white;
    width: 100%;
}
.test{
    display: flex;
    background: white;
    height: 780px;
}
.util-view{
    width: 400px;
    height: 400px;
    transition:all linear .2s;
    margin-top: 20px;
    cursor:pointer;
    box-shadow: 0 0 15px 0 #ccc;
    transform: translateY(-4px);
    background: white;
    margin-left: 10px;
    border-radius: 10px;
}
.title{
    text-align: center;
    font-size: 20px;
    color: red;
    margin-bottom: 20px;
}
.order-status-view{
   width: 320px;
    height: 400px;
    margin: auto;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
}
/* .order-status-view:hover{
    transform: translateY(-4px);
    box-shadow: 0 0 15px 0 #ccc;

} */
</style>
