import axios from "axios"
import { server_url } from "./url"

const auth = async ()=>{
    let result=false,adminuser = false
    try {
        const session = localStorage.getItem("session")
        const expiration = localStorage.getItem("expiration")
        const now = new Date().getTime()
        if (!session) return {result,adminuser}
        if (expiration && now > expiration) {
            localStorage.removeItem("session")
            localStorage.removeItem("expiration")
            return {result,adminuser}
        }
        const res = await axios.get(`${server_url}/api/auth`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })

        const { data,admin } = await res.data

        console.log(data)

        return {
            result:data,
            adminuser:admin
        }
    } catch (e) {
        console.error(`auth : ${e}`)
        return {result,adminuser}
    }
}

export default auth