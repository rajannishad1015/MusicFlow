import { createClient } from '@/utils/supabase/server'

export async function logAdminAction(action: string, targetType: string, targetId: string, details?: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        await supabase.from('admin_activity_logs').insert({
            admin_id: user.id,
            action,
            target_type: targetType,
            target_id: targetId,
            details,
            // ip_address could be fetched from headers() if needed, but keeping it simple
        })
    }
}
