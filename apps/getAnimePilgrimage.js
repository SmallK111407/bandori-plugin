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
                    reg: '^#?(邦邦|邦多利)?圣地巡礼查询(\\d*)?$',
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
        const regex = /^#?(邦邦|邦多利)?圣地巡礼查询(\d*)$/
        const match = this.e.msg.match(regex)
        let page = 1
        if (match && match[2]) {
            page = parseInt(match[2], 10)
        }
        const bandoriAnimePilgrimageNames = await getAnimePilgrimageNames()
        const namesArray = bandoriAnimePilgrimageNames.split('\n')
        const itemsPerPage = 20
        const totalPages = Math.ceil(namesArray.length / itemsPerPage)
        page = Math.max(1, Math.min(page, totalPages))
        const start = (page - 1) * itemsPerPage
        const end = page * itemsPerPage
        const currentPageNames = namesArray.slice(start, end).join('\n')
        let replyMessage = `当前可支持查询以下圣地巡礼地点 (第 ${page} 页，共 ${totalPages} 页)\n${currentPageNames}`
        if (page < totalPages) {
            replyMessage += `\n输入 #邦邦圣地巡礼查询${page + 1} 来查看更多地点`
        }
        if (page > 1) {
            replyMessage += `\n输入 #邦邦圣地巡礼查询${page - 1} 来返回上一页`
        }
        await this.e.reply(replyMessage)
    }
    async bandoriAP() {
        let reg = this.e.msg.replace(/#|邦邦|邦多利|圣地巡礼/g, '').trim()
        if (!reg) return this.e.reply(`你还没写要查哪里呢！发送 #邦邦圣地巡礼查询 查看可查询的地点`)
        if (reg === `我什么都会做的`) {
            reg = `我什么都会做的.gif`
        }
        const bandoriAnimePilgrimageElements = await getElementsByAnimePilgrimageNames(reg)
        if (!bandoriAnimePilgrimageElements) return this.e.reply(`查询的地点不正确哦！发送 #邦邦圣地巡礼查询 查看可查询的地点`)
        for (const element of bandoriAnimePilgrimageElements) {
            const geoArray = element.geo || []
            const APResult = [
                segment.image(element.image),
                `以下是所查询的圣地巡礼信息`,
                `\n地点名字: ${element.name}`,
                `\n番剧出现集数: ${element.ep}`,
                `\n番剧出现时间: ${element.s}`,
                `\n现实地图经纬度:\n经度: ${geoArray[0]} , 纬度: ${geoArray[1]}`,
                `\n位置来源: ${element.origin}`,
                `\n来源网址: ${element.originURL}`,
                `\n注意: 来源网址为谷歌地图，请使用特殊方法访问！`
            ].replace(/我什么都会做的.gif/g, '我什么都会做的')
            await this.e.reply(APResult)
        }
    }
}
