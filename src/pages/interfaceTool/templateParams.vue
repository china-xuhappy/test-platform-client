<template>
    <div class="utils">
        
        <el-button
            class="addBtn"
            type="primary "
            @click="addTemplate"
            size="small"
            style="margin-bottom:10px;"
            >添加模板</el-button>

        <el-input
        type="textarea"
        :autosize="{ minRows: 5}"
        placeholder="请输入内容"
        v-model="templateParams"
        ></el-input>
    </div>
</template>

<script>
export default {
  data() {
      return {
        templateParams: ''
      }
  },
  methods: {
     addTemplate(){
         this.$axios({
                url: '/alter/interface/addTemplate',
                method: 'POST',
                data: {
                  templateParams: JSON.parse(this.$data.templateParams),
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(data => {
                
            })
     }
  }
}
</script>