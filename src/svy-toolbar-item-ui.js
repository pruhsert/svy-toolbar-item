/**
 * @module SvyToolbarItem/SvyToolbarItemUi
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class SvyToolbarItemUi extends Plugin {

    /**
     * @inheritDoc
     */
	init() {
		this.toolbarItems = [];
		const itemDefinitions = this.editor.config.get('svyToolbarItem') || [];
		itemDefinitions.forEach(definition => this.createToolbarItem(definition));

		this.editor.on('change:isReadOnly', () => {
			this.toolbarItems.forEach(item => {
				if (item._syncDisabledState) {
					item.isEnabled = !this.editor.isReadOnly;
				}
			});
		});
	}

    /**
     * Creates a toolbar item. Clicking this item will execute the callback provided
     *
	 * @param itemConfig the item configuration
     * @private
     */
	createToolbarItem(itemConfig) {
		const editor = this.editor;

		editor.ui.componentFactory.add(itemConfig.name, locale => {
            const button = this.createButton(itemConfig.label, itemConfig.icon, locale);
			button.isEnabled = true;
			button._syncDisabledState = typeof itemConfig.syncDisabledState === "boolean" ? itemConfig.syncDisabledState : true;

			// Change enabled state and execute the specific callback on click.
			this.listenTo(button, 'execute', () => {
				this.setEnabled(button, false);
				Promise.resolve(itemConfig.onClick(button)).then(() => this.setEnabled(button, true)).catch(() => this.setEnabled(button, true));
			});

			this.toolbarItems.push(button);
			return button;
		});
	}

	/**
     * Enables or disables the item according to the button config and the current readOnly-state of the editor.
     *
	 * @param item the buttonView
	 * @param {Boolean} enabled new enabled state
     * @private
     */
	setEnabled(item, enabled) {
		if (item._syncDisabledState) {
			item.isEnabled = !this.editor.isReadOnly && enabled;
		} else {
			item.isEnabled = enabled;
		}
	}

	/**
     * Internal creation method of ButtonView objects
     *
	 * @param {String} label the button label
	 * @param {String }icon the button icon
	 * @param {String }icon the button locale
     * @private
     */
	createButton(label, icon, locale) {
		const button = new ButtonView(locale);

		button.set({
			label,
			icon,
			tooltip: true
		});

		return button;
	}
}
