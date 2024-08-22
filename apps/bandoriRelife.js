import plugin from '../../../lib/plugins/plugin.js'
import { getRandomMemberImage } from '../model/api.js'
import setting from '../model/setting.js'

const CD = {}
export class bandoriRelife extends plugin {
    constructor() {
        super({
            name: '[邦邦插件]转生',
            dsc: '下辈子会变成谁呢',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: '^#?(邦邦|邦多利)?转生$',
                    fnc: 'bandoriRelife'
                }
            ]
        })
    }
    get appconfig() { return setting.getConfig("config") }
    async bandoriRelife() {
        let cdtime = this.appconfig['relifeCD']
        if (CD[this.e.user_id] && !this.e.isMaster) {
            this.e.reply('每' + cdtime + '分钟只能抽取一次哦！')
            return false
        }
        CD[this.e.user_id] = true
        CD[this.e.user_id] = setTimeout(() => {
            if (CD[this.e.user_id]) delete CD[this.e.user_id]
        }, cdtime * 60 * 1000)
        try {
            const { firstElement, imageUrl } = await getRandomMemberImage()
            await this.e.reply([segment.image(imageUrl), `唔...一不小心，转生成了${firstElement}！`])
        } catch (error) {
            logger.error('发生了不可抗拒的错误:', error)
            return false
        }
    }
}