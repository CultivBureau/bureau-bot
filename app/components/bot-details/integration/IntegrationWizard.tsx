'use client';

import { useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Copy, Check, Loader2 } from 'lucide-react';
import { integrationService } from '../../../services/integration';
// Using img tag instead of Next.js Image for better compatibility with dynamic images

interface IntegrationWizardProps {
  botId: string;
  onClose: () => void;
  onComplete: () => void;
}

export function IntegrationWizard({ botId, onClose, onComplete }: IntegrationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [portalDomain, setPortalDomain] = useState('');
  const [botName, setBotName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [integrationId, setIntegrationId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const totalSteps = 12;

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleGenerateLink = useCallback(async () => {
    if (!clientId || !clientSecret || !portalDomain || !botId) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Extract domain from portal link if it's a full URL
      let domain = portalDomain.trim();
      if (domain.includes('://')) {
        try {
          const url = new URL(domain);
          domain = url.hostname;
        } catch {
          // If URL parsing fails, try to extract domain manually
          domain = domain.replace(/^https?:\/\//, '').split('/')[0];
        }
      }

      const requestData = {
        client_id: clientId,
        client_secret: clientSecret,
        portal_domain: domain,
        bot_id: botId,
        type: 'BITRIX' as const,
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('Generating integration link with data:', requestData);
      }

      const response = await integrationService.generateLink(requestData);

      setWebhookUrl(response.webhook_url);
      setIntegrationId(response.integration_id);
      setCurrentStep(7); // Move to step 7 to show the generated link
    } catch (err: any) {
      setError(err?.message || 'Failed to generate link');
    } finally {
      setLoading(false);
    }
  }, [clientId, clientSecret, portalDomain, botId]);

  const handleCopyUrl = useCallback(async () => {
    if (webhookUrl) {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [webhookUrl]);

  const handleSaveAndRegister = useCallback(async () => {
    if (!accessToken || !refreshToken || !integrationId) {
      setError('Please fill in Access Token and Refresh Token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Save tokens
      await integrationService.saveTokens({
        integration_id: integrationId,
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      // Register bot
      await integrationService.registerBot({
        bot_id: botId,
      });

      onComplete();
    } catch (err: any) {
      setError(err?.message || 'Failed to save tokens and register bot');
    } finally {
      setLoading(false);
    }
  }, [accessToken, refreshToken, integrationId, botId, onComplete]);

  const progress = (currentStep / totalSteps) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-card-foreground">Step 1: Open Developer Resources & Scroll down to the others</h3>
            <div className="relative w-full h-auto rounded-lg overflow-hidden border border-border">
              <img
                src="/step1.jpeg"
                alt="Step 1: Open Developer Resources & Scroll down to the others"
                className="w-full h-auto"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-card-foreground">Step 2: Open the "Others" </h3>
            <div className="relative w-full h-auto rounded-lg overflow-hidden border border-border">
              <img
                src="/step2.jpeg"
                alt="Step 2: Open the Others section"
                className="w-full h-auto"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-card-foreground">Step 3: Open Local Application</h3>
            <div className="relative w-full h-auto rounded-lg overflow-hidden border border-border">
              <img
                src="/step3.jpeg"
                alt="Step 3: Open Local Application"
                className="w-full h-auto"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-card-foreground">Step 4: Configure Application</h3>
            <div className="space-y-3">
                <div>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-4">
                    <li>Type in the handler path:</li>
                    <div className="flex gap-2">
                    <input
                      type="text"
                      value="https://bot-linker-backend.cultivbureau.com/"
                      readOnly
                      className="flex-1 px-4 py-3 rounded-xl border border-border bg-secondary/50 text-foreground"
                    />
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText('https://bot-linker-backend.cultivbureau.com/');
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="px-4 py-3 rounded-xl border border-border bg-background hover:bg-secondary flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                    <li>Name the bot</li>
                  </ul>
                  
                </div>
              </div>
            <div className="space-y-4">
              <div className="relative w-full h-auto rounded-lg overflow-hidden border border-border">
                <img
                  src="/step4.jpeg"
                  alt="Step 4: Configure Application"
                  className="w-full h-auto"
                />
              </div>

            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-card-foreground">Step 5: Copy the Client ID, Client Secret, and Portal Link</h3>
            <div className="relative w-full h-auto rounded-lg overflow-hidden border border-border">
              <img
                src="/step5.jpeg"
                alt="Step 5: Copy the Client ID, Client Secret, and Portal Link"
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              copy the Client ID, Client Secret, and Portal Link ,then click on "Save". You'll paste them in the next step.
            </p>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-card-foreground">Step 6: Generate Link</h3>
            <p className="text-sm text-muted-foreground">
              Enter the credentials you copied from Step 5, then click Generate Link.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Client ID <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Paste Client ID here"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Client Secret <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="Paste Client Secret here"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Portal Link <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={portalDomain}
                  onChange={(e) => setPortalDomain(e.target.value)}
                  placeholder="Paste Portal Link here (e.g., your-domain.bitrix24.com)"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground"
                />
              </div>
              <button
                onClick={handleGenerateLink}
                disabled={loading || !clientId || !clientSecret || !portalDomain}
                className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Link'
                )}
              </button>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-card-foreground">Step 7: Copy Generated Link</h3>
            <p className="text-sm text-muted-foreground">
              Copy the webhook URL below and use it in the next steps.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={webhookUrl}
                readOnly
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-secondary/50 text-foreground"
              />
              <button
                onClick={handleCopyUrl}
                className="px-4 py-3 rounded-xl border border-border bg-background hover:bg-secondary flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-card-foreground">Step 8: Paste Link in Handler Path</h3>
            <div className="relative w-full h-auto rounded-lg overflow-hidden border border-border">
              <img
                src="/step8.jpeg"
                alt="Step 8: Paste Link in Handler Path"
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Paste the copied webhook URL in both the Handler Path and Installation Path fields, then click Save.
            </p>
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-card-foreground">Step 9: Add Permissions</h3>
            <div className="relative w-full h-auto rounded-lg overflow-hidden border border-border">
              <img
                src="/step9.jpeg"
                alt="Step 9: Add Permissions"
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Make sure to add all the required permissions as shown in the image above.
            </p>
          </div>
        );

      case 10:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-card-foreground">Step 10: Open Application</h3>
            <div className="relative w-full h-auto rounded-lg overflow-hidden border border-border">
              <img
                src="/step10.jpeg"
                alt="Step 10: Open Application"
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Click on "Open application" to proceed to the next step.
            </p>
          </div>
        );

      case 11:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-card-foreground">Step 11: Copy Access Token & Refresh Token</h3>
            <div className="relative w-full h-auto rounded-lg overflow-hidden border border-border">
              <img
                src="/step11.jpeg"
                alt="Step 11: Copy Access Token & Refresh Token"
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Copy both the Access Token and Refresh Token from the Bitrix24 interface.
            </p>
          </div>
        );

      case 12:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-card-foreground">Step 12: Save Tokens and Register Bot</h3>
            <p className="text-sm text-muted-foreground">
              Paste the Access Token and Refresh Token below, then click Save & Register Bot.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Access Token <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="Paste Access Token here"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Refresh Token <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={refreshToken}
                  onChange={(e) => setRefreshToken(e.target.value)}
                  placeholder="Paste Refresh Token here"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground"
                />
              </div>
              <button
                onClick={handleSaveAndRegister}
                disabled={loading || !accessToken || !refreshToken}
                className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving & Registering...
                  </>
                ) : (
                  'Save & Register Bot'
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground">Bitrix24 Integration Setup</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pt-4">
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {renderStep()}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between p-6 border-t border-border">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-4 py-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <div className="text-sm text-muted-foreground">
          {currentStep} / {totalSteps}
        </div>
        {currentStep < totalSteps && (
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

