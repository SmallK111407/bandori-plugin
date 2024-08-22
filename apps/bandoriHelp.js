import lodash from 'lodash'
import fs from 'fs'
import { Cfg, Version, Common, Data } from '../model/components/index.js'

export class bandoriHelp extends plugin {
  constructor() {
    super({
      name: '[邦邦插件]帮助',
      dsc: '获取邦邦插件帮助',
      event: 'message',
      priority: 10,
      rule: [
        {
          reg: "^#?(邦邦|邦多利)?(命令|帮助|菜单|help|说明|功能|指令|使用说明)$",
          fnc: 'help'
        },
        {
          reg: "^#?(邦邦|邦多利)版本$",
          fnc: 'versionInfo'
        }
      ]
    })
  }

  async help(e) {
    if ((!/邦邦/.test(e.msg)) && (!/邦多利/.test(e.msg)) && !Cfg.get('sys.help', false)) {
      return false
    }

    let custom = {}
    let help = {}
    let { diyCfg, sysCfg } = await Data.importCfg('help')

    if (lodash.isArray(help.helpCfg)) {
      custom = {
        helpList: help.helpCfg,
        helpCfg: {}
      }
    } else {
      custom = help
    }

    let helpConfig = lodash.defaults(diyCfg.helpCfg || {}, custom.helpCfg, sysCfg.helpCfg)
    let helpList = diyCfg.helpList || custom.helpList || sysCfg.helpList

    let helpGroup = []

    lodash.forEach(helpList, (group) => {
      if (group.auth && group.auth === 'master' && !e.isMaster) {
        return true
      }

      lodash.forEach(group.list, (help) => {
        let icon = help.icon * 1
        if (!icon) {
          help.css = 'display:none'
        } else {
          let x = (icon - 1) % 10
          let y = (icon - x - 1) / 10
          help.css = `background-position:-${x * 50}px -${y * 50}px`
        }
      })

      helpGroup.push(group)
    })

    let themeData = await this.getThemeData(diyCfg.helpCfg || {}, sysCfg.helpCfg || {})
    return await Common.render('help/index', {
      helpCfg: helpConfig,
      helpGroup,
      ...themeData,
      element: 'default'
    }, { e, scale: 1.6 })
  }

  async versionInfo(e) {
    return await Common.render('help/version-info', {
      currentVersion: Version.version,
      changelogs: Version.changelogs,
      elem: 'pyro'
    }, { e, scale: 1.6 })
  }

  async getThemeCfg(theme, exclude) {
    let dirPath = './plugins/bandori-plugin/resources/help/theme/'
    let ret = []
    let names = []
    let dirs = fs.readdirSync(dirPath)
    lodash.forEach(dirs, (dir) => {
      if (fs.existsSync(`${dirPath}${dir}/main.png`)) {
        names.push(dir)
      }
    })
    if (lodash.isArray(theme)) {
      ret = lodash.intersection(theme, names)
    } else if (theme === 'all') {
      ret = names
    }
    if (exclude && lodash.isArray(exclude)) {
      ret = lodash.difference(ret, exclude)
    }
    if (ret.length === 0) {
      ret = ['default']
    }
    let name = lodash.sample(ret)
    let resPath = '{{_res_path}}/help/theme/'
    return {
      main: `${resPath}${name}/main.png`,
      bg: fs.existsSync(`${dirPath}${name}/bg.jpg`) ? `${resPath}${name}/bg.jpg` : `${resPath}default/bg.jpg`,
      style: (await Data.importModule(`resources/help/theme/${name}/config.js`)).style || {}
    }
  }

  async getThemeData(diyStyle, sysStyle) {
    let helpConfig = lodash.extend({}, diyStyle, sysStyle)
    let colCount = Math.min(5, Math.max(parseInt(helpConfig?.colCount) || 3, 2))
    let colWidth = Math.min(500, Math.max(100, parseInt(helpConfig?.colWidth) || 265))
    let width = Math.min(2500, Math.max(800, colCount * colWidth + 30))
    let theme = await this.getThemeCfg(helpConfig.theme, diyStyle.themeExclude || sysStyle.themeExclude)
    let themeStyle = theme.style || {}
    let ret = [`
    body{background-image:url(${theme.bg});width:${width}px;}
    .container{background-image:url(${theme.main});width:${width}px;}
    .help-table .td,.help-table .th{width:${100 / colCount}%}
    `]
    let css = function (sel, css, key, def, fn) {
      let val = Data.def(themeStyle[key], diyStyle[key], sysStyle[key], def)
      if (fn) {
        val = fn(val)
      }
      ret.push(`${sel}{${css}:${val}}`)
    }
    css('.help-title,.help-group', 'color', 'fontColor', '#ceb78b')
    css('.help-title,.help-group', 'text-shadow', 'fontShadow', 'none')
    css('.help-desc', 'color', 'descColor', '#eee')
    css('.cont-box', 'background', 'contBgColor', 'rgba(43, 52, 61, 0.8)')
    css('.cont-box', 'backdrop-filter', 'contBgBlur', 3, (n) => diyStyle.bgBlur === false ? 'none' : `blur(${n}px)`)
    css('.help-group', 'background', 'headerBgColor', 'rgba(34, 41, 51, .4)')
    css('.help-table .tr:nth-child(odd)', 'background', 'rowBgColor1', 'rgba(34, 41, 51, .2)')
    css('.help-table .tr:nth-child(even)', 'background', 'rowBgColor2', 'rgba(34, 41, 51, .4)')
    return {
      style: `<style>${ret.join('\n')}</style>`,
      colCount
    }
  }
}
