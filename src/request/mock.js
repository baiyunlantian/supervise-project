import Mock from "mockjs";
const Random = Mock.Random;

//首页--流量统计
Mock.mock('/mock/index/flowCensus',(res,req)=>{
  return {
    data:{
      onLine:Random.integer(10,99),
      mission:Random.integer(10,99),
      totalFlow:Random.integer(10,200),
      todayFlow:Random.integer(10,200),
    }
  }
});

//首页--流量统计
Mock.mock('/mock/camera/cameraStreamControl',(res,req)=>{
  return {
    data:{
      pullAddress:'https://122b09cc657a4d0ba64dd7a46e4c682f.apigw.cn-south-1.huaweicloud.com/live/work013?app=vis&stream=dasdas',
      encodedString:'123456789',
      notify:true,
      visToken:'1234567'
    }
  }
});

//项目详情--人员管理--左侧部门列表
Mock.mock('/mock/index/terminalTree',(res,req)=>{

  let list = [];

  for (let i = 0; i < 6; i++){
    list.push({
      id:Random.integer(1,99999),
      name:Random.csentence(2,4),
      personCount:Random.integer(10,20),
    });
  }

  return {
    data:{
      list,
    }
  }
});

//首页--终端盒子列表
Mock.mock('/mock/index/terminalChildTree',(res,req)=>{
  const body = JSON.parse(res.body);

  let list = [];

  for (let i = 0; i < 6; i++){
    list.push({
      parentId: body.id,
      id:Random.integer(1,99999),
      name:Random.csentence(2,4),
      type:Random.integer(0,1),
      personCount:Random.integer(0,20),
    });
  }

  return {
    data:{
      list,
    }
  }
});

//人员管理--左侧部门列表
Mock.mock('/mock/depart/departSelectList',(res,req)=>{
  const body = JSON.parse(res.body);

  let departList = [];
  let personList = [];

  for (let i = 0; i < 3; i++){
    departList.push({
      departId:String(Random.integer(1,99999999)),
      departName:Random.csentence(2,4),
      num:Random.integer(0,20),
      fatherId:body.fatherId,
    });

    personList.push({
      personId:String(Random.integer(1,99999999)),
      personName:Random.csentence(2,4),
    });
  }

  return {
    data:{
      departList,
      personList,
    }
  }
});

//人员管理--添加部门
Mock.mock('/mock/depart/departAdd',(res,req)=>{
  const body = JSON.parse(res.body);

  return {
    data:body.fatherId ? true : false
  }
});

//人员管理--更新部门
Mock.mock('/mock/depart/departUpdate',(res,req)=>{
  const body = JSON.parse(res.body);

  return {
    data:body.departId ? true : false
  }
});

//人员管理--删除部门
Mock.mock('/mock/depart/departDelete',(res,req)=>{
  const body = JSON.parse(res.body);

  return {
    data:body.departId ? true : false
  }
});

//人员管理--岗位列表
Mock.mock('/mock/depart/stationSelect',(res,req)=>{
  let list = [];

  for (let i = 0; i < 4; i++){
    list.push({
      stationId:String(Random.integer(1,99999)),
      stationName:Random.csentence(2,4),
    })
  }
  return {
    data:{
      list
    }
  }
});

//人员管理--添加岗位
Mock.mock('/mock/depart/stationAdd',(res,req)=>{
  const body = JSON.parse(res.body);

  return {
    data:body.stationName ? true : false
  }
});

//人员管理--更新岗位
Mock.mock('/mock/depart/stationUpdate',(res,req)=>{
  const body = JSON.parse(res.body);
  console.log('update',body);

  return {
    data:true
  }
});

//人员管理--删除岗位
Mock.mock('/mock/depart/stationDelete',(res,req)=>{
  const body = JSON.parse(res.body);
  console.log('delete',body);

  return {
    data:true
  }
});

//人员管理--人员列表
Mock.mock('/mock/person/personSelectList',(res,req)=>{
  const body = JSON.parse(res.body);

  let list = [];

  for (let i = 0; i < body.pageSize; i++){
    list.push({
      personId:Random.integer(1,99999),
      name:Random.csentence(2,4),
      sex:Random.integer(0,1),
      ipNum:'15786324684631851',
      phone:'15800158000',
      station:Random.integer(1,20),
      code:Random.integer(1,99),
      remark:Random.csentence(3,4),
      departId:Random.integer(0,5),
      certificateList:[
        {
          date:Random.date('yyyy-MM'),
          name:Random.csentence(3,4),
          cerId:Random.integer(1,99999),
        },
        {
          date:Random.date('yyyy-MM'),
          name:Random.csentence(3,4),
          cerId:Random.integer(1,99999),
        },
        {
          date:Random.date('yyyy-MM'),
          name:Random.csentence(3,4),
          cerId:Random.integer(1,99999),
        }
      ],
    });
  }

  return {
    data:{
      list,
      page:{
        total:list.length * 10,
        pageSize:body.pageSize,
        pageNum:body.pageNum
      },
    }
  }
});

//人员管理--添加人员
Mock.mock('/mock/person/personAdd',(res,req)=>{

  return {
    data:true
  }
});

//人员管理--更新人员
Mock.mock('/mock/person/personUpdate',(res,req)=>{

  return {
    data:true
  }
});

//人员管理--删除人员
Mock.mock('/mock/person/personDelete',(res,req)=>{
  const body = JSON.parse(res.body);

  return {
    data:body.personIds ? true : false
  }
});


//排班管理--任务管理列表
Mock.mock('/mock/arrange/arrangeSelectList',(res,req)=>{
  const body = JSON.parse(res.body);

  let list = [];

  for (let i = 0; i < body.pageSize; i++){
    let personList = [];
    for (let j = 0; j < Random.integer(2,10); j++){
      personList.push({type:j === 0 ? 0 : 1, url:''});
    }

    list.push({
      personId:Random.integer(1,99999),
      arrangeId:Random.integer(1,99999),
      arrangeName:Random.csentence(2,4),
      boxId:Random.integer(2,40000),
      boxStatus:Random.integer(1,3),
      arrangeStatus:Random.integer(1,3),
      reporterStatus:Random.integer(0,1),
      time:`${Random.date('yyyy.MM.dd')}-${Random.date('yyyy.MM.dd')}`,
      personList,
    });

  }

  return {
    data:{
      list,
      page:{
        total:list.length * 10,
        pageSize:body.pageSize,
        pageNum:body.pageNum
      },
    }
  }
});

//排班管理--更新排班
Mock.mock('/mock/arrange/arrangeUpdate',(res,req)=>{
  const body = JSON.parse(res.body);

  return {
    data:body.arrangeId ? true : false
  }
});

//排班管理--新增排班
Mock.mock('/mock/arrange/arrangeAdd',(res,req)=>{
  const body = JSON.parse(res.body);

  return {
    data:body ? true : false
  }
});

//排班管理--删除排班
Mock.mock('/mock/arrange/arrangeDelete',(res,req)=>{
  const body = JSON.parse(res.body);

  return {
    data:body.arrangeIds ? true : false
  }
});

//排班管理--任务详情
Mock.mock('/mock/arrange/arrangeDetail',(res,req)=>{
  const body = JSON.parse(res.body);
  let result;

  if (body.arrangeId){
    result = {
      dutyStartTime:'2020-12-28',
      dutyEndTime:'2021-1-23',
      personList:[1,2,3],
      boxId:Random.integer(1,4),
      arrangeName:Random.csentence(3,5),
      detail:Random.csentence(3,5),
      dutyPersonId:Random.integer(1,5),
      boxStatus:Random.integer(1,4),
      arrangeStatus:Random.integer(1,3),
      useTime:Random.date(),
      returnTime:Random.date(),
    };
  }else {
    result = false;
  }

  return {
    data:result
  }
});

//排班管理--任务详情--施工监督报告列表
Mock.mock('/mock/arrange/arrangeReportSelect',(res,req)=>{
  const body = JSON.parse(res.body);

  let list = [];

  for (let i = 0; i < body.pageSize; i++){
    list.push({
      arrangeId:Random.integer(1,99999),
      code:Random.integer(10000,99999),
      startTime:Random.time('HH:mm:ss'),
      endTime:Random.time('HH:mm:ss'),
      num:Random.integer(10,50),
      buildTime:`${Random.date('yyyy.MM.dd')}`,
    });

  }

  return {
    data:{
      list,
      page:{
        total:list.length * 10,
        pageSize:body.pageSize,
        pageNum:body.pageNum
      },
    }
  }
});

//设备管理--设备统计
Mock.mock('/mock/equipment-management/census',(res,req)=>{

  return {
    data:{
      onLine:Random.integer(1,10),
      offLine:Random.integer(1,10),
      error:Random.integer(1,10),
      stop:Random.integer(1,10),
    }
  }
});

//设备管理--更新设备
Mock.mock('/mock/equipment/updateEquipment',(res,req)=>{
  const body = JSON.parse(res.body);

  return {
    data:body ? true : false
  }
});

//设备管理--删除设备
Mock.mock('/mock/equipment/deleteEquipment',(res,req)=>{
  const body = JSON.parse(res.body);

  return {
    data:body.id ? true : false
  }
});

//设备管理--设备列表
Mock.mock('/mock/equipment/selectList',(res,req)=>{

  let list = [];

  for (let i = 0; i < 1; i++){
    list.push({
      id:Random.integer(1,99999),
      name:Random.csentence(3,5),
      ip:'127.0.0.1',
      port:Random.integer(50,200),
      account:'admin',
      password:'123456',
      status:Random.integer(0,3),
      remark:Random.csentence(3,5),
    });

  }

  return {
    data:{
      list,
    }
  }
});

//设备管理--盒子列表
Mock.mock('/mock/edgebox/boxList',(res,req)=>{

  let list = [];

  for (let i = 0; i < 3; i++){
    list.push({
      boxId:Random.integer(1,3),
      name:'盒子'+Random.integer(1,1000),
      ip:'127.0.0.1',
      port:Random.integer(50,200),
      account:'admin',
      password:'123456',
      status:Random.integer(0,3),
      remark:Random.csentence(3,5),
    })
  }

  return {
    data:{
      list,
    }
  }

});

//设备管理--视频是否同步到云端
Mock.mock('/mock/edgebox/updateReportVideoConfig',(res,req)=>{
  const body = JSON.parse(res.body);

  return {
    data:body.hasOwnProperty('isPushCloudStream') === true ? true : false
  }
});

//设备管理--视频同步到云端状态
Mock.mock('/mock/edgebox/reportVideoConfig',(res,req)=>{

  return {
    data:{
      isPushCloudStream:1
    }
  }
});


//设备管理--摄像头列表
Mock.mock('/mock/camera/cameraList',(res,req)=>{
  let list = [];

  for (let i = 0; i < 3; i++){
    list.push({
      cameraId:Random.integer(1,3),
      name:'摄像头'+Random.integer(1,1000),
      ip:'127.0.0.1',
      port:Random.integer(50,200),
      account:'admin',
      password:'123456',
      enable:Random.integer(0,1),
      remark:Random.csentence(3,5),
    });
  }

  return {
    data:list
  }
});

//设备管理--更新语音
Mock.mock('/mock/equipment/updateVoiceInfo',(res,req)=>{
  const body = JSON.parse(res.body);
  console.log('body',body)

  return {
    data:body ? true : false
  }
});

//排班管理--监督报告--预警信息统计
Mock.mock('/mock/schedule-management/reporter/infoCensus',(res,req)=>{

  return {
    data:{
      face:Random.integer(0,20),
      safeHat:Random.integer(0,1),
      workArea:Random.integer(0,20),
      reflectiveClothing:Random.integer(0,20),
      climb:Random.integer(0,1),
      stop:Random.integer(0,20),
      fire:Random.integer(0,20),
      fall:Random.integer(0,1),
    }
  }
});

//排班管理--监督报告--预警信息统计
Mock.mock('/mock/arrange/arrangeReportExceptionCensus',(res,req)=>{
  let data = {};

  ['face','fire','helmet','motionless','refectiveVest','region','tumble','climbHeight'].forEach((item,index)=>{
    let list = [];
    for (let i = 0; i < Random.integer(1,2); i++){
      list.push({
        createTime:Random.datetime('yyyy.MM.dd HH.mm.ss'),
        personName:Random.csentence(3,6),
        person:Random.csentence(3,6),
        isDeal:Random.integer(0,1),
      });
    }
    data[item] = list;
  })


  return {
    data
  }
});

//异常事件--最新异常信息列表
Mock.mock('/mock/exception-event/latelyList',(res,req)=>{
  const body = JSON.parse(res.body);
  let list = [];

  for (let i = 0; i < body.pageSize; i++){
    list.push({
      id:Random.integer(1,99999),
      time:Random.datetime('yyyy.MM.dd HH:mm:ss'),
      name:Random.csentence(3,6),
      type:Random.csentence(3,6),
      source:Random.csentence(3,6),
      project:Random.csentence(3,6),
      person:Random.csentence(3,6),
      info:Random.csentence(3,6),
      status:Random.integer(0,1),
      personList:[
      ],
    });
  }

  return {
    data:{
      list,
      page:{
        total:body.pageSize * 10,
        pageNum:body.pageNum,
        pageSize:body.pageSize,
      },
    }
  }
});

//费用管理--流量列表
Mock.mock('/mock/vis/flowDayRecordList',(res,req)=>{
  const body = JSON.parse(res.body);
  let list = [];

  for (let i = 0; i < body.pageSize; i++){
    list.push({
      date:Random.datetime('yyyy-MM-dd'),
      totalUseTime:Random.integer(3000,30000),
      totalOutByte:Random.integer(1000000,99999999),
      totalSettlementAccount:Random.integer(1000000,99999999),
      startTime:Random.datetime('yyyy-MM-dd HH:mm:ss'),
      endTime:Random.datetime('yyyy-MM-dd HH:mm:ss'),
      useTime:Random.integer(3000,30000),
      outByte:Random.integer(1000000,99999999),
      settlementAccount:Random.integer(1000000,99999999),
      id:Random.integer(3000,30000),
    });
  }

  return {
    data:{
      list,
      page:{
        total:body.pageSize * 10,
        pageNum:body.pageNum,
        pageSize:body.pageSize,
      },
    }
  }
});

//费用管理--充值记录列表
Mock.mock('/mock/vis/visAccountPayRecord',(res,req)=>{
  const body = JSON.parse(res.body);
  let list = [];

  for (let i = 0; i < body.pageSize; i++){
    list.push({
      id:Random.integer(3000,30000),
      payTime:"2021-01-23 12:00:51",
      payAccount:Random.integer(3000,30000),
      surplusAccount:Random.integer(3000,30000),
    });
  }

  return {
    data:{
      list,
      page:{
        total:body.pageSize * 10,
        pageNum:body.pageNum,
        pageSize:body.pageSize,
      },
    }
  }
});
