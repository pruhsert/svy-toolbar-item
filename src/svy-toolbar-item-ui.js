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
		console.log('SvyToolbarItemUi.init() got called');

		this.toolbarItems = [];
		
		const editor = this.editor;
		const itemDefinitions = this.editor.config.get('svyToolbarItem') || [];

		console.log(itemDefinitions);

		itemDefinitions.forEach(
			definition => this.createToolbarItem(definition)
		);

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
			const buttonView = this.createButton(itemConfig.label, itemConfig.icon);

			buttonView.isEnabled = true;
			buttonView._syncDisabledState = typeof itemConfig.syncDisabledState === "boolean" ? itemConfig.syncDisabledState : true;

			// Change enabled state and execute the specific callback on click.
			this.listenTo(buttonView, 'execute', () => {
				this.setEnabled(buttonView, false);
				Promise.resolve(itemConfig.onClick(buttonView))
					.then(() => this.setEnabled(buttonView, true))
					.catch(() => this.setEnabled(buttonView, true));
			});

			this.toolbarItems.push(buttonView);

			console.log(buttonView);

			return buttonView;
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
	 * @param {String} icon the button icon
     * @private
     */
	createButton(label, icon, locale) {
		const buttonView = new ButtonView();

		buttonView.set({
			label,
			icon,
			tooltip: true
		});

		return buttonView;
	}
}
