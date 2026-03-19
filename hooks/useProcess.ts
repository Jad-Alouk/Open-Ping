// Used for managing laoding, error, and success states in one reducer
import { ActionDispatch, useReducer } from "react"


type ReducerState = { loading: boolean, success: string | null, fail: string | null }
type ReducerAction = { type: "loading" | "success" | "fail" | "clear", message: string | null }
type HookReturnType = [ReducerState, ActionDispatch<[action: ReducerAction]>, () => void]

const reducer = (state: ReducerState, action: ReducerAction): ReducerState => {
    const t = action.type
    const m = action.message

    switch (t) {
        case "loading":
            return { loading: true, success: null, fail: null }

        case "success":
            return { loading: false, success: m, fail: null }

        case "fail":
            return { loading: false, success: null, fail: m }

        case "clear":
            return { loading: false, success: null, fail: null }

        default:
            console.error("Unknown action type!")
            return state
    }
}

export const useProcess = (
    initial: ReducerState = {
        loading: false,
        success: null,
        fail: null
    }
): HookReturnType => {

    const [state, dispatch] = useReducer(reducer, initial)

    const clear = () => dispatch({ type: "clear", message: null })

    return [state, dispatch, clear]
}