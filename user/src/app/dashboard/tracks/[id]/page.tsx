import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import UploadForm from '../../upload/upload-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PageProps {
    params: { id: string }
}

export default async function EditTrackPage({ params }: PageProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { id } = await params

    const { data: track, error } = await supabase
        .from('tracks')
        .select('*, albums(cover_art_url, release_date)')
        .eq('id', id)
        .eq('artist_id', user.id)
        .single()

    if (error || !track) {
        notFound()
    }

    // Only allow editing if draft or rejected
    if (track.status !== 'draft' && track.status !== 'rejected') {
        return (
            <div className="p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Cannot Edit Track</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>This track is {track.status} and cannot be edited. Please contact support if you need changes.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Edit Track: {track.title}</h1>
            <UploadForm initialData={track} />
        </div>
    )
}
