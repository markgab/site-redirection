import ConfigData from "../data/ConfigData";

export default class Util {

    private static _data: ConfigData;
    //private static _context: ICommonContext;

    public static get data(): ConfigData {
        return this._data;
    }

/*     public static get spContext(): ICommonContext {
        return this._context;
    } */

    // , context: ApplicationCustomizerContext | _spPageContextInfo
    static setup(data: ConfigData) {
        this._data = data;
        //var _spPageContextInfo: _spPageContextInfo;
        //this._context = transformContext(context);
    }
}
/* 
function transformContext(context: ApplicationCustomizerContext | _spPageContextInfo): ICommonContext {
    const classic = <_spPageContextInfo>context;

    if(classic.webId) {
        return {
            absoluteWebUrl: classic.webAbsoluteUrl,
        };
    }
    
    return {
        absoluteWebUrl: (context as ApplicationCustomizerContext).pageContext.web.absoluteUrl,
    };

}

export interface ICommonContext {
    absoluteWebUrl: string;
} */