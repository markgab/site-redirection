var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SPBrowser } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
export const DefaultRedirectionConfig = Object.freeze({
    DestinationUrl: "https://...",
    Enabled: false,
    Delay: 10,
    Message: "This site has moved. You will be redirected to the new location soon. Please update your browser bookmarks."
});
export var ListTitle;
(function (ListTitle) {
    ListTitle["Settings"] = "Site Redirection Settings";
})(ListTitle || (ListTitle = {}));
export default class ConfigData {
    constructor(absoluteWebUrl) {
        this.absoluteWebUrl = absoluteWebUrl;
        this.web = Web(absoluteWebUrl).using(SPBrowser({ baseUrl: absoluteWebUrl }));
    }
    get configList() {
        return this.web.lists.getByTitle(ListTitle.Settings);
    }
    fetchConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.configList
                .items
                .top(1)
                .orderBy('Id', false)();
            const match = first(items);
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
        const row = this.transformConfig(config);
        return this
            .configList
            .items
            .getById(config.Id)
            .update(row, '*');
    }
    transformConfig(config) {
        const clean = Object.assign({}, config);
        delete clean.Id;
        const row = {};
        //this.appendMetadata(row);
        row['SiteRedirectionPreferences'] = JSON.stringify(clean);
        return row;
    }
}
function first(items) {
    if (!items || !items.length) {
        return null;
    }
    return items[0];
}
//# sourceMappingURL=ConfigData.js.map