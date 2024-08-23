import plugin from '../../../lib/plugins/plugin.js'
import { getAnimePilgrimageNames, getElementsByAnimePilgrimageNames } from '../model/api.js'

export class bandoriAPs extends plugin {
    constructor() {
        super({
            name: '[邦邦插件]圣地巡礼功能',
            dsc: '查询对应的圣地巡礼',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: '^#?(邦邦|邦多利)?圣地巡礼查询$',
                    fnc: 'bandoriAPNames'
                },
                {
                    reg: '^#?(邦邦|邦多利)?圣地巡礼',
                    fnc: 'bandoriAP'
                }
            ]
        })
    }
    async bandoriAPNames() {
        const bandoriAnimePilgrimageNames = await getAnimePilgrimageNames()
        await this.e.reply(`当前可支持查询以下圣地巡礼地点\n${bandoriAnimePilgrimageNames}`)
    }
    async bandoriAP() {
        let reg = this.e.msg.replace(/#|邦邦|邦多利|圣地巡礼/g, '').trim()
        if (!reg) return this.e.reply(`你还没写要查哪里呢！发送 #邦邦圣地巡礼查询 查看可查询的地点`)
        const bandoriAnimePilgrimageElements = await getElementsByAnimePilgrimageNames(reg)
        if (!bandoriAnimePilgrimageElements) return this.e.reply(`查询的地点不正确哦！发送 #邦邦圣地巡礼查询 查看可查询的地点`)
        const geoArray = bandoriAnimePilgrimageElements.geo
        const APResult = [
            segment.image(bandoriAnimePilgrimageElements.image),
            `以下是所查询的圣地巡礼信息`,
            `\n地点名字:${bandoriAnimePilgrimageElements.name}`,
            `\n番剧出现集数:${bandoriAnimePilgrimageElements.ep}`,
            `\n番剧出现时间:${bandoriAnimePilgrimageElements.s}`,
            `\n现实地图经纬度:\n经度${geoArray[0]} , 纬度:${geoArray[1]}`,
            `\n位置来源:${bandoriAnimePilgrimageElements.origin}`,
            `\n来源网址:${bandoriAnimePilgrimageElements.originURL}`,
            `\n注意:来源网址为谷歌地图，请使用特殊方法访问！`
        ]
        await this.e.reply(APResult)
    }
}
