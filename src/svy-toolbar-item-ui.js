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
	 * @param {{name:String,label:String,icon:String}} itemConfig the item configuration
     * @private
     */
	createToolbarItem(itemConfig) {
		const editor = this.editor;
		const componentName = itemConfig.name;

		editor.ui.componentFactory.add(componentName, locale => {
			const view = new ButtonView( locale );

			view.set({
				label: itemConfig.label,
				tooltip: true,
				withText: true
			});

			if (itemConfig.icon) {
				view.set('icon', itemConfig.icon);
			}

			view.isEnabled = true;

			//buttonView._syncDisabledState = typeof itemConfig.syncDisabledState === "boolean" ? itemConfig.syncDisabledState : true;

			// Change enabled state and execute the specific callback on click.
			if (1 === 2) {
				this.listenTo(view, 'execute', () => {
					this.setEnabled(view, false);
					Promise.resolve(itemConfig.onClick(view))
						.then(() => this.setEnabled(view, true))
						.catch(() => this.setEnabled(view, true));
				});
			}

			this.toolbarItems.push(view);

			console.log(view);

			return view;
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
}
