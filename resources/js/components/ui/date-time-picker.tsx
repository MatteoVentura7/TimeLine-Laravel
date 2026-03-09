import { useState } from "react"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils"

interface DateTimePickerProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    placeholder?: string
    minDate?: string
}

export default function DateTimePicker({
    value,
    onChange,
    disabled = false,
    placeholder = "Seleziona una data",
    minDate,
}: DateTimePickerProps) {

    const [time, setTime] = useState(() => {
        if (!value) return "12:00"

        const date = new Date(value)

        return `${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
        ).padStart(2, "0")}`
    })

    const parseDate = (dateString: string): Date | undefined => {
        if (!dateString) return undefined
        return new Date(dateString)
    }

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) {
            onChange("")
            return
        }

        const [hours, minutes] = time.split(":")

        selectedDate.setHours(parseInt(hours), parseInt(minutes))

        onChange(selectedDate.toISOString().slice(0, 16))
    }

    const handleTimeChange = (newTime: string) => {
        setTime(newTime)

        if (value) {
            const date = new Date(value)

            const [hours, minutes] = newTime.split(":")

            date.setHours(parseInt(hours), parseInt(minutes))

            onChange(date.toISOString().slice(0, 16))
        }
    }

    const displayDate = value ? parseDate(value) : undefined
    const minDateObj = minDate ? parseDate(minDate) : undefined

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        disabled && "cursor-not-allowed opacity-50"
                    )}
                >
                    <CalendarIcon className=" h-4 w-4" />

                   {value ? (
    format(displayDate!, "dd/MM/yyyy")
) : (
    <span>{placeholder}</span>
)}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
                <div className="space-y-3 p-3">

                    <Calendar
                        mode="single"
                        selected={displayDate}
                        onSelect={handleDateSelect}
                        autoFocus
                        locale={it}
                        disabled={
                            disabled
                                ? true
                                : minDateObj
                                ? { before: minDateObj }
                                : false
                        }
                    />

                    <div className="space-y-2 border-t pt-3">
                        <Label className="text-sm font-medium">
                            Ora
                        </Label>

                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />

                            <Input
                                type="time"
                                value={time}
                                onChange={(e) =>
                                    handleTimeChange(e.target.value)
                                }
                                className="flex-1"
                                disabled={disabled}
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}