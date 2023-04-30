import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import {
    provideFluentDesignSystem,
    fluentButton,  
    fluentTextField,
    fluentNumberField,
    fluentSwitch,
    fluentTextArea,
} from "@fluentui/web-components";
import { ISiteRedirectionConfig } from './data/ConfigData';
import Util from './shared/Util';
  
provideFluentDesignSystem()
    .register(
        fluentButton(),
        fluentTextField(),
        fluentNumberField(),
        fluentSwitch(),
        fluentTextArea(),
    );

@customElement('sr-settings')
export class Settings extends LitElement {

    @property()
    reload: () => void = () => {};

    @state()
    config: ISiteRedirectionConfig = <any>{};

    override render() {
        return html`
            <div class="sr-settings">
                <h3>Site Redirection Settings</h3>
                <h4>HELLO WORLD 11</h4>
                <div class="form-grid">
                    <fluent-switch checked=${this.config.Enabled} @change=${e => this.onChange('Enabled', e.target.checked)}>
                        <span slot="checked-message">On</span>
                        <span slot="unchecked-message">Off</span>
                        <label for="cap-switch">Enable Site Redirection</label>
                    </fluent-switch>
                    <fluent-text-field
                        value=${this.config.DestinationUrl}
                        appearance="outline" 
                        placeholder="/sites/site/web" 
                        spellcheck="false"
                        @input=${e => this.onChange('DestinationUrl', e.target.value)}
                    >Redirect Destination</fluent-text-field>
                    <fluent-number-field 
                        min="0"
                        value=${this.config.Delay}
                        appearace="outline" 
                        placeholder="Time in Seconds"
                        @input=${e => this.onChange('Delay', e.target?.valueAsNumber)}
                    >Delay Before Redirection</fluent-number-field>
                    <fluent-text-area 
                        value=${this.config.Message} 
                        @input=${e => this.onChange('Message', e.target.value)}
                    >Redirection Message</fluent-text-area>
                </div>
                <fluent-button @click=${() => this.onSave()}>Save</fluent-button>
                <textarea>${JSON.stringify(this.config, null, 2)}</textarea>
            </div>
        `;
    }

    override async connectedCallback() {
        super.connectedCallback()

        try {

            this.config = await Util.data.fetchConfig();

        } catch(err) {
            //console.error(err.message);
        }
    }

    async onSave() {
        await Util.data.updateConfig(this.config);
        this.dispatchEvent(new CustomEvent('save'));   
    }

    onChange(fieldName: string, val: any) {
        console.log('change', val);
        const newConfig = {
            ...this.config
        };
        (newConfig as any)[fieldName] = val;

        this.config = newConfig;
    }

    static override styles = css`
        .sr-settings {

        }

        .form-grid {
            display: flex;
            flex-direction: column;
            //flex-wrap: wrap;
            justify-content: flex-start;
            //flex-basis: 50%;
        }

        .form-grid > * {
            box-sizing: border-box;
            //width: 50%;
            flex-basis: 50%;
            padding: 0.5rem;
        }
    `;
}