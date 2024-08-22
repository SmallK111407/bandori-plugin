import fs from 'node:fs/promises'

const _path = process.cwd() + '/plugins/bandori-plugin'
const filePath = `${_path}/model/jsonData/fandomGroup.json`

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
        return { firstElement, imageUrl }
    } catch (error) {
        console.error('执行过程中发生错误:', error)
        throw error
    }
}