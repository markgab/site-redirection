import { LitElement, html, CSSResultGroup, css } from 'lit';
import { customElement, state } from 'lit/decorators';
import DataBagAccess, { ISiteRedirectionConfig } from '../data/DataBagAccess';
import "./Settings";

import {
    provideFluentDesignSystem,
    fluentDialog,
    fluentButton,  
    fluentTextField,
  } from "@fluentui/web-components";
  
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
        this.data = new DataBagAccess('https://golgamesh.sharepoint.com/sites/ModernDevPoint');
    }

    @state()
    showDialog: boolean = true;

    data: DataBagAccess;
    
    @state()
    config: ISiteRedirectionConfig;

    async connectedCallback() {
        super.connectedCallback()

        try {

            this.config = await this.data.fetchConfig();
            console.log(JSON.stringify(this.config, null, 2));

        } catch(err) {
            alert(err.message);
        }

    }

    render() {
        return html`
            <div class="sr-anchor">
                <div class="sr-floating">
                    <fluent-button appearance="accent" @click=${e => this.showDialog = true} id="dialogOpener">Show Dialog</fluent-button>
                </div>
                <fluent-dialog id="defaultDialog" .hidden=${!this.showDialog} trap-focus modal>
                    <div style="margin: 20px;">
                        <sr-settings .config=${this.config} .data=${this.data}></sr-settings>
                        <fluent-button @click=${e => this.showDialog = false } id="dialogCloser" appearance="accent" tabindex="0">Dismiss</fluent-button>
                    </div>
                </fluent-dialog>
            </div>
        `;
    }
/* 
    onShowDialogClick = () => {
        this.showDialog = true;
    } */

    static styles: CSSResultGroup = css`
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