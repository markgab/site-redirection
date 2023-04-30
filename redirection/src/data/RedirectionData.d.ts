import { SPHttpClient } from '@microsoft/sp-http';
export declare enum ListTitle {
    Settings = "Site Redirection Settings"
}
export declare const DefaultRedirectionConfig: ISiteRedirectionConfig;
export default class RedirectionData {
    private spClient;
    private absoluteWebUrl;
    constructor(spClient: SPHttpClient, absoluteWebUrl: string);
    fetchConfig(): Promise<ISiteRedirectionConfig>;
    updateConfig(config: ISiteRedirectionConfig): Promise<any>;
    private transformConfig;
    private getOptions;
    private getListItemsApiPath;
    private fetch;
    private merge;
}
export interface ISiteRedirectionRow {
    Id?: number;
    Title?: string;
    SiteRedirectionPreferences?: string;
}
export interface ISiteRedirectionConfig {
    /**
     * If true, Redirection will display banner, otherwise it will remain minimized
     */
    Enabled: boolean;
    /**
     * Seconds before redirection action is triggered
     */
    Delay: number;
    /**
     * Mark up of message on banner displayed before redirection
     */
    Message: string;
    /**
     * Location to redirect to
     */
    DestinationUrl: string;
    /**
     * SharePoint List Item ID
     */
    Id?: number;
}
//# sourceMappingURL=RedirectionData.d.ts.map