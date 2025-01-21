import { LitElement, html, CSSResultGroup, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * Lit component that displays the current time 
 * and it looks like a Timex Submariner wrist 
 * watch from the 90's.
 */
export class Clock extends LitElement {
    constructor() {
        super(...arguments);
        this.time = new Date();
    }
    connectedCallback() {
        super.connectedCallback();
        this.timer = setInterval(() => {
            this.time = new Date();
        }, 1000);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        clearInterval(this.timer);
    }
    render() {
        const { time } = this;
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour = hours % 12;
        return html `
            <div class="clock">
                <div class="clock__time">
                    ${hour}:${minutes}:${seconds} ${ampm}
                </div>
            </div>
        `;
    }
}