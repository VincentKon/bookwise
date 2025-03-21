"use client";
import config from "@/lib/config";
import ImageKit from "imagekit";
import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { token, expire, signature };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

interface Props {
  type: "IMAGE" | "VIDEO";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);
  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const onError = (error: any) => {
    console.log(error);
    toast.error("Upload failed, please try again.");
  };
  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);
    toast.success(
      `${type === "IMAGE" ? "Image" : "Video"} uploaded successfully: ${
        res.filePath
      }`
    );
  };

  const onValidate = (file: File) => {
    if (type === "IMAGE") {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(
          "File size is too large, please upload less than 20MB in size"
        );
        return false;
      }
    } else if (type === "VIDEO") {
      if (file.size > 50 * 1024 * 1024) {
        toast.error(
          "File size is too large, please upload less than 50MB in size"
        );
        return false;
      }
    }
    return true;
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({ loaded, total }) => {
          const percent = Math.round((loaded / total) * 100);
          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
      ></IKUpload>
      <Button
        className={cn("upload-btn", styles.button)}
        onClick={(e) => {
          e.preventDefault();
          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image
          src={"/icons/upload.svg"}
          alt="Upload"
          width={20}
          height={20}
          className="object-contain"
        ></Image>
        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>
        {file && (
          <p className={cn("upload-filename", styles.text)}>{file.filePath}</p>
        )}
        {/* {file && <p className="upload-filename">{file.filePath}</p>} */}
      </Button>
      {progress > 0 && progress !== 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}
      {file &&
        (type === "IMAGE" ? (
          <IKImage
            alt={file.filePath || "Filepath is undefined"}
            path={file.filePath || "Filepath is undefined"}
            width={500}
            height={300}
          ></IKImage>
        ) : type === "VIDEO" ? (
          <IKVideo
            path={file.filePath || "Filepath is undefined"}
            controls={true}
            className="h-96 w-full rounded-xl"
          ></IKVideo>
        ) : null)}
    </ImageKitProvider>
  );
};

export default FileUpload;
