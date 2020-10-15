import { useEffect } from "react"
import { isAuth, login } from "../Login"

const PersistLogin = () => {

    useEffect(()=> {
        isAuth() && login();
        return() => {
            isAuth() && login();
        }
    })
}

export default PersistLogin
