import Vue from 'vue';
import ExportJsonExcel from 'js-export-excel';

export const exportExcl = async (
  datList:object[],
  sheetData:[],
  sheetHeader:string[],
  columnWidths:number[],
  fileName:string,
  nullMsg?:string
) => {

  if (datList == undefined || sheetData == undefined || fileName == undefined || sheetHeader == undefined || columnWidths == undefined) {
    Vue.prototype.$message({
      message: '缺少必传参数！',
      type: 'error'
    });
    return ;
  }

  if (datList && datList.length == 0) {
    Vue.prototype.$message({
      message: nullMsg || '当前无数据可导出！',
      type: 'info'
    });
    return ;
  }

  Vue.prototype.$message({
    message:'正在生成文件...',
    iconClass:'el-icon-loading',
  });

  let option : any = {};
  option.fileName = fileName;
  option.datas=[
    {
      sheetData,
      sheetHeader,
      columnWidths,
      sheetName:'sheet'
    }
  ];

  const toExcel = new ExportJsonExcel(option);
  toExcel.saveExcel();
};

export const VideoSrc = 'https://www.runoob.com/try/demo_source/movie.mp4';

//校验非法字符，\ 无法校验
export const IllegalString = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/\?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");

export const showMessageAfterRequest = function (status:boolean, successText:string, errorText:string) {
  if (status){
    Vue.prototype.$message({
      type:'success',
      message:successText
    });
  }else {
    Vue.prototype.$message({
      type:'error',
      message:errorText
    });
  }
}

export const insertOptionsToFormItems = function (items:any, key:string, options:any) :object {

  items.forEach((item:any)=>{
    if (item.key === key){
      item.options = options;
    }
  })

  return items;
}

export const insertOptionsToSearchFormItems = function (searchFormItems:any, key:string, options:any) :any {
  let targetIndex = 0;
  let targetItem : any = {};

  searchFormItems.forEach((item:any, index:number)=>{
    if (item.key === key){
      targetIndex = index;
      targetItem = JSON.parse(JSON.stringify(item));
      targetItem.options = options;
    }
  })

  return {targetIndex, targetItem};
}

// 前端保存文件
export const downloadFileByBlob = (blobContent:Blob, filename:string) => {
  const blobUrl = window.URL.createObjectURL(blobContent);
  const eleLink = document.createElement('a')
  eleLink.download = filename
  eleLink.style.display = 'none'
  eleLink.href = blobUrl
  // 触发点击
  document.body.appendChild(eleLink)
  eleLink.click()
  // 然后移除
  document.body.removeChild(eleLink)
};