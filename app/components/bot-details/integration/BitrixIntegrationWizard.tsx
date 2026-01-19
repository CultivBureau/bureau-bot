'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { bitrixService } from '../../../services/bitrix';
import { CopyButton } from '../../shared/CopyButton';

interface BitrixIntegrationWizardProps {
    isOpen: boolean;
    onClose: () => void;
    botId: string;
    botName: string;
}

const HANDLER_PATH = 'https://bot-linker-backend.cultivbureau.com/';

export function BitrixIntegrationWizard({
    isOpen,
    onClose,
    botId,
    botName: initialBotName,
}: BitrixIntegrationWizardProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form states
    const [botName, setBotName] = useState(initialBotName || '');
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [portalLink, setPortalLink] = useState('');
    const [webhookUrl, setWebhookUrl] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [integrationId, setIntegrationId] = useState('');

    const totalSteps = 11;

    const handleNext = async () => {
        setError('');

        // Step 5: Generate integration link
        if (currentStep === 5) {
            if (!clientId.trim() || !clientSecret.trim() || !portalLink.trim()) {
                setError('Please fill in all fields');
                return;
            }

            setLoading(true);
            try {
                const response = await bitrixService.generateIntegrationLink({
                    client_id: clientId,
                    client_secret: clientSecret,
                    portal_domain: portalLink,
                    bot_id: botId,
                    type: 'BITRIX',
                });

                setWebhookUrl(response.webhook_url);
                setIntegrationId(response.integration_id);
                setCurrentStep(currentStep + 1);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to generate integration link');
            } finally {
                setLoading(false);
            }
            return;
        }

        // Step 11: Save tokens and register bot
        if (currentStep === 11) {
            if (!accessToken.trim() || !refreshToken.trim()) {
                setError('Please fill in both access token and refresh token');
                return;
            }

            const savedIntegrationId = integrationId || bitrixService.getIntegrationIdFromCookie();
            if (!savedIntegrationId) {
                setError('Integration ID not found. Please restart the process.');
                return;
            }

            setLoading(true);
            try {
                // First save tokens
                await bitrixService.saveTokens({
                    integration_id: savedIntegrationId,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                });

                // Then register bot
                await bitrixService.registerBot({
                    bot_id: botId,
                });

                // Success! Close modal
                onClose();
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to save tokens and register bot');
            } finally {
                setLoading(false);
            }
            return;
        }

        // Regular navigation for other steps
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setError('');
            setCurrentStep(currentStep - 1);
        }
    };

    const canProceed = () => {
        if (currentStep === 3) {
            return botName.trim() !== '';
        }
        if (currentStep === 5) {
            return clientId.trim() !== '' && clientSecret.trim() !== '' && portalLink.trim() !== '';
        }
        if (currentStep === 11) {
            return accessToken.trim() !== '' && refreshToken.trim() !== '';
        }
        return true;
    };

    const getStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">Step 1: Open Developer Resources</h3>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                                <li>Open Developer Resources</li>
                                <li>Scroll down to "Other" and select it</li>
                            </ol>
                        </div>
                        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                            <Image
                                src="/step1.jpeg"
                                alt="Step 1: Developer Resources"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">Step 2: Open Local Application</h3>
                            <p className="text-sm text-muted-foreground">Select "Local Application" from the options</p>
                        </div>
                        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                            <Image
                                src="/step2.jpeg"
                                alt="Step 2: Local Application"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">Step 3: Configure Application</h3>
                            <p className="text-sm text-muted-foreground">Type in the handler path and bot name</p>
                        </div>
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border mb-4">
                            <Image
                                src="/step3.jpeg"
                                alt="Step 3: Handler Path"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Handler Path</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={HANDLER_PATH}
                                        readOnly
                                        className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted text-sm text-foreground"
                                    />
                                    <CopyButton text={HANDLER_PATH} variant="inline" />
                                </div>
                                <p className="text-xs text-muted-foreground">Copy this URL to use in Bitrix24</p>
                            </div>
                            
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">Step 4: Copy Credentials</h3>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                                <li>Copy Application ID (Client ID)</li>
                                <li>Copy Application Key (Client Secret)</li>
                                <li>Copy Portal Link</li>
                                <li>Click Save</li>
                            </ol>
                        </div>
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border mb-4">
                            <Image
                                src="/step4.jpeg"
                                alt="Step 4: Copy Credentials"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 p-4">
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                ⚠️ Make sure to copy all credentials before proceeding. You'll need them in the next step.
                            </p>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">Step 5: Generate Integration Link</h3>
                            <p className="text-sm text-muted-foreground">
                                Paste the credentials you copied in the previous step
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Application ID (Client ID)</label>
                                <input
                                    type="text"
                                    value={clientId}
                                    onChange={(e) => setClientId(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground"
                                    placeholder="Enter application ID"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Application Key (Client Secret)</label>
                                <input
                                    type="text"
                                    value={clientSecret}
                                    onChange={(e) => setClientSecret(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground"
                                    placeholder="Enter application key"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Portal Link</label>
                                <input
                                    type="text"
                                    value={portalLink}
                                    onChange={(e) => setPortalLink(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground"
                                    placeholder="e.g., diet-hub.bitrix24.com"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">Step 6: Copy Webhook URL</h3>
                            <p className="text-sm text-muted-foreground">
                                Copy the generated webhook URL to use in Bitrix24
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Generated Webhook URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={webhookUrl}
                                    readOnly
                                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted text-sm text-foreground break-all"
                                />
                                <CopyButton text={webhookUrl} variant="inline" />
                            </div>
                        </div>
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 p-4">
                            <p className="text-sm text-emerald-800 dark:text-emerald-200">
                                ✓ Integration link generated successfully! Copy this URL for the next step.
                            </p>
                        </div>
                    </div>
                );

            case 7:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">Step 7: Paste Link in Bitrix24</h3>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                                <li>Paste the webhook URL in both Handler Path and Installation Path</li>
                                <li>Click Save</li>
                            </ol>
                        </div>
                        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                            <Image
                                src="/step7.jpeg"
                                alt="Step 7: Paste Link"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                );

            case 8:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">Step 8: Add Permissions</h3>
                            <p className="text-sm text-muted-foreground">
                                Add the required permissions for the bot to function properly
                            </p>
                        </div>
                        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                            <Image
                                src="/step8.jpeg"
                                alt="Step 8: Permissions"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                );

            case 9:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">Step 9: Open Application</h3>
                            <p className="text-sm text-muted-foreground">Click "Open Application" to proceed</p>
                        </div>
                        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                            <Image
                                src="/step9.jpeg"
                                alt="Step 9: Open Application"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                );

            case 10:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">Step 10: Copy Tokens</h3>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                                <li>Copy Access Token</li>
                                <li>Copy Refresh Token</li>
                            </ol>
                        </div>
                        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                            <Image
                                src="/step10.jpeg"
                                alt="Step 10: Copy Tokens"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 p-4">
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                ⚠️ Copy both the Access Token and Refresh Token. You'll need them in the final step.
                            </p>
                        </div>
                    </div>
                );

            case 11:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">Step 11: Save Tokens & Register</h3>
                            <p className="text-sm text-muted-foreground">
                                Paste the tokens you copied and complete the integration
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Access Token</label>
                                <input
                                    type="text"
                                    value={accessToken}
                                    onChange={(e) => setAccessToken(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground"
                                    placeholder="Paste access token"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Refresh Token</label>
                                <input
                                    type="text"
                                    value={refreshToken}
                                    onChange={(e) => setRefreshToken(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground"
                                    placeholder="Paste refresh token"
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Bitrix24 Integration Setup</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Step {currentStep} of {totalSteps}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-muted transition-colors text-foreground"
                        disabled={loading}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pt-4">
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 p-4">
                            <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-200">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}
                    {getStepContent()}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-border">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1 || loading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!canProceed() || loading}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : currentStep === 5 ? (
                            'Generate Link'
                        ) : currentStep === 11 ? (
                            'Save & Register'
                        ) : (
                            <>
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
