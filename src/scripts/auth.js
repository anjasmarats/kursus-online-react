import axios from "axios"
import { server_url } from "./url"

const auth = async ()=>{
    try {
        const session = localStorage.getItem("session")
        const expiration = localStorage.getItem("expiration")
        const now = new Date().getTime()
        if (!session || (expiration && now > expiration)) {
            localStorage.removeItem("session")
            localStorage.removeItem("expiration")
            return false
        }
        const res = await axios.get(`${server_url}/api/auth`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })

        const { data } = await res.data

        console.log(data)

        return data
    } catch (e) {
        console.error(`auth : ${e}`)
        return false
    }
}

export default auth