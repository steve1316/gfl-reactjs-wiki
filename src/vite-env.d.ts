/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** Base URL for card art, skill icons, equipment, UI images and Spine data. */
	readonly VITE_ASSET_BASE_URL: string;
	/** Base URL for full art, split into its own host to stay under the 1 GB per-site cap. */
	readonly VITE_ART_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
