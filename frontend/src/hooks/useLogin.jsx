import { setLogin } from "../state";
import { useLoginUserMutation } from "../state/api";
import { useDispatch } from "react-redux";
// import Cookies from 'js-cookie';

export const useLogin = () => {
    const dispatch = useDispatch();
    const [ loginUser , { isLoading, error } ] = useLoginUserMutation()
    let dentist = ""
    const login = async (email, password) => {
        const response = await loginUser({email,password}).unwrap()
        if(response?.user.role == "staff") {
            dentist = response?.user.dentist
        } else {
            dentist = response?.user._id
        }
        // Cookies.set('authToken', response?.token, { expires: 7 });
        dispatch(setLogin({
            user: response?.user,
            token: response?.token,
            dentist: dentist
        }))
    }
    return { login, isLoading, error }
}