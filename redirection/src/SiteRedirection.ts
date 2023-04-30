import { LitElement, html, CSSResultGroup, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ISiteRedirectionConfig } from './data/ConfigData';
import "./Settings";

import {
    provideFluentDesignSystem,
    fluentDialog,
    fluentButton,  
    fluentTextField,
  } from "@fluentui/web-components";
import Util from './shared/Util';
import ConfigData from './data/ConfigData';
  
provideFluentDesignSystem()
    .register(
        fluentDialog(),
        fluentButton(),
        fluentTextField(),
);

@customElement('site-redirection')
export class SiteRedirection extends LitElement {
    constructor() {
        super();
    }

    @property({type: String})
    absoluteWebUrl: string = "";

    @state()
    showDialog: boolean = true;
    
    @state()
    config: ISiteRedirectionConfig = {} as any;

    override async connectedCallback() {
        super.connectedCallback()

        try {

            await this.setup();
            this.getRootNode().addEventListener('site-redirection-settings', this.onRequestConfig);

        } catch(err) {
            throw err;
        }

    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.getRootNode().removeEventListener('site-redirection-settings', this.onRequestConfig);
    }

    onRequestConfig = () => {
        this.showDialog = true;
    }

    async setup() {

        const data = new ConfigData(this.absoluteWebUrl);
        Util.setup(data);
        this.config = await data.fetchConfig();

    }

    onSave() {
        this.showDialog = false;
    }

    override render() {
        return html`
            <div class="sr-anchor">
                <div class="sr-floating">
                    <fluent-button appearance="accent" @click=${() => this.showDialog = true} id="dialogOpener">Show Dialog</fluent-button>
                </div>
                <fluent-dialog id="defaultDialog" .hidden=${!this.showDialog} trap-focus modal>
                    <div style="margin: 20px;">
                        <sr-settings @save=${this.onSave} .reload=${() => this.setup()}></sr-settings>
                        <fluent-button @click=${() => this.showDialog = false } id="dialogCloser" appearance="accent" tabindex="0">Dismiss</fluent-button>
                    </div>
                </fluent-dialog>
            </div>
        `;
    }
/* 
    onShowDialogClick = () => {
        this.showDialog = true;
    } */

    static override styles: CSSResultGroup = css`
        .sr-anchor {
            position: relative;
            //height: 0px;
            //width: 0px;
            border: 1px solid purple;
        }

        .sr-floating {
            position: absolute;
            border: 1px solid palegreen;
            //top: -40px;
        }
    `;

}