<template>
  <div class="gitUtils">
     <el-table
        ref="multipleTable"
        :data="projectsDates"
        tooltip-effect="dark"
        style="width: 100%"
        >
        <el-table-column v-for="(col,index) in projectsCols" :label="col.label" width="150" :key="index">
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
      </el-table>
    
  </div>
</template>

<script>
import GLOBAL from '../../utils/global_variable.js';
export default {
 data() {
      return {
        projectsDates: [],
        projectsCols: []
      }
  },
  mounted(){
    this.$axios.get(
                '/alter/common/getGitLabProjects'
            ).then(data => {
                var dataObj = data.data.obj
                 if (data.data.status === 200) {
                    this.$data.projectsDates = dataObj.projectsDates
                    this.$data.projectsCols = dataObj.projectsCols
                }
            })
  },
  methods: {
     
  }
}
</script>

<style scoped>
.file{
    width: 500px;
    margin: 50px auto;
    font-size: 20px;
    color: red;
    text-align: center;
}
*{
    white-space: pre-line;
}
</style>
