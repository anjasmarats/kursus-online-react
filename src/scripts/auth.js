import axios from "axios"
import { server_url } from "./url"

const auth = async ()=>{
    try {
        const session = localStorage.getItem('session')
        if (!session) return false
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