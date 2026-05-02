import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';

export default function CreateAnnouncementModal({ showCreate, setShowCreate, group_id }) {

    const queryClient = useQueryClient();

    const { control, handleSubmit, setError, reset } = useForm({
        mode: "onChange",
        defaultValues: {
            title: "",
            body: "",
            pinned: false,
            group_id: group_id
        },
    })

    const rules = {
        title: {
            required: "Title is required",
            minLength: {
                value: 3,
                message: "Title must be at least 3 characters"
            },
            maxLength: {
                value: 100,
                message: "Title must be at most 100 characters"
            },
            validate: (value) =>
                value?.trim().length > 0 || "Title cannot be only spaces"
        },
        body: {
            maxLength: {
                value: 2000,
                message: "Body must be at most 2000 characters"
            },
            validate: (value) =>
                value === "" || value.trim().length > 0 || "Body cannot be only spaces"
        },
    }

    const {
        mutate,
        isPending,
        isError,
        error
    } = useMutation({
        mutationFn: async (newData) => {
            console.log(newData)
            const { data, error } = await supabase
                .from('announcements')
                .insert([newData])
                .select()
                .single();
            if (error) throw new Error(error.message)
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['announcements', group_id], (old = []) => [...old, data]);
            reset()
            setShowCreate(false)
        }
    });

    return (
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>New Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Title</Label>

                        <Controller
                            control={control}
                            name="title"
                            rules={rules.title}
                            render={({ field: { onChange, value }, fieldState }) => (
                                <>
                                    <Input
                                        id="title"
                                        type="text"
                                        placeholder="Announcement title"
                                        value={value}
                                        onChange={onChange}
                                        disabled={isPending}
                                    />
                                    <p className="text-red-800 text-sm">
                                        {fieldState.error?.message}
                                    </p>
                                </>
                            )}
                        />

                    </div>
                    <div className="space-y-2">
                        <Label>Content</Label>

                        <Controller
                            control={control}
                            name="body"
                            rules={rules.body}
                            render={({ field: { onChange, value }, fieldState }) => (
                                <>
                                    <Textarea
                                        id="body"
                                        placeholder="Write your announcement..."
                                        value={value}
                                        onChange={onChange}
                                        className="h-32"
                                        disabled={isPending}
                                    />
                                    <p className="text-red-800 text-sm">
                                        {fieldState.error?.message}
                                    </p>
                                </>
                            )}
                        />

                    </div>
                    <div className="flex items-center gap-2">



                        <Controller
                            control={control}
                            name="pinned"
                            rules={rules.pinned}
                            render={({ field: { onChange, value }, fieldState }) => (
                                <>
                                    <input
                                        id="pinned"
                                        type="checkbox"
                                        checked={value}
                                        onChange={onChange}
                                        className="rounded"
                                        disabled={isPending}
                                    />
                                    <p className="text-red-800 text-sm">
                                        {fieldState.error?.message}
                                    </p>
                                </>
                            )}
                        />




                        <Label htmlFor="pinned" className="cursor-pointer">
                            Pin this announcement
                        </Label>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                reset()
                                setShowCreate(false)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-slate-900 hover:bg-slate-800"
                            onClick={() => handleSubmit(mutate)()}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                'Post'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    );
}