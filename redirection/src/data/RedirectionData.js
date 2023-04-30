var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SPHttpClient } from '@microsoft/sp-http';
export var ListTitle;
(function (ListTitle) {
    ListTitle["Settings"] = "Site Redirection Settings";
})(ListTitle || (ListTitle = {}));
const Config = SPHttpClient.configurations.v1;
const DefaultOptions = {};
export const DefaultRedirectionConfig = Object.freeze({
    DestinationUrl: "https://...",
    Enabled: false,
    Delay: 10,
    Message: "This site has moved. You will be redirected to the new location soon. Please update your browser bookmarks."
});
export default class RedirectionData {
    constructor(spClient, absoluteWebUrl) {
        this.spClient = spClient;
        this.absoluteWebUrl = absoluteWebUrl;
    }
    fetchConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.getListItemsApiPath()}?$top=1&$orderby=ID desc`;
            const result = yield this.fetch(url);
            const match = first(result);
            const config = JSON.parse(match.SiteRedirectionPreferences);
            config.Id = match.Id;
            try {
                return Object.assign(Object.assign({}, DefaultRedirectionConfig), config);
            }
            catch (err) {
                return Object.assign({}, DefaultRedirectionConfig);
            }
        });
    }
    updateConfig(config) {
        const url = `${this.getListItemsApiPath()}(${config.Id})`;
        const row = this.transformConfig(config);
        return this.merge(url, row);
    }
    transformConfig(config) {
        const clean = Object.assign({}, config);
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
    getOptions() {
        return Object.assign({}, DefaultOptions);
    }
    getListItemsApiPath() {
        return [
            this.absoluteWebUrl,
            `_api/web/lists/getByTitle('${ListTitle.Settings}')/items`
        ].join('/');
    }
    fetch(url, options = this.getOptions()) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.spClient.fetch(url, Config, options);
            const result = yield response.json();
            return result.value;
        });
    }
    merge(url, body, options = this.getOptions()) {
        return __awaiter(this, void 0, void 0, function* () {
            options.method = "MERGE";
            options.body = JSON.stringify(body);
            options.headers = {
                'X-HTTP-Method': 'MERGE',
                'IF-MATCH': '*'
            };
            yield this.spClient.post(url, Config, options);
        });
    }
}
function first(items) {
    if (!items || !items.length) {
        return null;
    }
    return items[0];
}
//# sourceMappingURL=RedirectionData.js.map