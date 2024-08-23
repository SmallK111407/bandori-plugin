import plugin from '../../../lib/plugins/plugin.js'
import fs from 'fs'
import path from 'path'

const imagesPath = process.cwd() + '/plugins/bandori-plugin/resources/images/funnyImages'

export class bandoriImage extends plugin {
    constructor() {
        super({
            name: '[邦邦插件]图片功能',
            dsc: '发送邦邦图片',
            event: 'message',
            priority: 10,
            rule: [
                {
                    reg: '^#?(邦|邦邦|邦多利)(随机|来张)?(吊图|图)$',
                    fnc: 'sendBandoriImage'
                }
            ]
        })
    }
    async sendBandoriImage() {
        const files = fs.readdirSync(imagesPath).filter(file => {
            const ext = path.extname(file).toLowerCase()
            return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif'
        })
        if (files.length === 0) {
            logger.warn('[邦邦插件]图库似乎没有图片，请检查是否Clone完整')
            return false
        }
        const randomImage = files[Math.floor(Math.random() * files.length)]
        const imagePath = path.join(imagesPath, randomImage)
        await this.e.reply(segment.image(imagePath))
    }
}