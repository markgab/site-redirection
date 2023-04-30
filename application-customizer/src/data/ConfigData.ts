import { SPBrowser } from "@pnp/sp";
import { IWeb, IWebInfo, Web } from "@pnp/sp/webs";
import { IList } from "@pnp/sp/lists";
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

export const DefaultRedirectionConfig: ISiteRedirectionConfig = Object.freeze({
    DestinationUrl: "https://...",
    Enabled: false,
    Delay: 10,
    Message: "This site has moved. You will be redirected to the new location soon. Please update your browser bookmarks."
});

export enum ListTitle {
    Settings = "Site Redirection Settings",
}

export default class ConfigData {
    constructor(public absoluteWebUrl: string) {
        this.web = Web(absoluteWebUrl).using(SPBrowser({baseUrl: absoluteWebUrl}));
    }

    private web: IWeb;

    private get configList(): IList {
        return this.web.lists.getByTitle(ListTitle.Settings);
    }
    
    public async fetchConfig(): Promise<ISiteRedirectionConfig> {

        const items = await this.configList
            .items 
            .top(1)
            .orderBy('Id', false)();

        const match = first(items);
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
        const row = this.transformConfig(config);

        return this
            .configList
            .items
            .getById(config.Id)
            .update(row, '*');

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

    public async fetchWeb(): Promise<IWebInfo> {
        return this.web().then(result => {
            return result;
        })
        .catch(err => {
            console.error(JSON.stringify(err, null, 2));
            return null;
        });
    }
}

function first<T>(items: T[]): T {
    if(!items || !items.length) {
        return null;
    }
    return items[0];
}
