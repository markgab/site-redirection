//import { SPHttpClient, SPHttpClientConfiguration, ISPHttpClientOptions } from '@microsoft/sp-http';
import { SPComponentLoader } from '@microsoft/sp-loader';
//require('sp-init');
//require('microsoft-ajax');
//require('sp-runtime');
//require('sharepoint');

const ConfigKey = "SiteRedirectionConfig";
//const Config = SPHttpClient.configurations.v1;
//const DefaultOptions: ISPHttpClientOptions = {};


const DefaultConfig: ISiteRedirectionConfig = Object.freeze({
    enabled: false,
    delay: 5,
    message: `
        <p>This site has moved to a new location, please update your browser bookmark.</p>
        <p>You will be automatically redirected soon.</p>
        `,
    destinationUrl: '',
});

export default class DataBagAccess {
    constructor(protected siteUrl?: string) {

    }

    protected createContext(): SP.ClientContext {
        return new SP.ClientContext(this.siteUrl ? this.siteUrl : undefined);
    }

    fetchConfig(): Promise<ISiteRedirectionConfig> {
        return new Promise<ISiteRedirectionConfig>((resolve, reject) => {

            const context = this.createContext();

            const webProperties = context.get_web().get_allProperties();

            context.load(webProperties);
            context.executeQueryAsync(
                getWebPropertiesSucceeded, 
                (s, a) => reject(a)
            );
            
            function getWebPropertiesSucceeded() {
                //var allProps = webProperties.get_fieldValues();

                const strConfig: string = webProperties.get_fieldValues()[ConfigKey]  || '{}';

                const config = {
                    ...DefaultConfig,
                    ...JSON.parse(strConfig),
                } as ISiteRedirectionConfig;

                resolve(config);

            /* 
                var customProp = "";
            
                if(webProperties.get_fieldValues().CustomSite_Version != undefined)
                {
                    var customProp = webProperties.get_fieldValues().CustomSite_Version;
                } */
            }

        }).catch(this.handleJsomError);
    }

    saveConfig(config: ISiteRedirectionConfig): Promise<unknown> {
        return new Promise((resolve, reject) => {

            // You can optionally specify the Site URL here to get the context
            // If you don't specify the URL, the method will get the context of the current site
            // var clientContext = new SP.ClientContext("http://MyServer/sites/SiteCollection");
            //var clientContext = new SP.ClientContext();
            
            const strConfig = JSON.stringify(config);
            const context = this.createContext();
            const oWebsite = context.get_web();
            context.load(oWebsite);
            const props = oWebsite.get_allProperties();
            props.set_item(ConfigKey, strConfig);
            oWebsite.update();
            context.load(oWebsite);

            // Execute the query to the server.
            context.executeQueryAsync(
                () => resolve(null),
                (s, a) => reject(a)
            );
            
        }).catch(this.handleJsomError);
    }

    protected handleJsomError = (args: SP.ClientRequestFailedEventArgs) => {
        const msg = `Data Transaction Failed!\n'${args.get_message()}\n${args.get_stackTrace()}`; 
        throw new Error(msg);
    }

    static loadScripts(): Promise<any> {
        return SPComponentLoader.loadScript('/_layouts/15/init.js', {
            globalExportsName: '$_global_init'
        })
        .then((): Promise<{}> => {
            return SPComponentLoader.loadScript('/_layouts/15/MicrosoftAjax.js', {
                globalExportsName: 'Sys'
            });
        })
        .then((): Promise<{}> => {
            return SPComponentLoader.loadScript('/_layouts/15/SP.Runtime.js', {
                globalExportsName: 'SP'
            });
        })
        .then((): Promise<{}> => {
            return SPComponentLoader.loadScript('/_layouts/15/SP.js', {
                globalExportsName: 'SP'
            });
        });
    }
}



/* 
export default class DataBagAccess {
    constructor(protected client: SPHttpClient) {

    }

    async fetchConfig(): Promise<ISiteRedirectionConfig> {
        // https://site.sharepoint.com/_api/web/allProperties
        const url = '/_api/web/allProperties?$select=' + ConfigKey;
        const result = await this.get(url);
        const strConfig: string = result[ConfigKey];
        return strConfig ? JSON.parse(strConfig) : null;
    }

    async saveConfig(config: ISiteRedirectionConfig): Promise<any> {
        // https://techcommunity.microsoft.com/t5/sharepoint/jsom-rest-set-list-item-property-bag-value/m-p/134706
        // https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/guidance/connect-to-sharepoint-using-jsom
    }

    async get(url: string, options = DefaultOptions): Promise<any> {
        const response = await this.client.get(url, Config, options);
        const result = await response.json();
        return result.value;
    }
}
 */
export interface ISiteRedirectionConfig {

    /**
     * If true, Redirection will display banner, otherwise it will remain minimized
     */
    enabled: boolean;

    /**
     * Seconds before redirection action is triggered
     */
    delay: number;

    /**
     * Mark up of message on banner displayed before redirection
     */
    message: string;

    /**
     * Location to redirect to
     */
    destinationUrl: string;
}