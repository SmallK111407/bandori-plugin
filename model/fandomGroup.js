import fs from 'node:fs/promises'

const _path = process.cwd() + '/plugins/bandori-plugin'
const filePath = `${_path}/model/jsonData/fandomGroup.json`

export async function getAllKeys() {
    try {
        const data = await fs.readFile(filePath, 'utf-8')
        const json = JSON.parse(data)
        return Object.keys(json).join(' ')
    } catch (error) {
        console.error('读取文件错误:', error)
    }
}

export async function getElementsByKey(key) {
    try {
        const data = await fs.readFile(filePath, 'utf-8')
        const json = JSON.parse(data)
        if (json[key]) {
            return json[key].join('\n')
        } else {
            throw new Error(`键值 "${key}" not found`)
        }
    } catch (error) {
        console.error('读取错误文件或键值:', error)
    }
}