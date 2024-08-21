import plugin from '../../../lib/plugins/plugin.js'
import { getAllKeys, getElementsByKey } from '../model/fandomGroup.js'

const _path = process.cwd() + '/plugins/bandori-plugin'

export class getFandomGroup extends plugin {
    constructor() {
        super({
            name: '[邦邦插件]获取同好群',
            dsc: '获取邦邦同好群信息',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: '^#?(邦邦|邦多利)(.*)同好群$',
                    fnc: 'getFandomGroup'
                },
                {
                    reg: '^#?(邦邦|邦多利)?同好群帮助$',
                    fnc: 'fandomGroupHelp'
                },
                {
                    reg: '^#?(邦邦|邦多利)?同好区域列表$',
                    fnc: 'fandomGroupArea'
                }
            ]
        })
    }
    async getFandomGroup() {
        let reg = this.e.msg.replace(/#邦邦|邦多利|同好群/g, '').trim()
        if (!reg) return this.e.reply([segment.image(`${_path}/resources/images/fandomMap.png`), `可发送 #同好群帮助 获取帮助`])
        const fandomGroups = await getElementsByKey(reg)
        if (!fandomGroups) return this.e.reply(`不支持所查询区域！请使用 #同好群区域列表 查看可查询的区域`)
        await this.e.reply(`您所查询的 ${reg} 有以下同好群！\n` + fandomGroups)
    }
    async fandomGroupHelp() {
        await this.e.reply(`1.使用 #邦邦同好群 可查看同好群地图！\n2.如需查询单独对应区域的请在"同好群"前面添加省份/自治区/直辖市！例如 #邦邦福建同好群\n3.使用 #同好群区域列表 即可查看可查询的区域！\n`)
    }
    async fandomGroupArea() {
        const fandomGroupsArea = await getAllKeys()
        await this.e.reply(`截至目前可支持查询以下区域！\n` + fandomGroupsArea)
    }
}