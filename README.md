# js-export-word 
一个html导出为word的js库   

## [example](https://huangbohang.github.io/export-word/examples)

## Install  
    npm install -D js-export-word

## Usage     
  
```javascript    

import exportWord from 'js-export-word'

const wrap = document.getElementById('test')
const config = {
      addStyle:true, // 是否导出样式，默认为true，此操作会将所有样式转换成行内样式导出
      fileName:'测试文件', // 导出文件名
      toImg:['.need-to-img','.bg-danger'], // 页面哪些部分需要转化成图片，例如echart图表之类
      success(){} // 完成之后回调，一般页面篇幅比较大，时间比较长
}
exportWord(wrap,config)  

```
   
