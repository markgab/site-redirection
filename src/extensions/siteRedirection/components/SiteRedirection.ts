import { LitElement, html, CSSResultGroup, css } from 'lit';
import { customElement, state } from 'lit/decorators';
//import "./Settings";


@customElement('site-redirection')
export class SiteRedirection extends LitElement {

    @state()
    showDialog: boolean = false;

    render() {
        return html`
            <div class="sr-anchor">
                <div class="sr-floating">
                    <fluent-button appearance="accent" @click=${e => this.showDialog = true} id="dialogOpener">Show Dialog</fluent-button>
                </div>
                <fluent-dialog id="defaultDialog" .hidden=${!this.showDialog} trap-focus modal>
                    <div style="margin: 20px;">
                        <h2>Dialog with text and a button</h2>
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

        }
    `;

}