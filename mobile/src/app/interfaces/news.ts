export interface News {
    id: number;
    title: string;
    slug: string;
    content: string;
    featured: boolean;
    cover_path: string;
    cover_path_url: string;
    source_date: string;
    channel_id: number;
    channel: Channel;
    source_url: string;
    meta: null;
    status: number;
    status_label: string;
    created_at: number;
    updated_at: number;
}

interface Channel {
    id: number;
    name: string;
}
