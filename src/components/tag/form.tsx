import { useCollectionContext } from "@/components/collection/context"
import ColorPicker from "@/components/color-picker"
import IconPicker from "@/components/icon-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import * as colors from "@/lib/colors"
import { randomArrayElement } from "@/lib/utils"
import { type Tag, TagSchema } from "@/proto/models/v1/models_pb"
import { clone, create } from "@bufbuild/protobuf"
import { useNavigate } from "@tanstack/react-router"
import { AlertTriangle, Check, Loader2, X } from "lucide-react"
import React from "react"
import { toast } from "sonner"

import { TagView } from "./view"

interface P {
    value?: Tag
    onChange: (t: Tag) => Promise<unknown>
    onCancel?: () => void
}

const empty = (): Tag =>
    create(TagSchema, {
        icon: "Tag",
        color: randomArrayElement(colors.all),
    })

export const TagForm: React.FC<P> = ({ value, onChange, onCancel }) => {
    const { tagSet } = useCollectionContext()

    const [loading, setLoading] = React.useState(false)
    const [tag, setTag] = React.useState<Tag>(value ?? empty())
    const navigate = useNavigate()

    const update = (fn: (t: Tag) => void) => {
        const next = clone(TagSchema, tag)
        fn(next)
        setTag(next)
    }

    const valid = !!tag.name && (value !== undefined || !tagSet.has(tag.name))

    const handleSubmit = () => {
        setLoading(true)
        onChange(tag)
            .then(async () => {
                const icon = <Check size={16} className="text-emerald-600" />
                if (value === undefined) {
                    toast.success("New tag created", {
                        description: tag.name,
                        icon,
                    })
                    await navigate({ to: "/tags" })
                } else {
                    toast.success("Tag updated", { description: tag.name, icon })
                }
            })
            .catch((e: Error) => {
                toast.error(value === undefined ? "Failed to start a habit" : "Update failed", {
                    description: e.message,
                })
            })
            .finally(() => setLoading(false))
    }

    return (
        <div data-testid="tag-form" className="flex flex-col gap-5 px-4">
            {value === undefined && (
                <div className="flex flex-col gap-2">
                    <Label aria-required>Name *</Label>
                    <Input
                        autoFocus
                        disabled={loading}
                        value={tag.name}
                        onChange={(e) => update((t) => (t.name = e.target.value))}
                    />
                    {tagSet.has(tag.name) && (
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                            <AlertTriangle size={14} /> Tag already exists!
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <Label>Color</Label>
                <ColorPicker
                    disabled={loading}
                    active={tag.color}
                    onPick={(color) => update((t) => (t.color = color))}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Icon</Label>
                <IconPicker
                    disabled={loading}
                    active={tag.icon}
                    color={tag.color}
                    onPick={(icon) => update((t) => (t.icon = icon))}
                />
            </div>

            <Separator />

            <div className="flex justify-center w-full">
                <TagView name={tag.name} tag={tag} />
            </div>

            <Separator />

            <div className="flex flex-col items-center gap-2 justify-center">
                <Button
                    size="lg"
                    disabled={!valid || loading}
                    onClick={handleSubmit}
                    className="w-full max-w-lg"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Check />}
                    {value === undefined ? "Create tag" : "Save"}
                </Button>

                {onCancel !== undefined && (
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onCancel}
                        className="w-full max-w-lg"
                    >
                        <X />
                        Cancel
                    </Button>
                )}
            </div>
        </div>
    )
}
