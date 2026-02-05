import UploadForm from './upload-form'

export default function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Upload Music</h1>
      </div>
      <UploadForm />
    </div>
  )
}
