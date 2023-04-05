import { SPHttpClient, ISPHttpClientOptions } from '@microsoft/sp-http';

export enum ListTitle {
    Settings = "Site Redirection Settings",
}

const Config = SPHttpClient.configurations.v1;
const DefaultOptions: ISPHttpClientOptions = {
    
};

export const DefaultRedirectionConfig: ISiteRedirectionConfig = Object.freeze({
    DestinationUrl: "https://...",
    Enabled: false,
    Delay: 10,
    Message: "This site has moved. You will be redirected to the new location soon. Please update your browser bookmarks."
});

export default class RedirectionData {
    constructor(private spClient: SPHttpClient, private absoluteWebUrl: string) {

    }

    public async fetchConfig(): Promise<ISiteRedirectionConfig> {
        const url = `${this.getListItemsApiPath()}$top=1&$orderby=ID desc`;
        const response = await this.spClient.fetch(url, Config, DefaultOptions);
        const result: ISiteRedirectionRow = await response.json();
        try {
            return {
                ...DefaultRedirectionConfig,
                ...JSON.parse(result.SiteRedirectionPreferences || '{}')
            };
        } catch(err) {
            return {
                ...DefaultRedirectionConfig,
            };
        }
    }

    public updateConfig(config: ISiteRedirectionConfig): Promise<any> {
        const url = `${this.getListItemsApiPath()}(${config.Id})`;
        const options = this.getOptions();
        options.method = "PATCH";
        options.body = JSON.stringify(config);
        return this.spClient.post(url, Config, options);
    }

    private getOptions(): ISPHttpClientOptions {
        return {
            ...DefaultOptions,
        }
    }

    private getListItemsApiPath(): string {
        return [
            this.absoluteWebUrl, 
            `api/web/lists/getByTitle(${ListTitle.Settings})/items?`
        ].join('/');
    }
}

export interface ISiteRedirectionRow {
    Id: number;
    Title: string;
    SiteRedirectionPreferences: string;
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