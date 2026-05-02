import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Megaphone, Pin, Loader2 } from 'lucide-react';
import { useOutletContext } from 'react-router';
import { supabase } from '@/lib/supabase';
import CreateAnnouncementModal from '@/components/modals/CreateAnnouncementModal';
import EditAnnouncementModal from '@/components/modals/EditAnnouncementModal';
import { useParams } from 'react-router';

export default function GroupAnnouncements() {

    const { groupId } = useParams();

    const { setHeaderContent, group, canManage } = useOutletContext()

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false)
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)

    const { data: announcements = [], isLoading, error } = useQuery({
        queryKey: ['announcements', groupId],
        staleTime: Infinity,
        gcTime: Infinity,
        enabled: !!groupId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .eq('group_id', groupId)
            if (error) throw new Error(error.message)
            return data
        }
    })

    const pinnedAnnouncements = announcements?.filter(a => a.pinned);
    const regularAnnouncements = announcements?.filter(a => !a.pinned);

    const headerContent = (
        <div className="flex items-center justify-between w-full px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-slate-400" />
                <h1 className="font-semibold text-lg">Announcements</h1>
            </div>

            <div className="flex items-center gap-2">
                {canManage && (
                    <Button
                        onClick={() => setShowCreate(true)}
                        size="sm"
                        className="bg-slate-900 hover:bg-slate-800 gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">New</span>
                    </Button>
                )}
            </div>
        </div>
    )

    useEffect(() => {
        setHeaderContent(headerContent)
    }, [])

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 h-full overflow-auto min-w-0 pb-24 sm:pb-24 lg:pb-24">
            <div className="max-w-3xl mx-auto space-y-6">
                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <Megaphone className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No announcements yet</h3>
                        <p className="text-slate-500 mb-4">Important updates will appear here</p>
                    </div>
                ) : (
                    <>
                        {pinnedAnnouncements.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Pin className="w-4 h-4" />
                                    Pinned
                                </h2>
                                {pinnedAnnouncements.map((announcement) => (
                                    <Card key={announcement.id} className="border-2 border-amber-200 bg-amber-50/50">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg text-slate-900 mb-1">
                                                        {announcement.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-500">
                                                        • {format(new Date(announcement.created_at), 'MMM d, yyyy')}
                                                    </p>
                                                </div>
                                                <Badge className="bg-amber-100 text-amber-700 border-amber-300">
                                                    <Pin className="w-3 h-3 mr-1" />
                                                    Pinned
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <p className="text-slate-700 whitespace-pre-wrap">
                                                    {announcement.body}
                                                </p>
                                                {canManage && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="p-1 hover:bg-amber-200/50"
                                                        onClick={() => {
                                                            setSelectedAnnouncement(announcement)
                                                            setShowEdit(true)
                                                        }}
                                                    >
                                                        <Pencil className="w-3 h-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {regularAnnouncements.length > 0 && (
                            <div className="space-y-4">
                                {pinnedAnnouncements.length > 0 && (
                                    <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                                        Recent
                                    </h2>
                                )}
                                {regularAnnouncements.map((announcement) => (
                                    <Card key={announcement.id} className="border-0 shadow-sm">
                                        <CardContent className="p-6">
                                            <h3 className="font-semibold text-lg text-slate-900 mb-1">
                                                {announcement.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 mb-4">
                                                • {format(new Date(announcement.created_at), 'MMM d, yyyy')}
                                            </p>
                                            <div className="flex items-start justify-between gap-4">
                                                <p className="text-slate-700 whitespace-pre-wrap">
                                                    {announcement.body}
                                                </p>
                                                {canManage && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="p-1"
                                                        onClick={() => {
                                                            setSelectedAnnouncement(announcement)
                                                            setShowEdit(true)
                                                        }}
                                                    >
                                                        <Pencil className="w-3 h-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <CreateAnnouncementModal showCreate={showCreate} setShowCreate={setShowCreate} group_id={groupId} />

            <EditAnnouncementModal showEdit={showEdit} setShowEdit={setShowEdit} selectedAnnouncement={selectedAnnouncement} />

        </main>
    );
}