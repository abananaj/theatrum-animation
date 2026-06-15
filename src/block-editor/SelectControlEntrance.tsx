import { addFilter } from "@wordpress/hooks"
import { InspectorControls } from "@wordpress/block-editor"
import { PanelBody, SelectControl } from "@wordpress/components"
import { createHigherOrderComponent } from "@wordpress/compose"
import { Fragment } from "@wordpress/element"
import slideIn from "../entrances/slide-in/slide-in"

const ENTRANCE_OPTIONS = [
	{ label: "— None —", value: "" },
	...Object.keys(slideIn).map((key) => ({ label: key, value: key })),
]

const slideInKeys = Object.keys(slideIn)

const withEntranceAnimation = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { attributes, setAttributes } = props
		const className: string = attributes.className ?? ""

		const currentValue = slideInKeys.find((key) => className.split(" ").includes(key)) ?? ""

		function onChange(value: string) {
			const filtered = className.split(" ").filter((c) => c !== "" && !slideInKeys.includes(c))
			if (value) filtered.push(value)
			setAttributes({ className: filtered.join(" ") })
		}

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title="Entrance Animation">
						<SelectControl
							__next40pxDefaultSize
							label="Entrance"
							value={currentValue}
							options={ENTRANCE_OPTIONS}
							onChange={onChange}
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		)
	}
}, "withEntranceAnimation")

addFilter(
	"editor.BlockEdit",
	"theatrum-animation/entrance",
	withEntranceAnimation
)
