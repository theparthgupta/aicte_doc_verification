import { useMutation } from '@tanstack/react-query'
import {createClient} from '@supabase/supabase-js'
import { SERVER_URL } from '@/constants/API'
import { api } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

// Initialize Supabase client
const supabase = createClient(
    "https://lalhrowagdujluyyztsd.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhbGhyb3dhZ2R1amx1eXl6dHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMzczMjMsImV4cCI6MjA0ODkxMzMyM30.0WmOp9pbjZsQ4RFGeJmtQMatsJjrzKm3NoXDXu587BE"
)

interface UploadResult {
  downloadUrl: string
}

import CryptoJS from 'crypto-js'

const encrypt_file=(file:File)=>{
  const wordArray = CryptoJS.lib.WordArray.create(file);
  const encrypted = CryptoJS.AES.encrypt(wordArray, "ENCRYPT_KEY").toString();
  return encrypted
}

const decryptFile=async(fileURL:string)=>{
  try {
    // Fetch the encrypted file from the Supabase URL
    const response = await fetch(fileURL);
    if (!response.ok) {
      alert("Failed to fetch the file from the provided URL.");
      return;
    }

    const encryptedData = await response.text(); // Assuming the encrypted file is Base64 text

    // Decrypt the encrypted data
    const bytes = CryptoJS.AES.decrypt(encryptedData, "ENCRYPTED");
    const decryptedBase64 = bytes.toString(CryptoJS.enc.Utf8);

    // Convert Base64 to a Blob
    const binaryData = atob(decryptedBase64);
    const buffer = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      buffer[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([buffer], { type: "application/pdf" });

    // Create an object URL for the decrypted file
    return URL.createObjectURL(blob);
    
  } catch (error) {
    console.error("Decryption failed:", error);
    alert("Failed to decrypt the file. Check the key or file data.");
  }
}
export function useFileUpload() {
  return useMutation<UploadResult, Error, File>({
    mutationFn: async (file: File) => {
      const fileName = `${Date.now()}_${file.name}_${Math.random().toString(36)}`
      const { data, error } = await supabase.storage
        .from('sih')
        .upload(fileName, file)

      if (error) {
        throw new Error(error.message)
      }

      const { data: { publicUrl } } = supabase.storage
        .from('sih')
        .getPublicUrl(data.path)
      
      return { downloadUrl: publicUrl }
    },
    onError:(err)=>{
      console.log(JSON.stringify(err))
    }
  })
}

type VerifyBody = {
  uni_doc_uri: string,
  doc_id: string,
  formatId: string,
    uni_application_id:string,
}

export function useFileVerification() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (verifyBody: VerifyBody)=>{
      const req = await api.post(`${SERVER_URL}/institute/data/document_analysis`, verifyBody)
      return { data: req.data, verifyBody }; // Include verifyBody in the returned data
        },
    onSuccess: ({data,verifyBody}) => {
      navigate("/institute/error-fix", { state: { currentUniDoc: [data.data.currentUniDoc],application_id:verifyBody.uni_application_id } });
        },
        onError:(err)=>{
            alert(JSON.stringify(err.message))
        }
    })
}