import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

import {StateSetter} from "@/lib/types";

export function Dialog(
    {title, acceptText, rejectText, open, setOpen, onAccept, onReject, children}:
        {
            title: string,
            acceptText: string,
            rejectText: string,
            open: boolean,
            setOpen: StateSetter<boolean>,
            onAccept?: () => void,
            onReject?: () => void,
            children?: any
        }) {
    return <AlertDialog open={open} onOpenChange={e => setOpen(e)}>

        <AlertDialogContent className="w-[80%] rounded-lg inline-block">
            <AlertDialogHeader>
                <AlertDialogTitle className="w-full text-left font-normal text-sm">
                    {title}
                </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="w-full">
            {children}
            </div>
            <AlertDialogFooter className="flex w-full flex-row items-center justify-end gap-4">
                <AlertDialogCancel className="bg-transparent w-fit h-fit" onClick={onReject}>{rejectText}</AlertDialogCancel>
                <AlertDialogAction className="bg-[#00956b] w-fit h-fit" onClick={onAccept}>{acceptText}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}