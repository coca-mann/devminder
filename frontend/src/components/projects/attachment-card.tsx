
"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { users, type Attachment } from "@/lib/data";
import { format } from "date-fns";
import { FileArchive, FileImage, FileText, File as FileIcon, Download, Trash2 } from "lucide-react";

interface AttachmentCardProps {
    attachment: Attachment;
    onDelete: (attachmentId: string) => void;
}

const getFileIcon = (fileType?: Attachment['fileType']) => {
    switch (fileType) {
        case 'image':
            return <FileImage className="h-10 w-10 text-muted-foreground" />;
        case 'pdf':
            return <FileText className="h-10 w-10 text-red-500" />;
        case 'document':
            return <FileText className="h-10 w-10 text-blue-500" />;
        case 'archive':
            return <FileArchive className="h-10 w-10 text-yellow-500" />;
        default:
            return <FileIcon className="h-10 w-10 text-muted-foreground" />;
    }
}

export default function AttachmentCard({ attachment, onDelete }: AttachmentCardProps) {
    const uploader = users.find(u => u.id === attachment.uploaderId);

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-row items-center gap-4 pb-2">
                {getFileIcon(attachment.fileType)}
                <div className="flex-1 overflow-hidden">
                    <CardTitle className="text-base truncate" title={attachment.fileName}>
                        {attachment.fileName}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="text-sm text-muted-foreground space-y-1">
                    <p>Tamanho: {attachment.size}</p>
                    <p>Enviado em: {format(new Date(attachment.timestamp), "dd/MM/yyyy")}</p>
                </div>
                {uploader && (
                    <div className="flex items-center gap-2 pt-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={uploader.avatarUrl} alt={uploader.name} />
                            <AvatarFallback>{uploader.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{uploader.name}</span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <a href={attachment.url} download>
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                    </a>
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(attachment.id)}>
                    <Trash2 className="h-4 w-4" />
                     <span className="sr-only">Apagar</span>
                </Button>
            </CardFooter>
        </Card>
    );
}
