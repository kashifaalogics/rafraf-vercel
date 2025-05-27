
function getCookieData() {
    const userId = localStorage.getItem("SEARCH_COOKEI") || "cookie_not_found";
    const sessionId = sessionStorage.getItem("tt_sessionId")?.replaceAll('"', '')
    const sessionIndex = JSON.parse(sessionStorage.getItem("tt_pixel_session_index") || "").index


    let array = sessionId?.split("-")
    let sId = ""
    if (array !== undefined) {
        sId = array.splice(1, 2).join("-")
    }
    return [userId, sId, sessionIndex]
}

export default getCookieData