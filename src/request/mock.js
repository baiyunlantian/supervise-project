import Mock from "mockjs";
const Random = Mock.Random;

//首页--左上公司信息
Mock.mock('/mock/index/companyInfo',(res,req)=>{
  return {
    data:{
      name:'广州市微智联科技有限公司',
      id:Random.integer(10000,99999),
      total:Random.integer(10,50),
      actual:Random.integer(10,50),
    }
  }
});

//首页--项目统计
Mock.mock('/mock/index/projectCensus',(res,req)=>{
  return {
    data:{
      notStart:Random.integer(1,10),
      running:Random.integer(1,10),
      end:Random.integer(1,10),
      stop:Random.integer(1,10),
    }
  }
});

//首页--项目进度统计
Mock.mock('/mock/index/projectProgressList',(res,req)=>{
  let list = [];

  for (let i = 0; i <= Random.integer(1,10); i++){
    list.push({
      name:Random.csentence(6,10),
      progress:Random.float(0, 0, 2, 2),
      status:Random.integer(0,3),
    })
  };

  return {
    data:{
      list,
    }
  }
});

//首页--项目详情
Mock.mock('/mock/index/projectDetail',(res,req)=>{

  return {
    data:{
      name:Random.csentence(6,10),
      status:Random.integer(0,3),
      usedDay:Random.integer(50,500),
      expectedDay:Random.integer(50,500),
      risk:Random.integer(1,5),
      priority:'普通',
      manager:'关羽',
      startTime:Random.date('yyyy.MM.dd'),
      endTime:Random.date('yyyy.MM.dd'),
      actualStartTime:Random.date('yyyy.MM.dd'),
      actualEndTime:Random.date('yyyy.MM.dd'),
      progress:Random.float(0, 0, 2, 2),
      delay:Random.float(0, 0, 2, 2),
      finish:Random.float(0, 0, 2, 2),
      completeCount:Random.integer(0,3),
      notCompleteCount:Random.integer(0,3),
    }
  }
});

//首页--资产统计
Mock.mock('/mock/index/assetsCensus',(res,req)=>{
  return {
    data:{
      total:Random.integer(2500,5000),
      actual:Random.integer(50000,110000),
    }
  }
});

//首页--设备统计
Mock.mock('/mock/index/equipmentCensus',(res,req)=>{
  return {
    data:{
      onLine:Random.integer(25,50),
      offLine:Random.integer(5,10),
    }
  }
});

//首页--我的任务
Mock.mock('/mock/index/missionList',(res,req)=>{
  let list = [];

  for (let i = 0; i <= Random.integer(1,10); i++){
    list.push({
      projectName:Random.csentence(6,10),
      missionName:Random.csentence(6,10),
      id:Random.integer(100,999),
      person:Random.csentence(2,4),
      time:Random.datetime('yyyy.MM.dd HH:mm'),
    })
  };

  return {
    data:{
      list,
    }
  }
});

//项目管理--项目分页
Mock.mock('/mock/project/selectList',(res,req)=>{
  const body = JSON.parse(res.body);
  let list = [];

  for (let i = 0; i <= 8; i++){
    list.push({
      name:Random.csentence(6,10),
      status:Random.integer(0,3),
      id:Random.integer(10000,99999),
      person:Random.csentence(2,4),
      nature:Random.csentence(2,4),
      usedDay:Random.integer(50,500),
      progress:Random.float(0, 0, 2, 2),
    })
  };

  return {
    data:{
      list,
      page:{
        total:9,
        pageSize:body.pageSize,
        pageNum:body.pageNum
      },
    }
  }
});

//项目管理--项目信息统计
Mock.mock('/mock/project/infoCensus',(res,req)=>{

  return {
    data:{
      comprehensive:Random.integer(6,20),
      invitation:Random.integer(6,20),
      acceptInvitation:Random.integer(6,20),
      apply:Random.integer(6,20),
      notPass:Random.integer(6,20),
      notDeal:Random.integer(6,20),
    }
  }
});

//项目管理--项目信息列表
Mock.mock('/mock/project/infoSelectList',(res,req)=>{
  const body = JSON.parse(res.body);
  let list = [];

  for (let i = 0; i <= 10; i++){
    list.push({
      date:Random.date('yyyy.MM.dd'),
      status:Random.integer(0,3),
      id:Random.integer(10000,99999),
      info:Random.csentence(10,14),
    })
  };

  return {
    data:{
      list,
      page:{
        total:11,
        pageSize:body.pageSize,
        pageNum:body.pageNum
      },
    }
  }
});

//项目管理--我的任务--个人信息
Mock.mock('/mock/project/mission/personInfo',(res,req)=>{

  let list = [];

  for (let i = 0; i <= 7; i++){
    list.push({
      name:Random.csentence(3,6),
      station:Random.integer(2,4),
      progress:Random.float(0, 0, 2, 2),
      status:Random.integer(0,3),
    })
  };

  return {
    data:{
      name:Random.csentence(2,4),
      department:Random.csentence(2,4),
      station:Random.csentence(2,4),
      code:Random.integer(1,100),
      list,
    }
  }
});


//项目管理--我的任务--任务统计
Mock.mock('/mock/project/mission/census',(res,req)=>{
  return {
    data:{
      projectCount:Random.integer(1,20),
      totalMissionCount:Random.integer(30,100),
      notStart:Random.integer(30,100),
      running:Random.integer(30,100),
      finish:Random.integer(30,100),
    }
  }
});

//项目管理--我的任务列表
Mock.mock('/mock/project/mission/selectList',(res,req)=>{
  let list = [];

  for (let i = 0; i <= 15; i++){
    let missionList = [];

    for (let j = 0; j <= Random.integer(2,4); j++) {
      missionList.push({
        index:j,
        type:Random.integer(0,4)
      });
    }
    list.push({
      title:Random.csentence(3,6),
      list:missionList,
      project:Random.csentence(3,6),
      time:Random.date('yyyy.MM.dd'),
    })
  };

  return {
    data:{
      list,
    }
  }
});

//项目管理--一异常事件列表
Mock.mock('/mock/project/exceptionEventSelectList',(res,req)=>{
  const body = JSON.parse(res.body);

  let list = [];

  for (let i = 0; i <= 14; i++){
    list.push({
      eventName:Random.csentence(3,6),
      project:Random.csentence(3,6),
      time:Random.datetime('yyyy.MM.dd HH:mm'),
      reporter:Random.csentence(2,4),
      assigned:Random.csentence(2,4),
      status:Random.integer(0,2),
      priority:Random.integer(0,2),
      id:Random.integer(1,99999),
      info:Random.sentence(),
    })
  };

  return {
    data:{
      list,
      page:{
        total:58,
        pageSize:body.pageSize,
        pageNum:body.pageNum
      },
    }
  }
});

//项目详情--项目掌控--项目信息
Mock.mock('/mock/project-control/projectInfo',(res,req)=>{

  return {
    data:{
      name:Random.csentence(3,6),
      status:Random.integer(0,3),
      person:Random.csentence(2,4),
    }
  }
});

//项目详情--项目掌控--今日完成进度
Mock.mock('/mock/project-control/todayMission',(res,req)=>{

  return {
    data:{
      finish:Random.integer(0,3),
      notFinish:Random.integer(0,3),
    }
  }
});

//项目详情--项目掌控--异常事件上报统计
Mock.mock('/mock/project-control/exceptionEventCensus',(res,req)=>{

  return {
    data:{
      today:Random.integer(0,10),
      month:Random.integer(10,20),
      total:Random.integer(20,40),
    }
  }
});

//项目详情--项目掌控--异常事件列表
Mock.mock('/mock/project-control/exceptionEventList',(res,req)=>{

  let list = [];

  for (let i = 0; i <= 15; i++) {
    list.push({name:Random.csentence(5,10)});
  }
  return {
    data:{
      list,
    }
  }
});

//项目详情--项目掌控--项目阶段进展
Mock.mock('/mock/project-control/stageList',(res,req)=>{

  let list = [];

  for (let i = 0; i <= Random.integer(3,7); i++) {
    let status = 0;
    let time = Random.datetime('yyyy-MM-dd HH:mm');

    if (i < 2){
      status = 0;
    }else if (i === 2){
      status = 1;
    }else {
      status = 2;
      time = null;
    }
    list.push({
      name:Random.csentence(3),
      time,
      status
    });
  }
  return {
    data:{
      list,
    }
  }
});

//项目掌控--项目完成质量
Mock.mock('/mock/project-control/projectQuality',(res,req)=>{

  return {
    data:{
      processRatio:Random.float(0, 0, 2, 2),
      delayRatio:Random.float(0, 0, 2, 2),
      finishRatio:Random.float(0, 0, 2, 2),
      notFinishCount:Random.integer(50,150),
      finishCount:Random.integer(50,150),
      delayCount:Random.integer(50,150),
      risk:Random.integer(1,3),
    }
  }
});

//项目详情--项目掌控--项目动态
Mock.mock('/mock/project-control/dynamicList',(res,req)=>{

  let list = [];

  for (let i = 0; i <= Random.integer(2,10); i++){
    list.push({
      type:Random.csentence(4,4),
      id:Random.integer(1,99999),
      des:Random.csentence(5,10),
      attachment:Random.csentence(5,10),
      time:Random.datetime('yyyy-MM-dd HH:mm:ss'),
    });
  }

  return {
    data:{
      list
    }
  }
});

//项目详情--项目掌控--我的任务
Mock.mock('/mock/project-control/missionList',(res,req)=>{

  let list = [];

  for (let i = 0; i <= Random.integer(2,10); i++){
    list.push({
      info:Random.csentence(5,10),
      id:Random.integer(1,99999),
      person:Random.csentence(2,4),
      time:Random.datetime('yyyy-MM-dd HH:mm:ss'),
    });
  }

  return {
    data:{
      list
    }
  }
});

//项目详情--项目掌控--任务跟踪
Mock.mock('/mock/project-control/trackingList',(res,req)=>{

  let list = [];

  for (let i = 0; i <= 4; i++){
    list.push({
      name:Random.csentence(4),
      id:Random.integer(1,99999),
      process:Random.float(0,0,2,2),
      status:Random.integer(0,3),
      today:Random.integer(0,1),
    });
  }

  return {
    data:{
      list
    }
  }
});

//项目详情--项目掌控--项目动态--列表
Mock.mock('/mock/project-control/project-dynamic/selectList',(res,req)=>{
  const body = JSON.parse(res.body);

  let list = [];

  for (let i = 0; i < body.pageSize; i++){
    list.push({
      type:Random.csentence(4),
      des:Random.csentence(8,12),
      id:Random.integer(1,99999),
      time:Random.datetime('yyyy-MM-dd HH:mm:ss'),
      person:Random.csentence(2,4),
      attachment:Random.csentence(4,8),
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

//项目详情--项目掌控--出入记录--列表
Mock.mock('/mock/project-control/inAndOut-record/selectList',(res,req)=>{
  const body = JSON.parse(res.body);

  let list = [];

  for (let i = 0; i < body.pageSize; i++){
    list.push({
      name:Random.csentence(2,4),
      status:Random.integer(0,1),
      sex:Random.integer(0,1),
      phone:'15800158000',
      id:Random.integer(1,99999),
      time:Random.datetime('yyyy.MM.dd HH:mm:ss'),
      station:Random.integer(1,4),
      group:Random.integer(1,4),
      code:Random.integer(1,99),
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

//项目详情--项目掌控--出入记录--统计
Mock.mock('/mock/project-control/inAndOut-record/census',(res,req)=>{

  return {
    data:{
      in:Random.integer(100,300),
      out:Random.integer(100,300),
    }
  }
});

//项目详情--项目掌控--访客统计列表
Mock.mock('/mock/project-control/visitor/selectList',(res,req)=>{
  const body = JSON.parse(res.body);

  let list = [];

  for (let i = 0; i < body.pageSize; i++){
    list.push({
      id:Random.integer(1,99999),
      time:Random.datetime('yyyy.MM.dd HH:mm:ss'),
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

//项目详情--人员管理--左侧部门列表
Mock.mock('/mock/project-control/person/departmentList',(res,req)=>{

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

//项目详情--人员管理--左侧部门里的  人员/部门
Mock.mock('/mock/project-control/person/findDetailByDepartmentId',(res,req)=>{
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

//项目详情--人员管理--人数统计
Mock.mock('/mock/project-control/person/personCensus',(res,req)=>{

  return {
    data:{
      onWay:Random.integer(60,130),
      building:Random.integer(60,130),
      contracted:Random.integer(60,130),
      construction:Random.integer(60,130),
      third:Random.integer(60,130),
      notActive:Random.integer(60,130),
    }
  }
});

//项目详情--人员管理--项目人员列表
Mock.mock('/mock/project-control/person/projectPersonSelectList',(res,req)=>{
  const body = JSON.parse(res.body);

  let list = [];

  for (let i = 0; i < body.pageSize; i++){
    list.push({
      id:Random.integer(1,99999),
      name:Random.csentence(2,4),
      phone:'15800158000',
      sex:Random.integer(0,1),
      birth:Random.date('yyyy-MM:dd'),
      group:Random.integer(0,5),
      station:Random.integer(0,5),
      code:Random.integer(1,99),
      unit:Random.csentence(3,5),
      status:Random.integer(0,1),
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

//项目详情--人员管理--历史用人申请表
Mock.mock('/mock/project-control/person/historyApplySelectList',(res,req)=>{
  const body = JSON.parse(res.body);

  let list = [];

  for (let i = 0; i < body.pageSize; i++){
    list.push({
      id:Random.integer(1,99999),
      name:Random.csentence(2,4),
      phone:'15800158000',
      sex:Random.integer(0,1),
      date:Random.date('yyyy-MM:dd'),
      group:Random.integer(0,5),
      count:Random.integer(1,20),
      result:Random.integer(0,3),
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

//项目详情--人员管理--待激活人员列表
Mock.mock('/mock/project-control/person/notActivePersonSelectList',(res,req)=>{
  const body = JSON.parse(res.body);

  let list = [];

  for (let i = 0; i < body.pageSize; i++){
    list.push({
      id:Random.integer(1,99999),
      name:Random.csentence(2,4),
      phone:'15800158000',
      idCard:'15786324684631851',
      sex:Random.integer(0,1),
      group:Random.integer(0,5),
      department:Random.integer(0,5),
      station:Random.integer(1,20),
      unit:Random.csentence(3,4),
      code:Random.integer(1,99),
      birth:Random.date('yyyy-MM:dd'),
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

//项目详情--人员管理--待激活人员列表
Mock.mock('/mock/project-control/person/findPersonDetailById',(res,req)=>{
  const body = JSON.parse(res.body);

  return {
    data:{
      id:body.id,
      name:Random.csentence(2,4),
      phone:'15800158000',
      idCard:'15786324684631851',
      sex:Random.integer(0,1),
      group:Random.integer(0,5),
      station:Random.integer(1,20),
      unit:Random.csentence(3,4),
      code:Random.integer(1,99),
      certificateList:[
        {
          date:Random.date('yyyy-MM'),
          name:Random.csentence(3,4),
          cerId:Random.integer(1,99999),
        }
      ],
    }
  }
});

//项目详情--资产管理首页--资产统计
Mock.mock('/mock/project-control/asset/assetCensus',(res,req)=>{

  return {
    data:{
      fixed:Random.integer(100,500),
      consumables:Random.integer(100,500),
      fixedMoney:Random.float(1000,3000,2,2),
      consumablesMoney:Random.float(1000,3000,2,2),
      addNew:Random.integer(1,99),
    }
  }
});

//项目详情--资产管理首页--资产日常使用情况
Mock.mock('/mock/project-control/asset/useSituation',(res,req)=>{

  return {
    data:{
      receive:Random.integer(100,500),
      borrow:Random.integer(100,500),
      clean:Random.integer(1,20),
      wrong:Random.integer(1,99),
    }
  }
});

//项目详情--资产管理首页--资产百分比
Mock.mock('/mock/project-control/asset/assetRatio',(res,req)=>{
  let list = [];

  for (let i=0; i<4; i++) {
    list.push({type:i, count:Random.integer(10,50)})
  }

  return {
    data:{
      list
    }
  }
});

//项目详情--资产管理首页--资产数量详情
Mock.mock('/mock/project-control/asset/assetCountDetailRatio',(res,req)=>{
  let list = [];

  for (let i=0; i<4; i++) {
    list.push({type:Random.csentence(3), count:Random.integer(10,50)})
  }

  return {
    data:{
      list
    }
  }
});

//排班管理--任务管理列表
Mock.mock('/mock/schedule-management/missionSelectList',(res,req)=>{
  const body = JSON.parse(res.body);

  let list = [];

  for (let i = 0; i < body.pageSize; i++){
    let personList = [];
    for (let j = 0; j < Random.integer(2,10); j++){
      personList.push({type:j === 0 ? 0 : 1, url:''});
    }

    list.push({
      id:Random.integer(1,99999),
      name:Random.csentence(2,4),
      service:Random.csentence(2,4),
      serviceStatus:Random.integer(1,3),
      missionStatus:Random.integer(1,3),
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

//排班管理--任务详情--施工监督报告列表
Mock.mock('/mock/schedule-detail/reportSelectList',(res,req)=>{
  const body = JSON.parse(res.body);

  let list = [];

  for (let i = 0; i < body.pageSize; i++){
    list.push({
      id:Random.integer(1,99999),
      code:Random.integer(10000,99999),
      startTime:Random.time('HH:mm:ss'),
      endTime:Random.time('HH:mm:ss'),
      warningCount:Random.integer(10,50),
      date:`${Random.date('yyyy.MM.dd')}`,
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

//设备管理--设备列表
Mock.mock('/mock/equipment-management/selectList',(res,req)=>{
  const body = JSON.parse(res.body);

  let list = [];

  for (let i = 0; i < body.pageSize; i++){
    list.push({
      id:Random.integer(1,99999),
      name:Random.csentence(3,5),
      ip:'127.0.0.1',
      port:Random.integer(50,200),
      account:'admin',
      password:'123456',
      status:Random.integer(0,3),
      remark:Random.csentence(3,5),
      cameraList:[
        {
          id:Random.integer(1,99999),
          name:'摄像头'+Random.integer(1,1000),
          ip:'127.0.0.1',
          port:Random.integer(50,200),
          account:'admin',
          password:'123456',
          status:Random.integer(0,3),
          remark:Random.csentence(3,5),
        },
        {
          id:Random.integer(1,99999),
          name:'摄像头'+Random.integer(1,1000),
          ip:'127.0.0.1',
          port:Random.integer(50,200),
          account:'admin',
          password:'123456',
          status:Random.integer(0,3),
          remark:Random.csentence(3,5),
        },
        {
          id:Random.integer(1,99999),
          name:'摄像头'+Random.integer(1,1000),
          ip:'127.0.0.1',
          port:Random.integer(50,200),
          account:'admin',
          password:'123456',
          status:Random.integer(0,3),
          remark:Random.csentence(3,5),
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

//排班管理--监督报告--预警信息统计
Mock.mock('/mock/schedule-management/reporter/infoCensus',(res,req)=>{

  return {
    data:{
      face:Random.integer(0,20),
      safeHat:Random.integer(0,1),
      workArea:Random.integer(0,20),
      clothes:Random.integer(0,20),
      climb:Random.integer(0,1),
      stop:Random.integer(0,20),
      fire:Random.integer(0,20),
      fall:Random.integer(0,1),
    }
  }
});

//排班管理--监督报告--预警信息统计
Mock.mock('/mock/schedule-management/reporter/warningList',(res,req)=>{
  let list = [];

  for (let i = 0; i < Random.integer(4,15); i++){
    list.push({
      time:Random.datetime('yyyy.MM.dd HH.mm.ss'),
      name:Random.csentence(3,6),
      person:Random.csentence(3,6),
      status:Random.integer(0,4),
    });
  }

  return {
    data:{
      list
    }
  }
});