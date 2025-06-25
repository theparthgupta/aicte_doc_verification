import { SERVER_URL } from "@/constants/API"
import { api } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

const useInstituteValidation=()=>{
    return useMutation({
        mutationFn:async(image_url:string)=>{
            const resp = await api.post(`${SERVER_URL}/institute/data/validate_image`,{
                url:image_url
            })
            console.log("donneee")
            return resp.data
        }
    })
}

const useBlueprintValidation=()=>{
    return useMutation({
        mutationFn:async(image_url:string)=>{
            const resp = await api.post(`${SERVER_URL}/institute/data/validate_blueprint`,{
                url:image_url
            })
            console.log("donneee")
            return resp.data
        }
    })
}

export {useInstituteValidation, useBlueprintValidation}