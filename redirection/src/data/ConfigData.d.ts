import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
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
export declare const DefaultRedirectionConfig: ISiteRedirectionConfig;
export declare enum ListTitle {
    Settings = "Site Redirection Settings"
}
export default class ConfigData {
    absoluteWebUrl: string;
    constructor(absoluteWebUrl: string);
    private web;
    private get configList();
    fetchConfig(): Promise<ISiteRedirectionConfig>;
    updateConfig(config: ISiteRedirectionConfig): Promise<any>;
    private transformConfig;
}
//# sourceMappingURL=ConfigData.d.ts.map