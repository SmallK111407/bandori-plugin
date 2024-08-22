import lodash from 'lodash'
import { Cfg, Version, Common, Data } from '../model/components/index.js'
import Theme from './help/theme.js'

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
    let themeData = await Theme.getThemeData(diyCfg.helpCfg || {}, sysCfg.helpCfg || {})
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
}
