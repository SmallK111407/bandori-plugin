import plugin from '../../../lib/plugins/plugin.js'
import common from "../../../lib/common/common.js"
import { execSync } from "child_process"

export class updateLog extends plugin {
  constructor() {
    super({
      name: '[邦邦插件]更新日志',
      dsc: '邦邦插件更新日志',
      event: 'message',
      priority: 10,
      rule: [
        {
          reg: '^#?(邦邦|邦多利)(插件)?更新日志$',
          fnc: 'updateLog'
        }
      ]
    })
  }
  async getLog(plugin = 'bandori-plugin') {
    let cm = 'git log  -20 --oneline --pretty=format:"%h||[%cd]  %s" --date=format:"%F %T"'
    if (plugin) {
      cm = `cd ./plugins/${plugin}/ && ${cm}`
    }
    let logAll
    try {
      logAll = await execSync(cm, { encoding: 'utf-8', windowsHide: true })
    } catch (error) {
      logger.error(error.toString())
      this.reply(error.toString())
    }
    if (!logAll) return false
    logAll = logAll.split('\n')
    let log = []
    for (let str of logAll) {
      str = str.split('||')
      if (str[0] == this.oldCommitId) break
      if (str[1].includes('Merge branch')) continue
      log.push(str[1])
    }
    let line = log.length
    log = log.join('\n\n')
    if (log.length <= 0) return ''
    let end = '更多详细信息，请前往github查看\nhttps://github.com/SmallK111407/bandori-plugin/commits/main'
    log = await common.makeForwardMsg(this.e, [log, end], `${plugin}更新日志，共${line}条`)
    return log
  }
  async updateLog() {
    let log = await this.getLog()
    await this.reply(log)
  }
}