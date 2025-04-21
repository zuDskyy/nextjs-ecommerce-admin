"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary"
import { ImagePlus, Trash } from "lucide-react";

interface ImageUploadProps {
    multiple?: boolean;
    disabled?: boolean;
    onChange: (urls: string | string[]) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value,
    multiple = false

}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true) }, [])

    let imgUrls = [];
    const onUpload = (result: any) => {
        const newUrls = result.info.secure_url;
        if (multiple) {
            imgUrls.push(newUrls);
            onChange(imgUrls);
        } else {
            onChange(newUrls);
        }
    };

    if (!isMounted) return null;

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" size="icon" variant="destructive" onClick={() => onRemove(url)}>
                                <Trash className="h-4 w-4" />
                            </Button>

                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget options={{
                cropping: true,
                croppingAspectRatio: 938 / 400,
                showSkipCropButton: false,
            }} onSuccess={onUpload} uploadPreset="j34231fgcv">
                {({ open }) => {
                    const onClick = () => {
                        open();
                    }
                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="secondary"
                            onClick={onClick}
                        >
                            <ImagePlus className="w-4 h-4 mr-2" />
                            Upload an Image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}


export default ImageUpload;