<template>
    <div class="interfaceHost">
        
        <div style="margin:auto;display:flex;">
            <el-form label-width="200px" :model="queryTrade" style="width:500px;">
                <el-form-item label="会员号">
                    <el-input v-model="queryTrade.memNo"></el-input>
                </el-form-item>
                <el-form-item label="记账簿">
                    <el-input v-model="queryTrade.virAcctNo"></el-input>
                </el-form-item>
                <el-form-item label="开始日期(yyyyMMdd)">
                    <el-input v-model="queryTrade.beginDate"></el-input>
                </el-form-item>
                <el-form-item label="结束日期(yyyyMMdd)">
                    <el-input v-model="queryTrade.endDate"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getQueryTrade">查询</el-button>
                </el-form-item>
            </el-form>


            <div class="report_describe">
                <div class="describe">
                    <ul>
                        <li><p class="describe_title">|记账簿|:</p><p class="describe_content">{{queryTradeObj.virAcctNo}}</p></li>
                        <li><p class="describe_title">|明细总笔数|: </p><p class="describe_content">{{queryTradeObj.totalNum}}</p></li>
                        <li><p class="describe_title">|币种代码|: </p><p class="describe_content">{{queryTradeObj.currency}}</p></li>
                        <li><p class="describe_title">|借方总金额|: </p><p class="describe_content" style="color:red">{{queryTradeObj.debitTotalAmt}}</p></li>
                        <li><p class="describe_title">|借方总笔数|: </p><p class="describe_content" style="color:red">{{queryTradeObj.debitTotalNum}}</p></li>
                        <li><p class="describe_title">|贷方总金额|: </p><p class="describe_content" style="color:red">{{queryTradeObj.creditTotalAmt}}</p></li>
                        <li><p class="describe_title">|贷方总笔数|: </p><p class="describe_content" style="color:red">{{queryTradeObj.creditTotalNum}}</p></li>
                    </ul>
                </div>
            </div>    
        </div>


        <el-table
        ref="multipleTable"
        :data="queryTrades"
        tooltip-effect="dark"
        style="width: 100%"
        @header-click="headerChange"
        >
        <el-table-column v-for="(col,index) in queryTradeCols" :label="col.label" width="150" :key="index">
            <template slot-scope="scope">
                <el-row class="demo-autocomplete">
                    <el-col :span="102" >
                    <div  >
                        <p>{{scope.row[col.value]}}</p>
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
          queryTrades: [],
          queryTradeCols: [],
          queryTradeObj: {},
          queryTrade: {
              memNo:"751661812",
              beginDate:"20200720",
              endDate:"20200830",
              virAcctNo:"510010545820000007"
          }
      }
  },
   mounted(){

  },
  methods: {
      headerChange(e){
        console.log(e.label)
    },
    getQueryTrade(){
        this.$data.queryTrades = []
        this.$axios.get(
            '/alter/common/queryTrade/',
            {
                params: {
                    memNo: this.$data.queryTrade.memNo,
                    virAcctNo: this.$data.queryTrade.virAcctNo,
                    beginDate: this.$data.queryTrade.beginDate,
                    endDate: this.$data.queryTrade.endDate
                }
            }
        ).then(data => {
            var dataObj = data.data.obj
            var queryTrade = dataObj.queryTrade.data
            this.$data.queryTrades = queryTrade.virAccTranDetailQryRecList
            this.$data.queryTradeCols = dataObj.queryTradeCols
            this.$data.queryTradeObj = queryTrade
        })
    },
  }
}
</script>
<style scoped>

.el-form--inline .el-form-item{
  width: 760px;
  display:flex;
  flex-flow: column;
  font-weight: bold;
}
.describe_content{
  color: rgb(118,138,167);
  font-size: 17px;
}
.el-form--inline .el-form-item{
  width: 760px;
  display:flex;
  flex-flow: column;
  font-weight: bold;
}
.describe_title{
  font-weight: bold;
  color: rgb(118,138,167);
  font-size: 20px;
  margin-right: 10px;
}
.describe li{
  display: flex;
  padding: 10px;
  line-height: 25px;
  float: left;
  margin-right: 20px;
}
.report_describe{
  display: flex;
  width: 50%;
  margin: auto;
  justify-content:center;
}
</style>