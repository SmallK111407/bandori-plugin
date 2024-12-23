import plugin from '../../../lib/plugins/plugin.js'
import { getBandoriBirthday } from '../model/bandoriBirthday.js'
import setting from '../model/setting.js'

export class bandoriBirthday extends plugin {
    constructor() {
        super({
            name: '[邦邦插件]离生日还有多久',
            dsc: '查询最近的几个角色生日',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: '^#?(邦邦|邦多利)?生日$',
                    fnc: 'bandoriBirthday'
                }
            ]
        })
    }
    get appconfig() { return setting.getConfig("config") }
    async bandoriBirthday() {
        const bandoriNumber = this.appconfig['birthhdayNumber']
        const birthday = await getBandoriBirthday(bandoriNumber)
        await this.e.reply(birthday)
    }
}