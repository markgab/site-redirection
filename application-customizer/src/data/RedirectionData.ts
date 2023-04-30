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
        const url = `${this.getListItemsApiPath()}?$top=1&$orderby=ID desc`;
        const result = <ISiteRedirectionRow[]> await this.fetch(url);
        const match = first(result);
        const config = <ISiteRedirectionConfig>JSON.parse(match.SiteRedirectionPreferences);
        config.Id = match.Id;
        try {
            return {
                ...DefaultRedirectionConfig,
                ...config,
            };
        } catch(err) {
            return {
                ...DefaultRedirectionConfig,
            };
        }
    }

    public updateConfig(config: ISiteRedirectionConfig): Promise<any> {
        const url = `${this.getListItemsApiPath()}(${config.Id})`;
        const row = this.transformConfig(config);
        return this.merge(url, row);
    }

    private transformConfig(config: ISiteRedirectionConfig): ISiteRedirectionRow {
        const clean = {
            ...config,
        };
        delete clean.Id;

        const row = {};
        //this.appendMetadata(row);

        row['SiteRedirectionPreferences'] = JSON.stringify(clean);
        return row;
    }
/* 
    private appendMetadata(data: Object) {
        data['__metadata'] = {
            "type": "SP.Data.SiteRedirectionListItem"
        };
    } */

    private getOptions(): ISPHttpClientOptions {
        return {
            ...DefaultOptions,
        }
    }

    private getListItemsApiPath(): string {
        return [
            this.absoluteWebUrl, 
            `_api/web/lists/getByTitle('${ListTitle.Settings}')/items`
        ].join('/');
    }

    private async fetch(url, options = this.getOptions()): Promise<unknown> {
        const response = await this.spClient.fetch(url, Config, options);
        const result = await response.json();
        return result.value;
    }

    private async merge(url, body: any, options = this.getOptions()): Promise<void> {
        options.method = "MERGE";
        options.body = JSON.stringify(body);
        options.headers = {
            'X-HTTP-Method': 'MERGE',
            'IF-MATCH': '*'
        };
        await this.spClient.post(url, Config, options);
    }
}

function first<T>(items: T[]): T {
    if(!items || !items.length) {
        return null;
    }
    return items[0];
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