import axios from "axios";

export const profileData = async () => {
    try {
        const session = localStorage.getItem("session")
        const expiration = localStorage.getItem("expiration")
        const now = new Date().getTime()
        if (!session) return false
        if (expiration && now > expiration) {
            localStorage.removeItem("session")
            localStorage.removeItem("expiration")
            return false
        }
        const { data } = await axios.get("/api/user", {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
        return data
    } catch (e) {
        console.error(`auth : ${e}`)
        return false       
    }
}