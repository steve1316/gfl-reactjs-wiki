/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** Base URL for card art, skill icons, equipment, UI images and Spine data. */
	readonly VITE_ASSET_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
