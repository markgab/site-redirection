import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators';


@customElement('site-redirection')
export class Settings extends LitElement {
    render() {
        return html`
            <div class="sr-settings">
                <h3>Site Redirection Settings</h3>
            </div>
        `;
    }

    static styles = css`
        .sr-settings {

        }
    `;
}