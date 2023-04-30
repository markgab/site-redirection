import "../../redirection/dist/site-redirection-web-component";

class SiteRedirection {
    constructor() {
        this._setup();
    }

    context: _spPageContextInfo;
    domElement: HTMLDivElement;

    render() {
        const absoluteUrl = this.context.webAbsoluteUrl;
        this.domElement.innerHTML = `
            <site-redirection absoluteWebUrl=${absoluteUrl}></site-redirection>`;
    }

    dispose() {
        this.domElement.remove();
        this.domElement = null;
    }

    private async _setup() {
        try {

            this.context = this._getContext();
            this.domElement = document.createElement('div');
            document.body.append(this.domElement);
            this.render();

        } catch(err) {
            console.log('error', err);
        }
    }

    private _getContext(): _spPageContextInfo {
        return _spPageContextInfo;
    }

}

function siteRedirectionInit(): SiteRedirection {
    const sr = new SiteRedirection();
    (window as any).siteRedirection = sr;
    return sr;
}

(function () {
    (window as any).siteRedirectionInit = siteRedirectionInit;
    _spBodyOnLoadFunctionNames.push("siteRedirectionInit");
})();

export default siteRedirectionInit;