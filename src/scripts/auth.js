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
    } catch (error) {
        if (error.response) {
            const data = error.response.data.data
            return data
        }
        console.error(`auth : ${error}`)
        return false
    }
}

export default auth