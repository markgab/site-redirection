import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, 
  PlaceholderContent, 
  PlaceholderName,
} from '@microsoft/sp-application-base';
//import { Dialog } from '@microsoft/sp-dialog';
import * as strings from 'SiteRedirectionApplicationCustomizerStrings';
import { render as litRender, html } from 'lit';
import "../../../../redirection/dist/site-redirection-web-component.js";

const LOG_SOURCE: string = 'SiteRedirectionApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISiteRedirectionApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SiteRedirectionApplicationCustomizer extends BaseApplicationCustomizer<ISiteRedirectionApplicationCustomizerProperties> {

  bottomPlaceholder: PlaceholderContent;

  public async onInit(): Promise<void> {
    
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    let message: string = this.properties.testMessage;
    if (!message) {
      message = '(No properties were provided.)';
    }

    // Wait for the placeholders to be created (or handle them being changed) and then
    // render.
    this.context.placeholderProvider.changedEvent.add(this, this.renderPlaceHolders);

  }

  private renderPlaceHolders(): void {

    // Handling the bottom placeholder
    if (!this.bottomPlaceholder) {
      this.bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this.onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this.bottomPlaceholder) {
        console.error("The expected placeholder (Bottom) was not found.");
        return;
      }

      const { absoluteUrl } = this.context.pageContext.web;

      this.bottomPlaceholder.domElement &&
      litRender(html`
        <site-redirection absoluteWebUrl=${absoluteUrl}></site-redirection>
      `, this.bottomPlaceholder.domElement);
      
      
    }
  }

  onDispose(): void {
    console.log('dispose');
  }

}
