'use client';

import { Link as LinkIcon, CheckCircle, XCircle, Trash2 } from 'lucide-react';


interface BitrixIntegration {
    id: string;
    bot: string;
    bitrix_bot_id: number;
    client_id: string;
    portal_domain: string;
    type: string;
    is_registered: boolean;
    created_at: string;
    updated_at: string;
}

interface BitrixIntegrationCardProps {
    integration: BitrixIntegration;
    onDelete: () => void;
}

export function BitrixIntegrationCard({ integration, onDelete }: BitrixIntegrationCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                        <LinkIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-card-foreground">
                            {integration.type} Integration
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            Created {formatDate(integration.created_at)}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onDelete}
                    className="rounded-full border border-red-200 p-1.5 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950 transition-colors"
                    aria-label="Delete integration"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="mt-4 space-y-3">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                    {integration.is_registered ? (
                        <>
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                Registered
                            </span>
                        </>
                    ) : (
                        <>
                            <XCircle className="h-4 w-4 text-amber-600" />
                            <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                                Not Registered
                            </span>
                        </>
                    )}
                </div>

                {/* Integration Details */}
                <div className="space-y-2 rounded-lg bg-muted/50 p-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Portal Domain:</span>
                        <span className="font-medium text-card-foreground">{integration.portal_domain}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Bitrix Bot ID:</span>
                        <span className="font-mono text-xs text-card-foreground">{integration.bitrix_bot_id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Client ID:</span>
                        <span className="font-mono text-xs text-card-foreground truncate max-w-[200px]" title={integration.client_id}>
                            {integration.client_id}
                        </span>
                    </div>
                </div>

                {/* Updated Date */}
                <p className="text-xs text-muted-foreground">
                    Last updated: {formatDate(integration.updated_at)}
                </p>
            </div>
        </div>
    );
}
