# Text-to-Image Demo

A vanilla HTML/CSS/JavaScript interface for Hugging Face image generation. It provides prompt suggestions, model selection, image-count and aspect-ratio controls, a generated-image gallery, downloads, and a saved light/dark theme.

## Preview

Open `index.html` in a browser or serve the repository through a local static server. There is no build step or dependency installation.

The UI works without configuration, but generation needs a Hugging Face token and a model endpoint available to that account. The `API_KEY` constant in `main.js` is intentionally empty.

## Generation setup

For a private local experiment, supply your own token locally and keep that edit out of Git. The current code calls `https://api-inference.huggingface.co/models/<selectedModel>` directly from the browser. Endpoint/model availability may require adapting the integration.

For a published application, implement a server-side proxy that holds the token and validates requests. A token embedded in browser JavaScript is visible to every visitor.

## Files

- `index.html` — controls, model choices, and gallery container.
- `main.js` — prompts, dimensions, inference requests, downloads, and theme persistence.
- `style.css` — responsive layout and loading/error states.

The gallery is held in page memory; only the theme preference is stored locally. API access, quotas, model restrictions, and network failures can prevent generation. There is no backend or automated test suite in this checkout.

See [LICENSE](LICENSE).
