import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators';

import {
    provideFluentDesignSystem,
    fluentButton,  
    fluentTextField,
    fluentNumberField,
    fluentSwitch,
    fluentTextArea,
} from "@fluentui/web-components";
import DataBagAccess, { ISiteRedirectionConfig } from '../data/DataBagAccess';
  
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

    @property({attribute: false})
    config: ISiteRedirectionConfig = <any>{};

    @property({attribute: false})
    data: DataBagAccess;

    render() {
        return html`
            <div class="sr-settings">
                <h3>Site Redirection Settings</h3>

                <div class="form-grid">
                    <fluent-switch checked=${this.config.enabled} @change=${e => this.onChange('enabled', e.target.checked)}>
                        <span slot="checked-message">On</span>
                        <span slot="unchecked-message">Off</span>
                        <label for="cap-switch">Enable Site Redirection</label>
                    </fluent-switch>
                    <fluent-number-field 
                        min="0"
                        value=${this.config.delay}
                        appearace="outline" 
                        placeholder="Time in Seconds"
                        @input=${e => this.onChange('delay', e.target.valueAsNumber)}
                    >Delay Before Redirection</fluent-number-field>
                    <fluent-text-field
                        value=${this.config.destinationUrl}
                        appearance="outline" 
                        placeholder="/sites/site/web" 
                        spellcheck="false"
                        @input=${e => this.onChange('destinationUrl', e.target.value)}
                    >Redirect Destination</fluent-text-field>
                    <fluent-text-area 
                        value=${this.config.message} 
                        @input=${e => this.onChange('message', e.target.value)}
                    >Redirection Message</fluent-text-area>
                </div>
                <fluent-button @click=${() => this.onSave()}>Save</fluent-button>
                <textarea>${JSON.stringify(this.config, null, 2)}</textarea>
            </div>
        `;
    }

    onChange(fieldName: string, val: any) {
        console.log('change', val);
        const newConfig = {
            ...this.config
        };
        newConfig[fieldName] = val;

        this.config = newConfig;
    }

    async onSave() {
        try {
            await this.data.saveConfig(this.config);
        } catch(err) {
            alert(JSON.stringify(err))
        }
    }

    static styles = css`
        .sr-settings {

        }

        .form-grid {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-evenly;
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