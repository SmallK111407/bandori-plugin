import plugin from '../../../lib/plugins/plugin.js'
import common from '../../../lib/common/common.js'
import { getMemberInfo } from '../model/api.js'
import alias from '../model/alias.js'

export class getMemberInformation extends plugin {
    constructor() {
        super({
            name: '[邦邦插件]获取人物信息',
            dsc: '开合某个人',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: '^#?(开合|开盒)?(邦邦|邦多利)?(.*)信息$',
                    fnc: 'getMemberInformation'
                }
            ]
        })
    }
    async getMemberInformation() {
        let msg = this.e.msg
        let reg = msg.replace(/#|开合|开盒|邦邦|邦多利|信息/g, '').trim()
        let name = reg
        let role = alias.get(name)
        if (!role) return false
        getMemberInfo(role).then(res => {
            const messages = [
                `方形头像:`, segment.image(res.square_image),
                `小人图片:`, segment.image(image),
                `罗马名字:${res.name}`,
                `日文名字:${res.japanese_name}`,
                `所属乐队:${res.i_band}`,
                `学校:${res.school}`,
                `年级:${res.i_school_year}`,
                `CV日文名字:${res.CV}`,
                `CV罗马名字:${res.romaji_CV}`,
                `生日:${res.birthday}`,
                `喜欢的食物:${res.food_like}`,
                `不喜欢的食物:${res.food_dislike}`,
                `星座:${res.i_astrological_sign}`,
                `乐器:${res.instrument}`,
                `介绍:${res.description}`,
                `角色ID:${res.id}`
            ]
            const message = messages.join(`\n`).trim()
            const replyMsg = common.makeForwardMsg(this.e, message, `我去！一不小心合了${role[0]}`)
            this.e.reply(replyMsg)
        })
    }
}