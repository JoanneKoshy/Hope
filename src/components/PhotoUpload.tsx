import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth, storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { Progress } from "@/components/ui/progress";

interface PhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  photoUrl?: string;
  onPhotoRemoved?: () => void;
}

export const PhotoUpload = ({ onPhotoUploaded, photoUrl, onPhotoRemoved }: PhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const user = auth.currentUser;
      console.log('Current user:', user?.uid);
      
      if (!user) {
        throw new Error("Please sign in to upload photos");
      }

      // Compress image for faster upload
      console.log('Starting image compression...');
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
        fileType: file.type,
        initialQuality: 0.8,
      };

      const compressedFile = await imageCompression(file, options);
      console.log('Image compressed successfully');

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `memory-photos/${user.uid}/${Date.now()}.${fileExt}`;
      console.log('Uploading to:', fileName);

      // Upload to Firebase Storage with progress tracking
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
          console.log('Upload progress:', Math.round(progress) + '%');
        },
        (error) => {
          console.error('Firebase Storage error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          
          let errorMessage = error.message;
          if (error.code === 'storage/unauthorized') {
            errorMessage = 'Storage access denied. Please configure Firebase Storage rules to allow uploads.';
          }
          
          toast({
            title: "Upload failed",
            description: errorMessage,
            variant: "destructive",
          });
          
          setUploading(false);
          setUploadProgress(0);
        },
        async () => {
          try {
            // Upload completed successfully
            console.log('Upload complete, getting download URL...');
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Download URL obtained:', downloadURL);
            
            onPhotoUploaded(downloadURL);
            
            toast({
              title: "Photo uploaded!",
              description: "Your photo has been added to the memory",
            });
            
            setUploading(false);
            setUploadProgress(0);
          } catch (urlError: any) {
            console.error('Error getting download URL:', urlError);
            toast({
              title: "Upload failed",
              description: "Could not get photo URL: " + urlError.message,
              variant: "destructive",
            });
            setUploading(false);
            setUploadProgress(0);
          }
        }
      );
    } catch (error: any) {
      console.error('Photo upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading",
        variant: "destructive",
      });
      setUploading(false);
      setUploadProgress(0);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = () => {
    if (onPhotoRemoved) {
      onPhotoRemoved();
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      
      {photoUrl ? (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <img 
            src={photoUrl} 
            alt="Memory photo" 
            className="w-full h-48 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemovePhoto}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Add Photo
              </>
            )}
          </Button>
          {uploading && (
            <Progress value={uploadProgress} className="w-full" />
          )}
        </div>
      )}
    </div>
  );
};