import plugin from '../../../lib/plugins/plugin.js'
import { getRandomMemberImage } from '../model/api.js'

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
    async bandoriRelife() {
        try {
            const { firstElement, imageUrl } = await getRandomMemberImage()
            await this.e.reply(`唔...一不小心，转生成了${firstElement}！`, segment.image(imageUrl))
        } catch (error) {
            logger.error('发生了不可抗拒的错误:', error)
            return false
        }
    }
}