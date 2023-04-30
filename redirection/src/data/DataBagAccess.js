import { SPComponentLoader } from '@microsoft/sp-loader';
const ConfigKey = "SiteRedirectionConfig";
const DefaultConfig = Object.freeze({
    enabled: false,
    delay: 5,
    message: `
        <p>This site has moved to a new location, please update your browser bookmark.</p>
        <p>You will be automatically redirected soon.</p>
        `,
    destinationUrl: '',
});
export default class DataBagAccess {
    constructor(siteUrl) {
        this.siteUrl = siteUrl;
        this.handleJsomError = (args) => {
            const msg = `Data Transaction Failed!\n'${args.get_message()}\n${args.get_stackTrace()}`;
            throw new Error(msg);
        };
    }
    createContext() {
        return new SP.ClientContext(this.siteUrl ? this.siteUrl : undefined);
    }
    fetchConfig() {
        return new Promise((resolve, reject) => {
            const context = this.createContext();
            const webProperties = context.get_web().get_allProperties();
            context.load(webProperties);
            context.executeQueryAsync(getWebPropertiesSucceeded, (s, a) => reject(a));
            function getWebPropertiesSucceeded() {
                try {
                    const strConfig = webProperties.get_fieldValues()[ConfigKey] || '{}';
                    const config = Object.assign(Object.assign({}, DefaultConfig), JSON.parse(strConfig));
                    resolve(config);
                }
                catch (err) {
                    console.warn('Site redirection failed to restore saved configuration. Using default.');
                    return DefaultConfig;
                }
            }
        }).catch(this.handleJsomError);
    }
    saveConfig(config) {
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
            context.executeQueryAsync(() => resolve(null), (s, a) => reject(a));
        }).catch(this.handleJsomError);
    }
    static loadScripts() {
        return SPComponentLoader.loadScript('/_layouts/15/init.js', {
            globalExportsName: '$_global_init'
        })
            .then(() => {
            return SPComponentLoader.loadScript('/_layouts/15/MicrosoftAjax.js', {
                globalExportsName: 'Sys'
            });
        })
            .then(() => {
            return SPComponentLoader.loadScript('/_layouts/15/SP.Runtime.js', {
                globalExportsName: 'SP'
            });
        })
            .then(() => {
            return SPComponentLoader.loadScript('/_layouts/15/SP.js', {
                globalExportsName: 'SP'
            });
        });
    }
}
//# sourceMappingURL=DataBagAccess.js.map