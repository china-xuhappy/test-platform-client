<template>
    <div class="python">
      <el-form :inline="true"  class="demo-form-inline search-style" size="small">
            <el-form-item label="函数文件"  labelWidth="80px">
                <el-autocomplete
                        style="margin-right: 2px"
                        class="inline-input"
                        v-model="comparator"
                        :fetch-suggestions="querySearch"
                        placeholder="输入或选择文件"
                        size="small"
                        @select= "changeFile">
                </el-autocomplete >
                <el-button-group>
                    <!-- <el-button type="success" @click.native="findFunc()" size="small">读取</el-button> -->
                    <el-button type="primary" @click.native="createFunc()" size="small">创建</el-button>
                    <el-button type="danger" @click.native="removeFunc()" size="small">删除</el-button>
                </el-button-group>
            </el-form-item>

            <el-form-item label="函数名" labelWidth="80px" >
                <el-input v-model="funcName" placeholder="输入格式：${func(param)}" size="small" style="width:200px;">
                </el-input>
                <!--</el-form-item>-->
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.native="checkFunc()" size="small">调试</el-button>
            </el-form-item>
            <el-form-item>
            <el-button-group>
                <!--<el-tooltip content="检查语法" placement="top-start">-->
                <!--<el-button type="primary" icon="el-icon-view" @click.native="checkFunc()" size="small"></el-button>-->
                <!--</el-tooltip>-->
                <el-tooltip content="刷新文档" placement="top-start">
                    <el-button type="info"
                               icon="el-icon-refresh"
                               @click.native="findFunc()"
                               size="small">
                    </el-button>
                </el-tooltip>
                <el-tooltip content="保存文档" placement="top-start">
                    <el-button type="success" icon="el-icon-document"
                               @click.native="saveFunc()"
                               size="small">

                    </el-button>
                </el-tooltip>
            </el-button-group>
            </el-form-item>
        </el-form>
        <el-row>
            <el-col :span="16">
                <el-container>
                    <editor
                            style="font-size: 15px;background:#fff;"
                            v-model="funcData"
                            @init="editorInit"
                            lang="python"
                            theme="chrome"
                            width="100%"
                            height="790px"
                            :options="{
                                 enableSnippets:true,
                                 enableBasicAutocompletion: true,
                                 enableLiveAutocompletion: true
                             }"
                    >
                    </editor>
                </el-container>
                <!--<codemirror v-model="funcData"-->
                <!--:options="options"-->
                <!--height="810px">-->
                <!--</codemirror>-->
            </el-col>
            <el-col :span="8" style="padding-left:10px;background-color: rgb(234, 234, 234);height:790px ">
                <div style="font-weight: 700;color: gray;font-size:14px;margin-top: 2px;">
                    测试结果：
                </div>
                <pre style="white-space: pre-wrap;word-wrap: break-word;padding-left:10px;">{{this.result}}
                </pre>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
  components: {
            editor: require('vue2-ace-editor'),
        },
  data() {
      return {
        funcName: '',
        result: '',
        funcData: '',
        comparator: '',
        comparators: [],
      }
  },
  methods: {
      editorInit() {
          require('brace/ext/language_tools');
          require('brace/mode/python');
          require('brace/theme/chrome');
          require('brace/snippets/python');
      },
      querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
          cb(this.comparators);
      },
      findFunc() {
          this.$axios.post("/alter/func/find", {'funcName': this.comparator}).then((data) => {
                  this.messageShow(this, data);
                  var dataObj = data.data
                  this.funcData = dataObj.obj
              }
          )
      },
      createFunc() {
          this.$axios.post('/alter/func/create', {'funcName': this.comparator}).then((data) => {
                  if(this.messageShow(this, data)){
                      this.getFuncAddress()
                  }
              }
          )
      },
      removeFunc() {
          this.$axios.post('/alter/func/remove', {'funcName': this.comparator}).then((data) => {
                  this.comparator = '';
                  this.messageShow(this, data);
                  this.getFuncAddress()
              }
          )
      },
      getFuncAddress() {
          this.$axios.get('/alter/func/getPythonFiles',{}
          ).then(data => {
              var dataObj = data.data
              this.comparators = dataObj.obj
              this.comparator = dataObj.obj[0].value
              this.findFunc()
          })
      },
      checkFunc() {
          if (!this.comparator) {
              this.$message({
                  showClose: true,
                  message: '请先选择函数文件',
                  type: 'warning',
              });
              return
          }
          if (!this.funcName) {
              this.$message({
                  showClose: true,
                  message: '函数名不能为空',
                  type: 'warning',
              });
              return
          }
          if (!this.funcData) {
              this.$message({
                  showClose: true,
                  message: '请点击文件读取后再调试',
                  type: 'warning',
              });
              return
          }
          this.$axios.post('/alter/func/save', {
              'funcData': this.funcData,
              'funcName': this.comparator
          }).then(() => {
                  this.$axios.post('/alter/func/check', {
                      'funcFileName': this.comparator,
                      'funcName': this.funcName,
                  }).then((data) => {
                          this.messageShow(this, data);
                          var dataObj = data.data
                          this.result = dataObj.obj
                      }
                  )
              }
          )
      },
      changeFile(e){
        this.$axios.post("/alter/func/find", {'funcName': e.value}).then((data) => {
                  this.messageShow(this, data);
                  var dataObj = data.data
                  this.funcData = dataObj.obj
              }
          )
      },
      saveFunc() {
          if (!this.funcData) {
              this.$message({
                  showClose: true,
                  message: '文件为空，请输入内容后再保存',
                  type: 'warning',
              });
              return
          }
          this.$axios.post('/alter/func/save', {
              'funcData': this.funcData,
              'funcName': this.comparator
          }).then((data) => {
                  this.messageShow(this, data);
              }
          )
      },
    },
  mounted() {
      this.getFuncAddress()
  },
}
</script>