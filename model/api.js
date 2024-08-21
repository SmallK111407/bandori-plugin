export function getMemberInfo(memberId) {
    const apiUrl = `https://bandori.party/api/members/${memberId}/`
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json()
        })
        .catch(error => {
            logger.error('访问API错误:', error)
            throw error
        })
}