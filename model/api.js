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