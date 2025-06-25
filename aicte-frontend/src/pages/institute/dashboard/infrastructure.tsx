import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFileUpload } from '@/hooks/useFileUpload'
import { useInstituteValidation } from '@/hooks/useInstituteValidation'
import exif from 'exif-js'

const ExifDataDialog = ({ file, onClose, onUpload }) => {
  const [exifData, setExifData] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState(null)
  const [simulatedArea, setSimulatedArea] = useState(0)

  useEffect(() => {
    if (file) {
      exif.getData(file, function() {
        const date = exif.getTag(this, "DateTimeOriginal")
        const lat = exif.getTag(this, "GPSLatitude")
        const long = exif.getTag(this, "GPSLongitude")
        
        setExifData({
          date: date ? new Date(date).toLocaleString() : null,
          location: lat && long ? `${lat[0]}°${lat[1]}'${lat[2]}"N, ${long[0]}°${long[1]}'${long[2]}"E` : null
        })
      })
    }
  }, [file])

  const handleUpload = async () => {
    setIsAnalyzing(true)
    // Simulating blueprint analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    const area = Math.random() * 500 // Random area between 0 and 500
    setSimulatedArea(area)
    setVerificationStatus(area > 300 ? 'verified' : 'not verified')
    setIsAnalyzing(false)
    onUpload(area > 300)
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Blueprint EXIF Data</DialogTitle>
      </DialogHeader>
      {exifData ? (
        <>
          <div>
            <p><strong>Capture Date:</strong> {exifData.date || 'Not available'}</p>
            <p><strong>Location:</strong> {exifData.location || 'Not available'}</p>
          </div>
          {!exifData.date || !exifData.location ? (
            <p className="text-red-500">Cannot upload the blueprint. Missing EXIF data.</p>
          ) : (
            <>
              {!verificationStatus ? (
                <Button onClick={handleUpload} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Upload and Analyze'
                  )}
                </Button>
              ) : (
                <p className={`text-${verificationStatus === 'verified' ? 'green' : 'red'}-500`}>
                  Blueprint {verificationStatus}. Area: {Math.round(simulatedArea)} sq ft.
                </p>
              )}
            </>
          )}
        </>
      ) : (
        <p>Loading EXIF data...</p>
      )}
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  )
}

const rules = [
  "At least 5 institute images must be uploaded (classrooms, corridors, etc.).",
  "All images must be clear and recent (not older than 3 months).",
  "Blueprints must include layouts for classrooms, corridors, washrooms, and other key areas.",
  "All files (images and blueprints) must be in PNG format.",
  "File size should not exceed 5MB per image or blueprint.",
  "Blueprints must clearly label all areas and include dimensions.",
]

export default function AICTEVerificationPage() {
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentFile, setCurrentFile] = useState(null)
  const [selectedType, setSelectedType] = useState('')

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        setCurrentFile(file)
        setDialogOpen(true)
      } else {
        setError('Please upload only PNG or JPEG files.')
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        setCurrentFile(file)
        setDialogOpen(true)
      } else {
        setError('Please upload only PNG or JPEG files.')
      }
    }
  }

  const addFile = (isVerified = true) => {
    const newFile = { file: currentFile, type: selectedType, verified: isVerified }
    const updatedFiles = [...files, newFile]
    const imageCount = updatedFiles.filter(f => f.type === 'institute_image').length
    const blueprintCount = updatedFiles.filter(f => f.type === 'blueprint').length
    
    if (imageCount < 5) {
      setError('Please upload at least 5 institute images.')
    } else if (blueprintCount === 0) {
      setError('Please upload at least one blueprint.')
    } else {
      setError(null)
    }

    setFiles(updatedFiles)
    setDialogOpen(false)
    setSelectedType('')
    setCurrentFile(null)
  }

  const {mutateAsync, isPending, data} = useFileUpload()
  const {mutateAsync:validate, isPending:loading, data:is_validated} = useInstituteValidation()

  const handleSubmit = (e) => {
    e.preventDefault()
    let blueprints = files.filter(i => i.type === "blueprint").map(i => i.file)
    let institute = files.filter(i => i.type === "institute_image").map(i => i.file)

    blueprints.forEach(async (img) => {
      console.log(img)
      const resp = await mutateAsync(img)
      alert(resp?.downloadUrl)
      if (resp?.downloadUrl) {
        const _r = await validate(resp?.downloadUrl)
        console.log(_r)
      }
    })

    institute.forEach(async (img) => {
      console.log(img)
      const resp = await mutateAsync(img)
      alert(resp?.downloadUrl)
      if (resp?.downloadUrl) {
        const _r = await validate(resp?.downloadUrl)
        console.log(_r)
      }
    })
  }

  const renderFiles = () => {
    return files.map((file, index) => (
      <motion.div
        key={index}
        className="relative w-full h-48"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <img
          src={URL.createObjectURL(file.file)}
          alt={`${file.type} ${index + 1}`}
          className="w-full h-full object-cover rounded-md"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
          {file.type === 'institute_image' ? 'Institute Image' : 'Blueprint'}
        </div>
        {file.type === 'blueprint' && (
          <div className={`absolute bottom-2 right-2 px-2 py-1 rounded ${file.verified ? 'bg-green-500' : 'bg-red-500'}`}>
            {file.verified ? 'Verified' : 'Not Verified'}
          </div>
        )}
      </motion.div>
    ))
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">AICTE Infrastructure Verification</h1>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Verification Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {rules.map((rule, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {rule}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Institute Images and Blueprints</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className={`mt-2 p-4 border-2 border-dashed rounded-md ${
                dragOver ? 'border-primary' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Input
                id="fileUpload"
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label htmlFor="fileUpload" className="cursor-pointer block text-center">
                {files.length > 0 ? `${files.length} files selected` : 'Click or drag to upload images and blueprints'}
              </Label>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Upload at least 5 institute images and blueprints of classrooms, corridors, washrooms, etc. (PNG or JPEG format only)
              </p>
            </motion.div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {renderFiles()}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">Submit Verification</Button>
      </motion.form>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {currentFile && selectedType === 'blueprint' ? (
          <ExifDataDialog
            file={currentFile}
            onClose={() => setDialogOpen(false)}
            onUpload={(isVerified) => addFile(isVerified)}
          />
        ) : (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Image Type</DialogTitle>
            </DialogHeader>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select image type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="institute_image">Institute Image</SelectItem>
                <SelectItem value="blueprint">Blueprint</SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button onClick={() => addFile()} disabled={!selectedType}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

