import setting from './setting.js'
import _ from 'lodash'
import fs from 'node:fs/promises'

const _path = process.cwd() + '/plugins/bandori-plugin'

let defAlias = null

async function loadAliasData() {
  try {
    const jsonContent = await fs.readFile(`${_path}/model/jsonData/alias.json`, `utf-8`)
    defAlias = JSON.parse(jsonContent)
  } catch (error) {
    console.error('加载原配置文件错误:', error)
  }
}

await loadAliasData()

export default new class {
  get(name) {
    const aliasList = { ...defAlias, ...setting.getConfig('alias') }
    if (name in aliasList) return name
    const roleName = _.findKey(aliasList, alias => alias.includes(name))
    if (roleName) {
      return roleName
    } else {
      //logger.error('[Bandori别名]未找到该人')
      return false
    }
  }
  getAllName() {
    return { ...defAlias, ...setting.getConfig('alias') }
  }

  getFirstElement(id) {
    const aliasList = this.getAllName()
    const aliases = aliasList[id]
    if (Array.isArray(aliases) && aliases.length > 0) {
      return aliases[0]
    } else {
      return null
    }
  }
}()