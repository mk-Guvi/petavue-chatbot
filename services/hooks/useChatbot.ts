import { useGlobalData } from "@/redux/selectors"
import { ChatBotStateT, updateChatbotData } from "@/redux/slices"
import { useDispatch } from "react-redux"

export const useChatbot=()=>{
const {chatbot}=useGlobalData()
const dispatch=useDispatch()
const updateChatbotDetails=(payload:Partial<ChatBotStateT>)=>{
dispatch(updateChatbotData(payload))
}
return {
chatbot,
updateChatbotDetails
}
}