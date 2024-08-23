import fs from 'node:fs/promises'

const _path = process.cwd() + '/plugins/bandori-plugin'
const filePath = `${_path}/model/jsonData/alias.json`

// BandoriParty API
export async function getMemberInfo(memberId) {
    const apiUrl = `https://bandori.party/api/members/${memberId}/`
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.json()
        })
        .catch(error => {
            console.error('访问API错误:', error)
            throw error
        })
}

export async function getRandomMemberImage() {
    try {
        const data = await fs.readFile(filePath, 'utf8')
        const jsonData = JSON.parse(data)
        const keys = Object.keys(jsonData)
        const randomKey = keys[Math.floor(Math.random() * keys.length)]
        const firstElement = jsonData[randomKey][0]
        const apiUrl = `https://bandori.party/api/members/${randomKey}/`
        const response = await fetch(apiUrl)
        const apiData = await response.json()
        const imageUrl = apiData.image
        const bandName = apiData.i_band
        return { firstElement, imageUrl, bandName }
    } catch (error) {
        console.error('执行过程中发生错误:', error)
        throw error
    }
}

// anitabi.cn API

const animePilgrimageUrls = [
    // BanG Dream!
    'https://api.anitabi.cn/bangumi/186515/points/detail',
    // BanG Dream!It's MyGO!!!!!
    'https://api.anitabi.cn/bangumi/428735/points/detail'
]

async function fetchData(url) {
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export async function getAnimePilgrimageNames() {
    const urls = animePilgrimageUrls
    const results = await Promise.all(urls.map(fetchData))
    let names = []
    let counter = 1
    results.forEach(result => {
        result.forEach(item => {
            names.push(`${counter} - ${item.name}`)
            counter++
        })
    })
    return names.join('\n').replace(/我什么都会做的.gif/g, '我什么都会做的')
}

export async function getElementsByAnimePilgrimageNames(name) {
    const urls = animePilgrimageUrls
    const results = await Promise.all(urls.map(fetchData))
    let elements = []
    results.forEach(result => {
        result.forEach(item => {
            if (item.name === name) {
                if (item.name === '我什么都会做的.gif') {
                    item.name = '我什么都会做的'
                }
                item.origin = item.origin || '暂无'
                item.originURL = item.originURL || '暂无'
                item.image = item.image.split('?')[0]
                if (!item.ep) {
                    item.ep = '无'
                    item.s = '无'
                } else {
                    const minutes = Math.floor(item.s / 60)
                    const seconds = item.s % 60
                    item.s = `${minutes}分钟${seconds}秒`
                }
                elements.push(item)
            }
        })
    })
    return elements.length > 0 ? elements : undefined;
}