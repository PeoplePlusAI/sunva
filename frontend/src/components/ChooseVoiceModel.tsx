import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useSession} from "@/lib/context/sessionContext";

const VOICE_MODEL: ('male' | 'female')[] = ['male', 'female'];

export default function ChooseVoiceModel() {
    const [session, setSession] = useSession();

    return <Select value={session?.voice_model}
                   onValueChange={(e: 'male' | 'female') => setSession({...session!, voice_model: e})}
    >
        <SelectTrigger className="w-[100px] bg-[#EDEDED]">
            <SelectValue defaultValue={session?.voice_model || 'male'}/>
        </SelectTrigger>
        <SelectContent>
            {VOICE_MODEL.map((model) => {
                return <SelectItem key={model} value={model}>
                    {model}
                </SelectItem>
            })}
        </SelectContent>
    </Select>
}