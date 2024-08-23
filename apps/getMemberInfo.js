import plugin from '../../../lib/plugins/plugin.js'
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
                    reg: '^#?(邦邦|邦多利)?(开合|开盒)',
                    fnc: 'getMemberInformation'
                }
            ]
        })
    }
    async getMemberInformation() {
        let msg = this.e.msg
        let reg = msg.replace(/#|邦邦|邦多利|开合|开盒/g, '').trim()
        let name = reg
        let role = alias.get(name)
        if (!role) return false
        try {
            const res = await getMemberInfo(role)
            const firstName = alias.getFirstElement(role)
            const messages = [
                segment.image(res.image),
                `我去！一不小心合了`, firstName,
                `\n罗马名字:`, res.name,
                `\n日文名字:`, res.japanese_name,
                `\n所属乐队:`, res.i_band,
                `\n学校:`, res.school,
                `\n年级:`, res.i_school_year,
                `\nCV日文名字:`, res.CV,
                `\nCV罗马名字:`, res.romaji_CV,
                `\n生日:`, res.birthday,
                `\n喜欢的食物:`, res.food_like,
                `\n不喜欢的食物:`, res.food_dislike,
                `\n星座:`, res.i_astrological_sign,
                `\n乐器:`, res.instrument,
                `\n介绍:`, res.description,
                `\n角色ID:`, res.id,
                `\n由于内容来自国外网站，所以暂时无法提供翻译！`
            ]
            await this.e.reply(messages)
        } catch (error) {
            logger.error(`访问时产生了不可抗拒的因素:`, error)
            return false
        }
    }
}