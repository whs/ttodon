import DOMPurify from 'dompurify';

const ALLOWED_PROTOCOLS = new Set([
	'http:',
	'https:',
	'dat:',
	'dweb:',
	'ipfs:',
	'ipns:',
	'ssb:',
	'gopher:',
	'xmpp:',
	'magnet:',
	'gemini:',
]);

/**
 * Given a status HTML, sanitize it to only contains allowed HTML
 * @param status Status HTML
 * @return DocumentFragment
 */
export default function sanitize(status: string): DocumentFragment {
	let out = DOMPurify.sanitize(status, {
		RETURN_DOM_FRAGMENT: true,
		// https://github.com/mastodon/mastodon/blob/6273416292090b2f6bfda33f070cea325a1759df/lib/sanitize_ext/sanitize_config.rb#L68
		ALLOWED_TAGS: [
			'p',
			'br',
			'span',
			'a',
			'del',
			'pre',
			'blockquote',
			'code',
			'b',
			'strong',
			'u',
			'i',
			'em',
			'ul',
			'ol',
			'li',
		],
		ALLOWED_ATTR: ['href', 'rel', 'start', 'reversed'],
	});

	// Sanitize allowed schemes
	let links = out.querySelectorAll('a');
	for (let link of links) {
		if (!ALLOWED_PROTOCOLS.has(link.protocol)) {
			// Replace with text
			link.replaceWith(link.innerText);
			continue;
		}
		link.setAttribute('rel', 'nofollow noopener noreferrer');
		link.setAttribute('target', '_blank');
	}

	return out;
}
