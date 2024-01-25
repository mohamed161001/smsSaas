import { setLogin } from "../state";
import { useLoginUserMutation } from "../state/api";
import { useDispatch } from "react-redux";

export const useLogin = () => {
    const dispatch = useDispatch();
    const [ loginUser , { isLoading, error } ] = useLoginUserMutation()
    let client = ""
    const login = async (email, password) => {
        const response = await loginUser({email,password}).unwrap()
        if(response?.user.role == "staff") {
            client = response?.user.client
        } else {
            client = response?.user._id
        }
        // Cookies.set('authToken', response?.token, { expires: 7 });
        dispatch(setLogin({
            user: response?.user,
            token: response?.token,
            client: client
        }))
    }
    return { login, isLoading, error }
}