import fs from 'node:fs/promises'

const _path = process.cwd() + '/plugins/bandori-plugin'
const filePath = `${_path}/model/jsonData/characterBirthday.json`

const getBirthdayData = () => {
    const data = fs.readFileSync((filePath), 'utf-8')
    return JSON.parse(data)
}
const getClosestBirthdays = (n) => {
    const birthdays = getBirthdayData()
    const today = new Date()

    const getBirthdayDate = (birthday) => {
        const [month, day] = birthday.split('.').map(Number)
        const currentYear = today.getFullYear()
        return new Date(currentYear, month - 1, day)
    }

    const birthdayDates = Object.entries(birthdays).map(([name, birthday]) => {
        const birthdayDate = getBirthdayDate(birthday)
        let daysDifference = (birthdayDate - today) / (1000 * 60 * 60 * 24)

        if (daysDifference < 0) {
            birthdayDate.setFullYear(today.getFullYear() + 1)
            daysDifference = (birthdayDate - today) / (1000 * 60 * 60 * 24)
        }

        return { name, birthday, daysDifference }
    })

    birthdayDates.sort((a, b) => a.daysDifference - b.daysDifference)

    return birthdayDates.slice(0, n)
}

export async function getBandoriBirthday(n) {
    const closestBirthdays = await getClosestBirthdays(n)

    return closestBirthdays.map(birthday => {   
        return `${birthday.name} ${birthday.birthday} 还有 ${Math.ceil(birthday.daysDifference)} 天到`
    }).join("\n")
}
