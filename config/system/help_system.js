/*
* 此配置文件为系统使用，请勿修改，否则可能无法正常使用
*
* 如需自定义配置请复制修改上一级help_default.js
*
* */

export const helpCfg = {
  title: '邦邦插件帮助',
  subTitle: 'Bandori-Plugin are running on Rana',
  columnCount: 3,
  colWidth: 265,
  theme: 'all',
  themeExclude: ['default'],
  style: {
    fontColor: '#ceb78b',
    descColor: '#eee',
    contBgColor: 'rgba(6, 21, 31, .5)',
    contBgBlur: 3,
    headerBgColor: 'rgba(6, 21, 31, .4)',
    rowBgColor1: 'rgba(6, 21, 31, .2)',
    rowBgColor2: 'rgba(6, 21, 31, .35)'
  }
}

export const helpList = [{
  group: '基础功能',
  list: [{
    icon: 1,
    title: '#开合<角色名字>',
    desc: '获取某位角色的信息 例如 #开合soyo'
  }, {
    icon: 3,
    title: '#<角色名字>别名',
    desc: '获取某位角色的别名 例如 #ksm别名'
  }, {
    icon: 5,
    title: '#转生',
    desc: '随机转生为邦邦世界观的某位角色'
  }, {
    icon: 7,
    title: '#邦邦圣地巡礼查询',
    desc: '查看可查询的邦邦圣地巡礼地点'
  }, {
    icon: 9,
    title: '#邦邦圣地巡礼<地点名字>',
    desc: '查询圣地巡礼地点详细信息'
  }, {
    icon: 11,
    title: '#邦图',
    desc: '随机发送一张邦图'
  }, {
    icon: 13,
    title: '#邦邦版本',
    desc: '获取该机器人新更新的内容'
  }, {
    icon: 15,
    title: '#邦邦帮助',
    desc: '获取你目前所看到的这个图片'
  }]
}, {
  group: '同好群功能',
  list: [{
    icon: 17,
    title: '#邦邦同好群',
    desc: '获取邦邦同好群地图 作者@瑠荧'
  }, {
    icon: 19,
    title: '#邦邦<地区名字>同好群',
    desc: '获取对应地区同好群列表 例如 #邦邦福建同好群'
  }, {
    icon: 21,
    title: '#邦邦同好群列表',
    desc: '获取所有支持查询的地区名字'
  }, {
    icon: 23,
    title: '#邦邦同好群帮助',
    desc: '获取此段功能的文字帮助'
  }]
}, {
  group: '管理命令，仅Master可用',
  auth: 'master',
  list: [{
    icon: 71,
    title: '#邦邦(强制)更新',
    desc: '更新邦邦插件'
  }, {
    icon: 73,
    title: '#邦邦更新日志',
    desc: '邦邦插件更新日志'
  }]
}]

export const isSys = true
